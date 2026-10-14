---
title: "input设备"
date: "2026-10-12"
tags: ["Linux", "i.MX6ULL"]
description: "介绍 Linux input 设备、输入设备节点与输入事件的读取具体实现。"
published: true
order: 5
---

## input设备节点

```bash
./key /dev/input/event0
```

### 实现按键按下时获得的结构体的数据

key文件的设备文件的文件目录不写死，而是从设备节点中获取。通过主函数带参数的形式，传递进去。

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/input.h>
int main(int argc, char *argv[])
{
    struct input_event in_ev = {0};
    int fd = -1;
    /* 校验传参 */
    if (2 != argc) {
    fprintf(stderr, "usage: %s <input-dev>\n", argv[0]);
    exit(-1);
    }
    /* 打开文件 */
    if (0 > (fd = open(argv[1], O_RDONLY))) {
    perror("open error");
    exit(-1);
    }
    for ( ; ; ) {
    /* 循环读取数据 */
    if (sizeof(struct input_event) !=
    read(fd, &in_ev, sizeof(struct input_event))) {
    perror("read error");
    exit(-1);
    }
    printf("size of struct is %d\n",sizeof(struct input_event));
    printf("type:%d code:%d value:%d\n",
    in_ev.type, in_ev.code, in_ev.value);
    }
}
```

注册input设备的结构体，用于存储input事件的类型。type、code、value。

```c
struct input_event in_ev = {0};
```

结构体的参数：

- type：事件类型
- code：注册值
- value：事件值

要打开按键对应的设备文件

```c
int fd = open(dev, O_RDONLY);
if(fd < 0){
    perror("open");
    exit(-1);
}
```

for循环

```c
for( ; ; )
```

如果是这种，等同于while循环

```c
while(1)
```

```c
read(fd, &in_ev, sizeof(struct input_event));
```

读fd中的数据，将数据读取到in_ev结构体中，要读取的字节数为结构体的大小即sizeof(struct input_event)。

```c
if(sizeof(struct input_event) != 
    read(fd, &in_ev, sizeof(struct input_event))){
    perror("read");
    exit(-1);
    }
```

看读取的字节数的返回值是否等于sizeof(struct input_event)。
如果等于，说明读取成功。
如果不等于，说明读取失败。

内核注册input设备：type、code、value
都等于0，代表了一个同步事件

按键类事件

```bash
type:1 code:114 value:1/0
```

小技巧：

```c
if(1 == a)
```

比

```c
if(a == 1)
```

要好，因为1是常量，a是变量。当少写一个=时，会报错。而a = 1不会报错。这样可以避免错误。

### 实现按键按下时显示按键状态

（按下、松开、长按的code）

```c
/*****************************************
本程序实现按键按下时显示显示“按下”，送开始显示“松开”
长按时显示“长按”
*****************************************/
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/input.h>
int main(int argc, char *argv[])
{
    struct input_event in_ev = {0};
    int fd = -1;
    int value = -1;
    /* 校验传参 */
    if (2 != argc) {
    fprintf(stderr, "usage: %s <input-dev>\n", argv[0]);
    exit(-1);
    }
    /* 打开文件 */
    if (0 > (fd = open(argv[1], O_RDONLY))) {
    perror("open error");
    exit(-1);
    }
    for ( ; ; ) {
        /* 循环读取数据 */
        if (sizeof(struct input_event) !=
        read(fd, &in_ev, sizeof(struct input_event))) {
        perror("read error");
        exit(-1);
        }
        if (EV_KEY == in_ev.type) { //按键事件
            switch (in_ev.value) {
                case 0:
                printf("code<%d>: 松开\n", in_ev.code);
                break;
                case 1:
                printf("code<%d>: 按下\n", in_ev.code);
                break;
                case 2:
                printf("code<%d>: 长按\n", in_ev.code);
                break;
            }
        }
    }
}
```

### 按键控制LED

```c
/*****************************************
本程序实现按键控制LED灯的亮灭，按键按下时灯亮
按键松开时LED灯灭
*****************************************/
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/input.h>
#define LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"
int main(int argc, char *argv[])
{
    struct input_event in_ev = {0};
    int fd = -1;
    int fd_LED;
    int value = -1;
    /* 校验传参 */
    if (2 != argc) {
    fprintf(stderr, "usage: %s <input-dev>\n", argv[0]);
    exit(-1);
    }
    /* 打开文件 */
    if (0 > (fd = open(argv[1], O_RDONLY))) {
    perror("open error");
    exit(-1);
    }
    fd_LED = open(LED_BRIGHTNESS, O_RDWR);//以可读可写的方式打开LED驱动文件
    if(fd_LED < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_LED,"0",1);//让LED灯先灭，再亮
    for ( ; ; ) {
        /* 循环读取数据 */
        if (sizeof(struct input_event) !=
        read(fd, &in_ev, sizeof(struct input_event))) {
        perror("read error");
        exit(-1);
        }
        if (EV_KEY == in_ev.type) { //按键事件
            switch (in_ev.value) {
                case 0:
                printf("code<%d>: 松开\n", in_ev.code);
                write(fd_LED,"0",1);//点亮LED灯，“1”代表点亮，后面的1是指写入的字节数
                break;
                case 1:
                printf("code<%d>: 按下\n", in_ev.code);
                write(fd_LED,"1",1);//点亮LED灯，“1”代表点亮，后面的1是指写入的字节数
                break;
                case 2:
                printf("code<%d>: 长按\n", in_ev.code);
                write(fd_LED,"1",1);//点亮LED灯，“1”代表点亮，后面的1是指写入的字节数
                break;
            }
        }
    }
}
```

### 驱动键盘

当键盘插入到系统中时，会自动注册为一个input设备。
此时

```bash
root@ATK-IMX6U:/proc/bus/input# cat devices 
```

会多

```bash
N: Name="SEM USB Keyboard"
```

的设备

这个时候，我们可以打开键盘的设备文件，读取键盘的事件。

```bash
root@ATK-IMX6U:/proc/bus/input# ls /dev/input
```

此时会多出事件文件event3、event4。

这样子我们同样可以使用我们之前写好的程序来驱动键盘，实现按键按下时获得结构体的数据、按键按下时显示按键状态、按键控制LED灯的亮灭等。

对于驱动设备来讲，可以复用。

硬件改变了，程序可以不用改变，继续实现对应功能。
