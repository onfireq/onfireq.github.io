---
title: "led闪烁"
date: "2026-10-11"
tags: ["Linux", "i.MX6ULL"]
description: "记录 Linux 命令行参数、sysfs 接口与 i.MX6ULL LED 控制程序。"
published: true
---

## 命令行参数

```text
命令 [选项] [参数]
```

```bash
tar -cvzf 压缩包名.tar.gz 目录名
```

参数：-cvzf
选项：-c、-v、-f、-z：创建、显示详细信息、指定文件名、压缩文件
参数：压缩包名.tar.gz、目录名

安装软件

```bash
apt update
apt install -y 软件名
```

参数：软件名
选项：-y：自动确认安装

操作vim编辑器

```bash
vim 文件名
```

参数：文件名
选项：无

先按i键进入插入模式，再输入内容，最后按esc键退出插入模式，再按:q!保存并退出

emmc硬盘，掉电不丢失。属于flash存储器。

DDR内存，掉电丢失。属于ram存储器。

使用gcc直接编译而不指定输出文件名，会默认输出到标准输出（a.out）。

```bash
gcc -o 程序名 程序名.c
```

参数：程序名、程序名.c
选项：-o：指定输出文件名

编译为arm架构的可执行文件

```bash
arm-linux-gcc -o 程序名 程序名.c 
```

参数：程序名、程序名.c

修改虚拟机的ip地址

```bash
sudo ifconfig ens33 up
sudo ifconfig ens33 inet xxx.xxx.xxx.xxx netmask xxx.xxx.xxx.xxx
```

参数：ens33
选项：inet、netmask
参数：xxx.xxx.xxx.xxx、xxx.xxx.xxx.xxx

虚拟机文件传输到imx6ull-alpha板子上

```bash
scp 文件名 root@板子ip:板子目录/
```

参数：文件名、板子ip、板子目录
选项：无

## 带参数的主函数

参数并不是写程序的时候决定的，而是在运行的时候决定的。

```c
int main(int argc, char *argv[])
{
    int i;
    for(i = 0; i < argc; i++)
    {
        printf("参数%d：%s\n", i, argv[i]);
    }
    return 0;
}
```

argc：参数个数
argv[]：参数数组，每个元素是一个字符串，表示一个参数。

使用方法

```cmd
./程序名 参数1 参数2 ...
```

参数：程序名、参数1、参数2 ...
选项：无

输出

```cmd
参数0：./程序名
参数1：参数1
参数2：参数2
```

控制led灯要通过带参数的主函数来实现。
参数1：led编号
参数2：led状态（0：关闭，1：打开）
参数3：led编号
参数4：led状态（0：关闭，1：打开）

通过主函数带的参数是on还是off，来控制led灯的亮灭。
on：led灯亮
off：led灯灭

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]){
    if(argc < 2){
        printf("Usage: %s <on|off>\n", argv[0]);
        exit(-1);
    }
    if (!strcmp(argv[1], "on"))
    {
        printf("LED is ON\n");
    }
    else if (!strcmp(argv[1], "off"))
    {
        printf("LED is OFF\n");
    }
    else
    {
        printf("Invalid argument: %s\n", argv[1]);
        printf("Usage: %s <on|off>\n", argv[0]);
        exit(-1);
    }
    

    return 0;
}
```

## 使用sysfs控制led灯的亮灭

使用sysfs控制led灯的亮灭。
sysfs：系统文件系统，用于将内核数据结构暴露给用户空间。

linux系统中，一切皆文件。

led灯的sysfs路径：/sys/class/gpioleds/led0/brightness
参数1：led编号
参数2：led状态（0：关闭，1：打开）
参数3：led编号
参数4：led状态（0：关闭，1：打开）

通过主函数带的参数是on还是off，来控制led灯的亮灭。
on：led灯亮
off：led灯灭

使用方法

```bash
echo 1 > /sys/class/leds/sys-led/brightness
```

用户空间->内核空间->驱动程序->硬件设备

## 使用c语言实现led灯的控制灭程序

呼吸灯程序

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"

int main(){
    int fd;
    fd = open(LED_BRIGHTNESS, O_RDWR);
    if(fd < 0){
        perror("open error");
        exit(-1);
    }
    while(1){
        write(fd, "1", 1);
        sleep(1);
        write(fd, "0", 1);
        sleep(1);
    }
}
```

