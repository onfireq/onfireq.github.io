---
title: "FDCP 是什么？为什么会综合出 FDCP"
date: "2026-07-29"
tags: ["FPGA", "时序", "FDCP", "Verilog"]
description: "FDCP 是 Xilinx FPGA 内部触发器原语，异步复位加载动态值会触发，综合时改成常量即可解决"
published: true
---

FDCP 是 Xilinx FPGA 内部的一种触发器原语，不是 DAC 器件，也不是外部接口。

它大致有这些端口：

```text
D    普通数据输入
C    时钟
PRE  异步置1
CLR  异步清0
Q    输出
```

可以理解为：

```verilog
always @(posedge clk or posedge pre or posedge clr)
```

的硬件实现形式。

## 为什么之前会综合出 FDCP

原来的代码是：

```verilog
always @(posedge clk_125 or negedge rst_n) begin
    if (!rst_n)
        dac_pulse_data <= dac_min_cfg;
```

问题是：

```verilog
dac_min_cfg
```

是运行时变量，不是固定常量。

例如 `dac_pulse_data` 的不同bit可能需要：

```text
复位时某些bit变成0
复位时另一些bit变成1
```

但 FPGA触发器的异步复位通常只能直接完成：

```text
异步清零
```

或：

```text
异步置一
```

当代码要求异步复位时加载一个动态14位数，Vivado就需要组合逻辑去控制异步 `PRE/CLR`，最后可能推导出 FDCP 或类似结构。

## 为什么 Vivado 报警

普通数据路径可以这样分析：

```text
D → 组合逻辑 → Q
```

但异步 `PRE/CLR` 不按照普通时钟边沿工作。它们随时都可能改变，因此 Vivado无法像普通D输入那样准确计算：

```text
异步复位何时到达
复位释放是否满足时序
PRE/CLR竞争是否安全
```

所以会出现类似：

```text
FDCP cannot be timed accurately
```

这不是说 FDCP 本身坏了，而是说：

```text
这种异步控制方式无法进行可靠的常规时序分析
```

## 为什么固定成 `14'h2004` 后解决了

现在新模块中写的是：

```verilog
localparam [13:0] DAC_RESET_CODE = 14'h2004;

if (!rst_n)
    dac_pulse_data <= DAC_RESET_CODE;
```

复位值是编译期常量，Vivado可以把每一位分别实现为固定的异步置0或置1，不需要用动态组合逻辑控制异步端口。

复位释放以后，变量配置仍然可以正常使用：

```verilog
else if (!debug_enable)
    dac_pulse_data <= dac_min_cfg;
else
    dac_pulse_data <= dac_max_cfg;
```

这些都属于正常的时钟同步赋值，不会再形成之前那种动态异步加载。

## FDCP和普通寄存器的区别

普通寄存器：

```text
时钟到来时才采样D
```

FDCP：

```text
时钟到来时采样D
或者异步PRE/CLR立即改变Q
```

因此异步控制更快，但也更难约束。

## 当前还剩的 DPIR 警告是什么

你现在流水化后可能还会看到类似：

```text
DSP register has asynchronous reset
```

这和之前的FDCP不是完全同一个问题。

它的含义是：

```text
阈值流水线寄存器带异步复位，
导致不能完全合并到DSP内部的同步寄存器中。
```

这通常是资源和优化提示，不代表当前时序失败。现在你的：

```text
WNS = +0.659 ns
TNS = 0
```

已经说明主要时序路径是通过的。

总结一下：

```text
FDCP：
带异步PRE/CLR的FPGA触发器

之前的问题：
异步复位时给寄存器加载动态dac_min_cfg

修复方式：
异步复位只加载固定14'h2004，
动态DAC配置放到时钟同步分支
```
