---
title: "触摸屏输入设备"
date: "2026-10-12"
tags: ["Linux", "i.MX6ULL"]
description: "介绍触摸屏输入设备、输入设备节点与输入事件的读取具体实现。"
published: true
order: 6
---

有了操作系统，有了input子系统，硬件变复杂之后，编程的难度并没有马上带来很大的变化。

设备打开 -> 读取输入事件 -> 关闭设备

读进来的数据放到input_event结构体中，每个结构体表示一个输入事件。对结构体进行分析，判断事件类型，根据事件类型进行处理。

- type: 事件类型
- code: 事件编码
- value: 事件值
- time: 事件时间

把按键换成键盘的时候，程序根本不用改。

tslib是一个库，用于处理触摸屏等输入事件。

touch screen library

将input子系统再抽象一下，把细节再封装一下，形成一个库，提供给应用程序调用。

让我们有一些函数来实现触摸屏的功能。api函数。

API函数：Application Programming Interface（应用程序编程接口）

封装与抽象思想

libts是debian系统中的一个库，用于处理触摸屏等输入事件。

ts_print: 打印触摸屏事件，一个槽

ts_print_mt: 打印多点触摸屏事件，多个槽，slot

AT-IMX6U可以直接使用这两个命令来打印触摸屏事件。

显示屏和触摸屏是两个不同的设备，显示屏是输出设备，触摸屏是输入设备。

```bash
ts_print
ts_print_mt
```

```bash
evtest /dev/input/event0
```

意思是测试event0设备。查看其支持的事件类型与事件编码并测试。

## 指针与取地址

如果没有定义指针

```c
int x = 5;

*&x   // &x 取地址 → *&x 解引用 → 回到 x 本身，值 = 5
&*x   // ❌ 非法！x 不是指针，不能 *x
```

如果有定义指针

```c
int x = 5;
int *p = &x;

*&p   // &p 取 p 的地址 → 解引用 → 回到 p 本身，值 = p 存的那个地址
&*p   // *p 解引用得到 x → &*p 取 x 的地址 → 回到 p 本身，值 = p 存的那个地址
```

然而，一般只定义指针，而不是直接操作变量。因为指针可以方便地操作多个变量。例如

```c
int x = 5;
int y = 10;
int *p = &x;         // p 先指向 x
printf("%d\n", *p);  // 输出 5
p = &y;              // 改指向：p 现在指向 y
printf("%d\n", *p);  // 输出 10 —— 同一个指针，操作了第二个变量
```

## 程序实现

指针，地址。存的是一个结构体的起始地址。
取地址运算符：&，用于取变量的地址。
解引用运算符：*，用于获取指针指向的变量。
*tsdev 表示获取指针tsdev指向的变量。
tsdev->fd 表示获取指针tsdev指向的变量的fd成员。



1. 打开触摸屏设备：ts_setup()。

   ```c
   struct tsdev *ts_open(const char *devname, int nonblock);
   struct tsdev *ts_setup(const char *devname, int nonblock);
   ```

   - 参数：
     - devname: 设备节点路径，例如/dev/input/event0。也可以为NULL，则从TSLIB_TSDEVICE文件中读取设备节点路径。
     - nonblock: 非阻塞模式，0表示阻塞模式，1表示非阻塞模式。

   - 返回值：
     - 设备指针，用于后续操作。

   ```c
   *  //表示指针
   struct tsdev *tsdev;  //合起来表示指向触摸屏设备信息结构体的指针。（设备句柄）
   ts_setup(NULL, 0);  //返回一个设备指针，得到设备的句柄tsdev。
   ```

   ```c
    // 源码逻辑（简化）：ts_open函数只打开设备。
    struct tsdev *ts_open(const char *dev_name, int nonblock)
    {
        int fd = open(dev_name, O_RDONLY | (nonblock ? O_NONBLOCK : 0));
        if (fd == -1) return NULL;
        struct tsdev *ts = malloc(sizeof(*ts));  // 分配结构体
        ts->fd = fd;                              // 存下描述符
        return ts;
    }

    // 源码逻辑（简化）：ts_setup函数打开设备并初始化。ts_setup=ts_open+ts_config;
    struct tsdev *ts_setup(const char *dev_name, int nonblock)
    {
        // 1. dev_name 为 NULL 时，自动找设备：
        //    环境变量 TSLIB_TSDEVICE → 默认路径 /dev/input/touchscreen
        // 2. 调 ts_open() 打开设备
        // 3. 调 ts_config() 读取 ts.conf 配置文件，建立滤波器链
        // 4. ts_config 失败则 close 并返回 NULL
    }
   ```

