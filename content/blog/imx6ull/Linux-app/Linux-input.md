---
title: "Linux-input子系统"
date: "2026-10-11"
tags: ["Linux", "i.MX6ULL"]
description: "介绍 Linux input 子系统、输入设备节点与输入事件的读取。"
published: true
order: 4
---

## Linux-input子系统

用于处理输入设备。

常见的输入设备有：

- 键盘
- 鼠标
- 触摸屏
- 触摸板
- 触摸笔

为了处理输入设备，linux提供了input子系统。用于管理输入设备。屏蔽硬件差异。

input子系统提供了一个统一的接口，用于访问和控制输入设备。

输入设备的驱动程序会将输入数据发送到input子系统，input子系统会将数据发送到应用层。

注册成功后，生成设备节点。

```bash
root@ATK-IMX6U:/dev/input# ls
by-path  event0  event1  event2  mice
```

用户程序来读取设备节点，获取输入数据。

led与beep的控制，使用write函数。
input则是使用read函数。

输入数据是一个结构体，包含了输入设备的类型、事件类型、事件值等信息。

触摸屏的输入数据，包含了触摸点的坐标、触摸点的状态等信息。

code、type、value确保了输入数据的格式。
time则表示事件发生的时间。
事件类型有：

- EV_KEY：按键事件
- EV_REL：相对移动事件
- EV_ABS：绝对移动事件
- EV_MSC：其他事件

在

```bash
/proc/bus/input
```

目录下，包含了所有注册的输入设备的事件类型。

```bash
root@ATK-IMX6U:/proc/bus/input# ls
devices  handlers
```

目录下，包含了所有注册的输入设备和事件类型。

```bash
root@ATK-IMX6U:/proc/bus/input# cat devices 
I: Bus=0019 Vendor=0000 Product=0000 Version=0000
N: Name="20cc000.snvs:snvs-powerkey"
P: Phys=snvs-pwrkey/input0
S: Sysfs=/devices/platform/soc/2000000.aips-bus/20cc000.snvs/20cc000.snvs:snvs-powerkey/input/input0
U: Uniq=
H: Handlers=kbd event0 
B: PROP=0
B: EV=3
B: KEY=100000 0 0 0

I: Bus=0018 Vendor=dead Product=beef Version=28bb
N: Name="goodix-ts"
P: Phys=input/ts
S: Sysfs=/devices/virtual/input/input2
U: Uniq=
H: Handlers=event1 
B: PROP=3
B: EV=b
B: KEY=e520 0 0 0 0 0 0 0 0 0 0
B: ABS=2658000 0

I: Bus=0019 Vendor=0001 Product=0001 Version=0100
N: Name="gpio_keys@0"
P: Phys=gpio-keys/input0
S: Sysfs=/devices/platform/gpio_keys@0/input/input3
U: Uniq=
H: Handlers=kbd event2 
B: PROP=0
B: EV=100003
B: KEY=40000 0 0 0
```

devices：

- pwrkey：电源键
- goodix-ts：触摸屏
- gpio_keys@0：gpio按键

```bash
root@ATK-IMX6U:/proc/bus/input# cat handlers 
N: Number=0 Name=rfkill
N: Number=1 Name=kbd
N: Number=2 Name=sysrq (filter)
N: Number=3 Name=mousedev Minor=32
N: Number=4 Name=evdev Minor=64
```

handlers：

- rfkill：无线设备
- kbd：键盘
- sysrq：系统rq
- mousedev：鼠标
- evdev：事件设备

碰到了复杂的设备，驱动方式也不会更加复杂。

