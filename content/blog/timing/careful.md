---
title: "FPGA 时序报告中的关键警告分析"
date: "2026-07-29"
tags: ["FPGA", "时序", "Vivado", "Debug"]
description: "解读 Vivado 报告中 ADC 时钟关系、输入延迟约束、DPIR、LUTAR 等警告的含义和处理方式"
published: true
---

这次已经通过了真正的时序要求：

```text
WNS  = +0.659 ns
TNS  = 0
WHS  = +0.004 ns
THS  = 0
Failed Routes = 0
```

所以阈值流水化已经生效。现在剩下的是约束和方法学警告，不是逻辑 setup/hold 失败。

## 1. 两个 Critical Warning：ADC时钟与FPGA时钟关系没有明确定义

报告内容是：

```text
The clocks adc1_clk_p and clk_out1_clk_wiz_0 are related
but they have no common primary clock
```

当前工程分别创建了：

```tcl
create_clock ... [get_ports adc1_clk_p]
create_clock ... [get_ports sys_clk_p]
```

而 `clk_out1_clk_wiz_0` 是从 `sys_clk_p` 经过时钟IP生成的。Vivado知道它们频率都是125 MHz，但不知道 `adc1_clk_p` 和 `clk_out1_clk_wiz_0` 的共同相位关系。

这与当前代码结构有关：

```text
adc1_clk采集 adc1_data_a_d0
clk_125m运行 loop_delay_meas
```

后续应二选一：

- 让测量逻辑直接运行在 `adc1_clk` 域；
- 或将 ADC数据通过正规CDC结构送入 `clk_125m` 域，再把两组时钟声明为异步。

不能仅仅用 `set_false_path` 把它隐藏，因为当前确实存在多位ADC总线跨时钟域。

## 2. 24个 TIMING-18：ADC输入没有输入延迟约束

报告明确指出：

```text
adc1_data_p[*] relative to adc1_clk_p
adc2_data_p[*] relative to adc2_clk_p
```

没有设置 `set_input_delay`。

这24个正好是：

```text
ADC1 12位 + ADC2 12位
```

需要根据 FL9627 数据手册中的数据输出延时、板级走线延时和IDDR采样方式补充：

```tcl
set_input_delay -clock [get_clocks adc1_clk_p] \
    -max <tco_max> [get_ports adc1_data_p[*]]

set_input_delay -clock [get_clocks adc1_clk_p] \
    -min <tco_min> [get_ports adc1_data_p[*]]
```

DDR采样还需要分别约束上升沿和下降沿，并对 ADC2 做同样约束。具体数值不能随便填，必须按 FL9627 手册和PCB延时计算。

## 3. 13个 DPIR-2：流水寄存器使用了异步复位

这些警告指向：

```text
delay_inst/thresh_scaled_s20
```

含义是：阈值流水线的寄存器使用异步复位，但DSP内部寄存器只支持同步复位，因此无法完全映射进DSP寄存器，可能影响资源和优化。

这不是当前时序失败原因，因为 WNS 已经为正。后续如果想继续优化，可以将阈值流水线寄存器改成同步复位；目前可以先保留。

## 4. 5个 LUTAR-1：ILA/debug hub内部复位警告

报告指向：

```text
dbg_hub
```

这是 Vivado ILA/debug hub 生成的内部逻辑，不是你的 DAC 或测量模块。一般不会影响功能，可以暂时忽略。

## 5. 2个 HPDR-1：SPI接口方向提示

对应：

```text
adc1_spi_io
adc2_spi_io
```

顶层声明为 `inout`，但层级内部实际没有同时看到驱动和负载。需要确认 SPI 模块是否正确使用三态：

```verilog
assign spi_io = spi_oe ? spi_out : 1'bz;
assign spi_in  = spi_io;
```

如果SPI读写功能正常，这两个可以暂时作为接口结构提示；如果SPI读回异常，再处理。

## 6. XDCB/XDCC：约束写法和重复时钟约束

这些属于：

- ILA自动生成的约束；
- 同名时钟被重复定义；
- XDC查找对象效率不高。

不影响当前 WNS，但可以后续清理。

另外，`top_drc_routed.rpt` 还有一个独立提示：没有设置 `CFGBVS` 和 `CONFIG_VOLTAGE`。这是器件配置电压属性，也不是当前内部时序问题。

结论是：

```text
阈值流水化：已解决主时序失败
剩余主要问题：ADC输入约束 + ADC/FPGA时钟关系建模
```

下一步最值得处理的是 ADC 的 `set_input_delay` 和 CDC结构，而不是继续修改 DAC复位值。
