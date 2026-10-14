---
title: "蜂鸣器蜂鸣"
date: "2026-10-11"
tags: ["Linux", "i.MX6ULL"]
description: "记录 i.MX6ULL 蜂鸣器的工作原理与 Linux 控制程序。"
published: true
order: 3
---

## 蜂鸣器蜂鸣

引脚变高：蜂鸣器蜂鸣
引脚变低：蜂鸣器不蜂鸣

有源蜂鸣器：里面有一个声源，通过引脚控制声源的通断，来实现蜂鸣。
无源蜂鸣器：需要送一个fast pwm信号，来实现蜂鸣。方波的频率为蜂鸣器的频率。占空比决定蜂鸣器的音量。

控制beep开关

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define BEEP_BRIGHTNESS "/sys/class/leds/beep/brightness"

#define USAGE() fprintf(stderr, "Usage: %s <on|off>\n", argv[0])

int main(int argc, char *argv[]){
    if(argc < 2){
        USAGE();
        exit(-1);
    }

    int fd = open(BEEP_BRIGHTNESS, O_RDWR);
    if(fd < 0){
        perror("open");
        exit(-1);
    }

    if (!strcmp(argv[1], "on"))
    {
        write(fd, "1", 1);
        printf("BEEP is ON\n");
    }
    else if (!strcmp(argv[1], "off"))
    {
        write(fd, "0", 1);
        printf("BEEP is OFF\n");
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

目录在

```bash
/sys/class/leds/beep/
```

文件组织方式与sys-led相同。

就不再赘述了。

还是那句话，通过控制设备文件来实现控制设备。

linux下一切皆文件。