多做了三件事：

- 自动找设备：dev_name 传 NULL 时，按 TSLIB_TSDEVICE 环境变量 → 默认路径依次尝试
- 读配置：按 TSLIB_CONFFILE 环境变量加载 ts.conf
- 建滤波器链：按配置挂上模块：linear（线性校正，依赖校准文件）、debounce（去抖）、median（中值滤波）等

2. 触摸屏读操作：ts_read()。

   ```c
   int ts_read(struct tsdev *tsdev, struct ts_sample *sample, int max_samples);
   ```

   - 参数：
     - tsdev: 设备指针，用于后续操作。
     - sample: 指向结构体ts_sample的指针，用于存储读取到的触摸屏样本。
     - max_samples: 最大读取样本数量。
   - 返回值：
     - 读取到的触摸屏样本数量。

     读到的数据放在sample结构体中。而tsdev结构体中包含了设备的描述符fd。
     ts_read总体表达了，读取触摸屏设备tsdev中的样本。

   ```c
   struct ts_sample sample;  //表示触摸屏样本的结构体。
   {
      int x; //x坐标
      int y; //y坐标
      int pressure; //压力
      int valid; //有效
      struct timeval time; //时间
   };
   ```

   典型使用：

   ```c
     //定义一个结构体ts_sample的变量sample，用于存储读取到的触摸屏样本。
     struct ts_sample sample;
     //读取触摸屏样本。
     int ret = ts_read(tsdev, &sample, 1);  //读取一个样本。
     if(ret > 0)
     {
        //处理触摸屏样本sample
        printf("x = %d, y = %d, pressure = %u, time = %ld.%06ld\n",
        sample.x, sample.y, sample.pressure,
        sample.time.tv_sec, sample.time.tv_usec);
     }
   ```

     使用取地址运算符的意思是：获取变量sample的地址。
     而

     ```c
     ts_read(struct tsdev *tsdev, struct ts_sample *sample, int max_samples)
     ```

     "调用侧取地址、函数侧解引用"
     函数签名里的 * 不是解引用运算符，只是声明了一个指向结构体ts_sample的指针。解引用发生在函数内部。
     天生包含一个*解引用运算符。默认变量为地址，这么做的目的是为了方便操作结构体的成员。
     声明时 * 表示"这是指针"，使用时 * 才是"解引用"。
     *sample 表示获取指针sample指向的变量。sample如果开始定义的为一个变量，则&sample表示获取变量sample的地址。所以实际上是 *&sample 以表示变量值。

     传指针的真正原因，不只是"方便操作成员"

     "方便用 -> 操作结构体成员"是附带好处，真正原因是：

     - 输出参数模式（最主要）：C 函数只能 return 一个值，而 ts_read 要带回 x、y、pressure、time 四个数据，return 装不下，只能通过指针"写回"调用者的变量。
     - 效率：结构体按值传递会把整个结构体拷贝一遍；传指针只传 4/8 字节的地址。

    ts_read 和 scanf 是一家人：函数要把多个数据写回调用者的变量，所以调用者传地址（&），函数内部用指针解引用（*/->）往里面写。 声明里的 * 只是"这是个指针"的标记，解引用发生在使用的时候。

3. 关闭触摸屏设备：ts_close()。

   ```c
   int ts_close(struct tsdev *tsdev);
   ```

   - 参数：
     - tsdev: 设备指针，用于后续操作。
   - 返回值：
     - 0 成功，-1 失败。

### code

