---
title: "FPGA 自适应阈值流水化与 ILA 优化"
date: "2026-07-29"
tags: ["FPGA", "时序", "流水线", "ILA", "ADC"]
description: "通过流水化阈值计算解决 10.9ns 数据路径超时，同时优化 ILA 深度降低布线拥塞"
published: true
---

先不改代码。现在可以确定：FDCP问题已经消失了，截图里已经没有 `dac_pulse_data_reg` 的 FDCP 告警。剩下的是另一类 timing 问题，不能靠把 DAC 复位值写死解决。

目前最可疑的有三处，优先级如下。

## 1. ADC跨时钟域是首要问题

当前数据路径是：

```text
ADC引脚
  ↓ adc1_clk采集
adc1_data_a_d0
  ↓ 直接使用
clk_125m下的loop_delay_meas_125
```

代码中：

```verilog
always @(posedge adc1_clk)
    adc1_data_a_d0 <= ~adc1_data_a;
```

但测量模块使用：

```verilog
.clk_125(clk_125m),
.adc_data_in(adc1_data_a_d0)
```

`adc1_clk` 和 `clk_125m` 虽然都是125 MHz，但不是同一个时钟：

- `clk_125m` 是 FPGA 时钟IP产生的；
- `adc1_clk` 是 ADC 返回时钟；
- 两者存在板级传播延时和相位差；
- Vivado不能假定它们边沿对齐。

这相当于12位ADC总线直接跨时钟域。可能导致：

- ADC多个bit不是同一拍数据；
- 阈值判断偶发提前或推迟；
- `edge_det` 有时有、有时没有；
- ILA波形出现毛刺或异常码；
- 跨时钟路径产生 setup/hold timing violation。

不能简单用：

```tcl
set_clock_groups -asynchronous
```

把告警隐藏，因为硬件问题仍然存在。

推荐方案是让ADC阈值判断工作在 `adc1_clk` 域：

```text
ADC数据 → adc1_clk寄存 → adc1_clk滤波/阈值判断
```

然后只把 `tx_mark` 从 `clk_125m` 同步到 `adc1_clk` 域。单bit事件可以用 toggle synchronizer，远比直接跨12位总线可靠。

## 2. ILA过大可能造成严重布线拥塞

现在的ILA窗口已经能看到约9万个采样点，说明采样深度可能是：

```text
65536或131072
```

同时探针包含：

```text
sub_delay_out  32位
ADC            12位
free_cnt       32位
tx_ts          32位
rx_ts          32位
多个单bit标志
```

这会占用大量 BRAM 和布线资源。实现日志里已经出现约数百个ILA BRAM，极易造成布线绕远、时序违例。

## 3. 自适应阈值计算组合路径偏长

当前一拍内包含：

```verilog
saved_adc_span * high_pct
high_scaled / 100
saved_adc_min + ...
ADC阈值比较
```

逻辑关系：

```text
寄存器
 → 13×10位乘法
 → 除以100
 → 12位加法
 → 阈值比较
 → 控制寄存器
```

虽然除数是常数，Vivado会优化，但加上 ILA 拥塞后仍可能成为最差路径。

## 修复方案

### 阈值流水化

把阈值计算拆成至少两级：

```text
第1级：保存 span 和 min
第2级：计算 span × high_pct
第3级：计算 threshold
第4级：使用已经寄存的 threshold 做ADC判断
```

实际测量周期是12500拍，阈值晚几拍不会影响测量。

### 50%阈值简化

如果当前目标主要是测传播延时，可以用50%阈值：

```verilog
adc_thresh_50 =
    ({1'b0, saved_adc_max} +
     {1'b0, saved_adc_min}) >> 1;
```

这只需要加法和移位，不需要乘法器、除法器，时序会明显改善。

## 推荐处理顺序

```text
1. 先把阈值计算流水化
2. 重新综合实现
3. 确认125 MHz WNS恢复为正值
4. 再补ADC/DAC外部输入输出时序约束
```

不建议通过 `set_false_path` 或 `set_multicycle_path` 强行掩盖，因为报告已经明确指出是真实的模块内组合路径过长。