- fd：文件描述符。也可以称为文件句柄。赋值为open()函数返回的值。变量名可以是任何合法的标识符。
- open()函数打开文件，返回文件描述符。
- write()函数向文件写入数据。
- sleep()函数暂停程序执行，等待指定的时间。

通过打开某个文件，进行对某个设备的控制。

还是那句话：在linux系统中，一切皆文件。
文件：文件系统中的一个实体，用于存储数据。

控制led灯亮灭

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"

#define USAGE() fprintf(stderr, "Usage: %s <on|off>\n", argv[0])

int main(int argc, char *argv[]){
    if(argc < 2){
        USAGE();
        exit(-1);
    }

    int fd = open(LED_BRIGHTNESS, O_RDWR);
    if(fd < 0){
        perror("open");
        exit(-1);
    }

    if (!strcmp(argv[1], "on"))
    {
        write(fd, "1", 1);
        printf("LED is ON\n");
    }
    else if (!strcmp(argv[1], "off"))
    {
        write(fd, "0", 1);
        printf("LED is OFF\n");
    }
    else
    {
        printf("Invalid argument: %s\n", argv[1]);
        USAGE();
        exit(-1);
    }

    close(fd);
}
```

主函数带参数，后面的参数控制led灯的亮灭。

控制频率的led灯

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"

#define USAGE() fprintf(stderr, "Usage: %s <delay>\n", argv[0])

int main(int argc, char *argv[]){
    int fd, delay;
    fd = open(LED_BRIGHTNESS, O_RDWR);
    if(fd < 0){
        perror("open");
        exit(-1);
    }
    sscanf(argv[1], "%d", &delay); //将argv[1]转换为整数并存储在delay中
    while(1){
        write(fd, "1", 1);
        sleep(delay);
        write(fd, "0", 1);
        sleep(delay);
    }
}
```

- scanf是扫描输入，将输入的字符串转换为指定的类型。
- sscanf是扫描字符串，将字符串转换为指定的类型。

设置trigger驱动led

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

#define  LED_TRIGGER    "/sys/class/leds/sys-led/trigger"
#define  LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"
#define  USAGE()    fprintf(stderr, "usage:\n"  \
                "    %s <on|off>\n"   \
                "    %s <trigger> <type>\n", argv[0], argv[0])

int main(int argc, char *argv[])
{
    int fd1, fd2;

    /* 校验传参 */
    if (2 > argc) {
        USAGE();
        exit(-1);
    }

    /* 打开文件 */
    fd1 = open(LED_TRIGGER, O_RDWR);
    if (0 > fd1) {
        perror("open error");
        exit(-1);
    }

    fd2 = open(LED_BRIGHTNESS, O_RDWR);
    if (0 > fd2) {
        perror("open error");
        exit(-1);
    }

    /* 根据传参控制LED */
    if (!strcmp(argv[1], "on")) {
        write(fd1, "none", 4);   //先将触发模式设置为none
        write(fd2, "1", 1);   //点亮LED
    }
    else if (!strcmp(argv[1], "off")) {
        write(fd1, "none", 4);   //先将触发模式设置为none
        write(fd2, "0", 1);   //LED灭
    }
    else if (!strcmp(argv[1], "trigger")) {
        if (3 != argc) {
            USAGE();
            exit(-1);
        }

        if (0 > write(fd1, argv[2], strlen(argv[2])))
            perror("write error");
    }
    else
        USAGE();

    exit(0);
}
```

- LED_TRIGGER：led灯的触发模式文件。
- LED_BRIGHTNESS：led灯的亮度文件。
- none：不触发led灯。
- trigger：触发led灯。