```c
#include <stdio.h>
#include <stdlib.h>
#include <tslib.h>

int main(int argc, char *argv[])
{
    struct tsdev *ts = NULL;
    struct ts_sample samp;
    int pressure = 0;

    /* 打开并配置触摸屏设备 
    struct tsdev *ts_setup(const char *dev_name, int nonblock)
    对于 ts_setup()来说，参数 dev_name 可以设置为 NULL，当 dev_name 设置为 NULL 时，ts_setup()函数内部会读取
TSLIB_TSDEVICE 环境变量，获取该环境变量的内容以得知触摸屏的设备节点。
参数 nonblock 表示是否以非阻塞方式打开触摸屏设备，如果
nonblock 等于 0 表示阻塞方式，如果为非 0 值则表示以非阻塞方式打开。
    */
    ts = ts_setup(NULL, 0);
    if (NULL == ts) {
        fprintf(stderr, "ts_setup error");
        exit(EXIT_FAILURE);
    }

    while(1)
    {
        /*
        于 ts_read 用于读取单点触摸数据，而ts_read_mt 则用于读取多点触摸数据
        int ts_read(struct tsdev *ts, struct ts_sample *samp, int nr)
        int ts_read_mt(struct tsdev *ts, struct ts_sample_mt **samp, int max_slots, int nr)
        参数 ts 指向一个触摸屏设备句柄，参数 nr 表示对一个触摸点的采样数，设置为 1 即可！
        ts_read()函数的 samp 参数是一个 struct ts_sample *类型的指针，指向一个 struct ts_sample 对象，struct 
        ts_sample 数据结构描述了触摸点的信息；调用 ts_read()函数获取到的数据会存放在 samp 指针所指向的内存
        中。
        struct ts_sample 
        int x; //X 坐标
        int y; //Y 坐标
        unsigned int pressure; //按压力大小
        struct timeval tv; //时间

        */
        if (0 > ts_read(ts, &samp, 1)) {
            fprintf(stderr, "ts_read error");
            ts_close(ts);
            exit(EXIT_FAILURE);
        }

        if (samp.pressure) //按压力>0
        {
            if (pressure) //若上一次的按压力>0
                printf("移动(%d, %d)\n",samp.x, samp.y);
            else
                printf("按下(%d, %d)\n",samp.x, samp.y);

        }
        else
        {
            printf("松开\n");
        }

        pressure = samp.pressure;


    
    }
    ts_close(ts);
    exit(EXIT_FAILURE);
}
```

## 安装交叉编译环境

fsl-imx-x11-glibc-x86_64-meta-toolchain-qt5-cortexa7hf-neon-toolchain-4.1.15-2.1.0_20241230.sh

是用于交叉编译的工具链。
包含编译器、链接器、库等。

先添加可执行的权限：

```bash
chmod a+x fsl-imx-x11-glibc-x86_64-meta-toolchain-qt5-cortexa7hf-neon-toolchain-4.1.15-2.1.0_20241230.sh
```

- chmod：改变文件权限
  - a：所有用户
  - x：可执行
  - +：添加权限
  - -：移除权限

然后执行：

```bash
./fsl-imx-x11-glibc-x86_64-meta-toolchain-qt5-cortexa7hf-neon-toolchain-4.1.15-2.1.0_20241230.sh
```

回车安装

安装完后在/opt/目录下。

```bash
qing@qing-VMware-Virtual-Platform:/opt$ ls
fsl-imx-x11
```

然后移植tslib，并解压缩

```bash
tar -zxvf tslib-2.1.0.tar.gz -C /opt/
```

- tar：解压缩文件
  - -zxvf：解压缩 tar.gz 文件并指定解压缩目录
    - -v：显示解压缩过程
    - -f：指定解压缩文件
    - -z：解压缩 tar.gz 文件
    - -x：解压缩文件
  - -C：指定解压缩目录
  - .：当前目录
  - /opt：指定解压缩目录为/opt/目录

```bash
qing@qing-VMware-Virtual-Platform:~/linux/lib/tslib-1.16$ source /opt/fsl-imx-x11/4.1.15-2.1.0/environment-setup-cortexa7hf-neon-poky-linux-gnueabi 
```

- source：执行脚本文件，加载环境变量。

```bash
qing@qing-VMware-Virtual-Platform:~/linux/lib/tslib-1.16$ ./configure --host=arm-poky-linux-gnueabi --prefix=/home/qing/tools/tslib
```

- ./configure：配置文件
  - --host：指定目标平台
  - --prefix：指定安装目录

然后编译

```bash
make
```

然后安装

```bash
make install
```

## 编译

写好程序后，编译时需要指定交叉编译器。

```bash
arm-linux-gnueabihf-gcc -I /home/qing/tools/tslib/include/ -L /home/qing/tools/tslib/lib/ -lts test1.c -o test1
```

- CC：指定交叉编译器
- -o：指定输出文件名
- test1.c：指定源文件
- -I：指定头文件路径
- -L：指定库文件路径
- -lts：指定库文件

configure 写：--host=arm-poky-linux-gnueabi（这是 Yocto SDK 的前缀）
编译应用写：arm-linux-gnueabihf-gcc（这是正点原子 Linaro 工具链的前缀）
source environment-setup-cortexa7hf-neon-poky-linux-gnueabi 那步会设置 CC=arm-poky-linux-gnueabi-gcc，所以 tslib 是用 Yocto 工具链编出来的；但 test1.c 又拿 Linaro 工具链编。

