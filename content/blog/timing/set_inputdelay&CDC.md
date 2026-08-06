---
title: "set_input_delay 与 CDC 的区别"
date: "2026-07-29"
tags: ["FPGA", "CDC", "时序", "ADC"]
description: "set_input_delay 解决输入时序模型问题，CDC 解决跨时钟域问题，两者是不同层面"
published: true
---

这两个是不同层面的东西：

- `set_input_delay`：告诉 Vivado"ADC数据从芯片出来后，最早/最晚什么时候到达 FPGA"；
- CDC：解决"ADC数据属于 `adc1_clk` 时钟域，但测量模块属于 `clk_125m` 时钟域"这个跨时钟问题。

## 一、`set_input_delay` 是什么

ADC的真实路径是：

```text
FL9627内部采样
    ↓
ADC输出数据线
    ↓
adc1_data_p/n
    ↓
FPGA IBUFDS + IDDR
```

ADC不会在 FPGA 的 `clk_125m` 上直接给数据，而是同时输出：

```text
adc1_clk_p/n
adc1_data_p/n
```

`adc1_clk_p` 是 ADC送给 FPGA 的采样时钟，数据相对于它有一定输出延迟。

例如手册可能给出：

```text
ADC时钟边沿之后 1.2 ns ～ 2.8 ns，数据有效
```

那么约束可以表达成：

```tcl
set_input_delay -clock adc1_clk_p -min 1.2 [get_ports adc1_data_p[*]]
set_input_delay -clock adc1_clk_p -max 2.8 [get_ports adc1_data_p[*]]
```

意思不是"给代码增加延迟"，而是告诉 Vivado：

```text
数据最早1.2 ns到，最晚2.8 ns到
```

Vivado才能检查：

- FPGA输入缓冲器；
- IDDR采样窗口；
- 数据建立时间；
- 数据保持时间。

如果不写，Vivado不知道ADC数据什么时候到，所以报告：

```text
Missing input delay
```

## 二、CDC是什么

CDC是 Clock Domain Crossing，中文就是"跨时钟域"。

你现在的数据路径是：

```text
adc1_clk域：
adc1_data_a_d0 <= adc1_data_a;

             ↓

clk_125m域：
loop_delay_meas_125(
    .clk_125(clk_125m),
    .adc_data_in(adc1_data_a_d0)
);
```

也就是：

```text
adc1_clk  ── ADC采集寄存器
                 ↓
clk_125m ── 延时测量模块
```

虽然两个时钟都是125 MHz，但它们不是同一个时钟：

- `adc1_clk` 是 ADC返回给FPGA的时钟；
- `clk_125m` 是 FPGA时钟IP产生的时钟；
- 两者相位差会受 ADC、PCB和输入时钟路径影响。

因此 `adc1_data_a_d0` 可能刚好在 `clk_125m` 边沿附近变化，导致：

- 有时采到上一拍；
- 有时采到下一拍；
- 多个ADC bit不是同一时刻采样；
- ADC波形出现毛刺；
- 阈值检测偶发错误。

这就是CDC问题。

## 三、当前代码为什么容易有CDC问题

现在是12位总线直接跨域：

```verilog
adc1_data_a_d0[11:0]
```

这不是单个控制信号，而是多位数据总线。不能简单对每一位各加一个两级同步器，因为那样可能出现：

```text
bit0已经是新数据
bit1还是旧数据
bit2又是新数据
```

最后组合出的ADC码可能是一个不存在的中间值。

## 四、正确解决CDC的几种方法

### 方法一：测量模块直接使用 `adc1_clk`

结构变成：

```text
ADC采集
    ↓
adc1_clk
    ↓
loop_delay测量和阈值判断
```

这样ADC数据和检测逻辑在同一个时钟域，最简单、最可靠。

但 DAC脉冲生成目前使用 `clk_125m`，所以需要把 `tx_mark` 同步到 `adc1_clk` 域。`tx_mark` 是单拍脉冲，不能直接跨域，需要使用 toggle 同步。

### 方法二：使用异步FIFO

结构：

```text
adc1_clk域
    ADC数据 → 异步FIFO
                  ↓
              clk_125m域
                  ↓
              测量模块
```

优点是多位数据安全跨域。缺点是会增加固定延迟，对于需要精确测传播延时的方案不是首选。

### 方法三：使用握手采样

适合DPC最终"在中心位置采一次或平均几次"。

## 五、这两个问题的关系

可以这样理解：

```text
set_input_delay：
ADC数据从芯片到FPGA输入端，什么时候到？

CDC：
ADC数据到达后，如何从adc1_clk安全交给clk_125m逻辑？
```

一个解决"输入时序模型"，一个解决"逻辑时钟域切换"。

最推荐的后续结构是：

```text
ADC数据在 adc1_clk 域完成采集和滤波
        ↓
用单bit toggle同步 tx_mark
        ↓
在 adc1_clk 域完成阈值判断和时间戳
```

这样既能避免12位ADC总线直接跨域，也更符合 ADC 的源同步输出方式。
