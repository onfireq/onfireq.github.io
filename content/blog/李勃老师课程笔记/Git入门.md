---
title: "Git 入门"
date: "2026-09-19"
tags: ["Git", "版本控制"]
description: "Git 与版本控制的学习笔记。"
published: false
---

Git——给代码设置存档点

设置存档点的动作叫做commit。

- 记录提交时项目里不同文件的状态
- 记录是谁在什么时间做的提交
- 记录提交的描述

Git的管理范围：

- 项目的所有文件
- 项目的所有目录
- 项目的所有子目录

指定管理哪个文件夹就管理哪个文件夹。被Git所管理的一个文件夹就叫做Git仓库。

Git仓库的结构：

- .git：Git仓库的元数据文件夹
- 项目的所有文件
- 项目的所有目录
- 项目的所有子目录
- 项目的所有子目录的子目录

Git的另一件事*和远程仓库同步*
把本地仓库里的内容再通过互联网同步一份到另一台电脑上，方便备份，换电脑继续工作，或者和别人协作。

确认Git已经安装：

```bash
git --version
```

安装完后，先配置自己的身份，因为Git在记录提交时会记录是谁做的提交。

检查之前有没有配置过：

```bash
git config --global --list
```

返回：

```bash
user.email=你的邮箱
user.name=你的姓名
```

进行配置：

```bash
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
```

如果想要改之前的配置，可以使用以下命令：

```bash
git config --global --unset user.name
git config --global --unset user.email
```

然后重新配置。

```bash
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
```

只需要配置一次，后续的提交就会自动使用这个身份。
为什么要配置？
首先可以方便地记录提交时的姓名和邮箱。
其次可以方便地查看提交记录。
另外，git仓库支持多人协作。
每个成员都可以在自己的本地仓库里进行提交，最后再把提交同步到远程仓库。
这样就可以方便地和别人协作，避免冲突。哪个功能是哪个人开发的。

初始化一个Git仓库：

```bash
git init
```