## 触摸屏多点触摸

```c
struct ts_sample_mt sample;

// 每一个触摸点的数据使用一个结构体ts_sample_mt表示，
// 每个结构体包含x轴坐标、y轴坐标、压力值、触摸点槽位、跟踪ID、是否有效、时间等信息。
// 多个触摸点可组织成一个数组，每个元素为一个触摸点的结构体。

// 读取多点触摸数据
ts_sample_mt sample{
    int x;          // x轴坐标
    int y;          // y轴坐标
    unsigned int pressure; // 压力值
    int slot;       // 区分不同的触摸点槽位
    int tracking_id; // 跟踪ID
    short valid;    // 是否有效
    struct timeval time; // 时间
}
// 触摸屏轴信息
struct input_absinfo absinfo{
    int value;       // 当前值
    int minimum;     // 最小值
    int maximum;     // 最大值，最多可以处理的槽位
    int fuzz;        // 滤波值
    int flat;        // 平滑值
    int resolution;  // 分辨率
}
// 读取触摸屏轴信息
int ts_get_absinfo(struct tsdev *tsdev, int abs, struct input_absinfo *absinfo);
```

操作对象如果是一个，使用变量名。
操作对象如果是多个，使用指针。

### code

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <linux/input.h>
#include <tslib.h>

int main(int argc, char *argv[])
{
    struct tsdev *ts = NULL;
    struct ts_sample_mt *mt_ptr = NULL;
    struct input_absinfo slot;
    int max_slots;
    unsigned int pressure[12] = {0}; //用于保存每一个触摸点上一次的按压力,初始为 0,表示松开
    int i;

    /* 打开并配置触摸屏设备 */
    ts = ts_setup(NULL, 0);
    if (NULL == ts) {
        fprintf(stderr, "ts_setup error");
        exit(EXIT_FAILURE);
    }

    /* 获取触摸屏支持的最大触摸点数 
    EVIOCGABS,
    EVIOCGABS(ABS_MT_SLOT)表示获取触摸屏的 slot 信息，此时 ioctl()函数的第三个参数是
    一个 struct input_absinfo *的指针，指向一个 struct input_absinfo 对象，
    调用 ioctl()会将获取到的信息写入到struct input_absinfo 对象中
    struct input_absinfo {
    __s32 value; //最新的报告值
    __s32 minimum; //最小值
    __s32 maximum; //最大值
    __s32 fuzz;
    __s32 flat;
    __s32 resolution;
};
    */
    if (0 > ioctl(ts_fd(ts), EVIOCGABS(ABS_MT_SLOT), &slot)) {
        perror("ioctl error");
        ts_close(ts);
        exit(EXIT_FAILURE);
    }

    max_slots = slot.maximum + 1 - slot.minimum;
    printf("max_slots: %d\n", max_slots);

    /* 内存分配 */
    mt_ptr = calloc(max_slots, sizeof(struct ts_sample_mt));

    while(1)
    {
        /*
        int ts_read_mt(struct tsdev *ts, struct ts_sample_mt **samp, int max_slots, int nr)
        ts_read_mt()函数有一个 max_slots 参数，表示触摸屏支持的最大触摸点数，应用程序可以通过调用 ioctl()
        函数来获取触摸屏支持的最大触摸点数以及触摸屏坐标的最大分辨率等信息，
        ts_read_mt()函数的 samp 参数是一个 struct ts_sample_mt **类型的指针，多点触摸应用程序，每一个触
        摸点的信息使用 struct ts_sample_mt 数据结构来描述；一个触摸点的数据使用一个 struct ts_sample_mt 对象
        来装载，将它们组织成一个 struct ts_sample_mt 数组，调用 ts_read_mt()时，将数组地址赋值给 samp 参数。
        */
        if (0 > ts_read_mt(ts, &mt_ptr, max_slots, 1)) 
        {
            perror("ts_read_mt error");
            ts_close(ts);
            free(mt_ptr);
            exit(EXIT_FAILURE);
        }
        for (i = 0; i < max_slots; i++) 
        {
            if (mt_ptr[i].valid) 
            {//有效表示有更新!
                if (mt_ptr[i].pressure) 
                { //如果按压力>0
                    if (pressure[mt_ptr[i].slot])//如果上一次的按压力>0
                        printf("slot<%d>, 移动(%d, %d)\n", mt_ptr[i].slot, mt_ptr[i].x, mt_ptr[i].y);
                    else
                        printf("slot<%d>, 按下(%d, %d)\n", mt_ptr[i].slot, mt_ptr[i].x, mt_ptr[i].y);
                }
                else
                    printf("slot<%d>, 松开\n", mt_ptr[i].slot);

                pressure[mt_ptr[i].slot] = mt_ptr[i].pressure;
            }
        }
    }
    ts_close(ts);
    free(mt_ptr);
    exit(EXIT_SUCCESS);
}
```

## 触摸滑动控制led和蜂鸣器

综合一下目前学的：led、beep、touch-screen，实现触摸滑动控制led和蜂鸣器。

```c
#include <stdio.h>
#include <stdlib.h>
#include <tslib.h>
#include <fcntl.h>
#define LED_BRIGHTNESS "/sys/class/leds/sys-led/brightness"
#define BEEP_BRIGHTNESS "/sys/class/leds/beep/brightness"
#define LED_TRIGGER "/sys/class/leds/sys-led/trigger"
#define BEEP_TRIGGER "/sys/class/leds/beep/trigger"
int fd_LED, fd_BEEP, fd_LED_trigger, fd_BEEP_trigger;
void LED_ON(void)
{
    fd_LED_trigger = open(LED_TRIGGER, O_RDWR);
    if(fd_LED_trigger < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_LED_trigger, "none", sizeof("none"));

    fd_LED = open(LED_BRIGHTNESS, O_RDWR);
    if(fd_LED < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_LED,"1",1);
}
void LED_OFF(void)
{
    fd_LED_trigger = open(LED_TRIGGER, O_RDWR);
    if(fd_LED_trigger < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_LED_trigger, "none", sizeof("none"));

    fd_LED = open(LED_BRIGHTNESS, O_RDWR);
    if(fd_LED < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_LED,"0",1);
}
void BEEP_ON(void)
{
    fd_BEEP_trigger = open(BEEP_TRIGGER, O_RDWR);
    if(fd_BEEP_trigger < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_BEEP_trigger, "none", sizeof("none"));

    fd_BEEP = open(BEEP_BRIGHTNESS, O_RDWR);
    if(fd_BEEP < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_BEEP,"1",1);
}
void BEEP_OFF(void)
{
    fd_BEEP_trigger = open(BEEP_TRIGGER, O_RDWR);
    if(fd_BEEP_trigger < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_BEEP_trigger, "none", sizeof("none"));

    fd_BEEP = open(BEEP_BRIGHTNESS, O_RDWR);
    if(fd_BEEP < 0)//如果打不开设备就打印相应的错误
    {
        perror("open error");
        exit(-1);
    }
    write(fd_BEEP,"0",1);
}
int main(int argc, char *argv[])
{
    struct tsdev *ts = NULL;
    struct ts_sample samp;
    int pressure = 0;
    int flag = 0, x0, y0, x1, y1, x_dis, y_dis, ratio;
    
    ts = ts_setup(NULL, 0);
    if(NULL == ts)
    {
        perror("ts_setup error");
        exit(-1);
    }
    while(1)
    {
        if(0> ts_read(ts, &samp, 1))
        {
            perror("read error");
            ts_close(ts);
            exit(-1);
        }
        if(samp.pressure)
        {
            if(pressure)
            {
                printf("move %d, %d\n", samp.x, samp.y);
                if(flag == 0)
                {
                    x0 = samp.x;
                    y0 = samp.y;
                    flag = 1;
                }
                if(flag == 1)
                {
                    x1 = samp.x;
                    y1 = samp.y;
                }
            }
            else
            {
                printf("pressed %d, %d\n", samp.x, samp.y);
            }
        }
        else
        {
            printf("released\n");
            printf("released %d, %d\n", samp.x, samp.y);
            flag = 0;
        }
        pressure = samp.pressure;
        x_dis = x1 - x0;
        y_dis = y1 - y0;
        if((x_dis > 300) && (abs(y_dis) < 200) )
        {   
            LED_ON();
        }
        else if((x_dis < -300) && (abs(y_dis) < 200) )
        {
            LED_OFF();
        }
        else if((y_dis > 300) && (abs(x_dis) < 200))
        {
            BEEP_ON();
        }
        else if((y_dis < -300) && (abs(x_dis) < 200))
        {
            BEEP_OFF();
        }
    }
    ts_close(ts);
    return 0;
}

```
