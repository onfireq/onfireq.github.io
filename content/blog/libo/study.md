# 文件与软件

## 文件是内容

软件是用来打开内容的工具

从根目录开始写的路径：绝对路径（mac/linux下）
从盘符开始写的路径：绝对路径（windows下）
从当前目录开始写的路径：相对路径

mac/linux 用斜杠“/”表示路径分隔符
windows 下用反斜杠“\”表示路径分隔符

windows 下的绝对路径：

```terminal
C:\Users\Administrator\Desktop\test.txt
```

mac/linux 下的绝对路径：

```terminal
/Users/Administrator/Desktop/test.txt
```

问题：啰嗦

从当前位置开始写的路径：相对路径
windows 下的相对路径：

```terminal
.\test.txt
```

其中“.” 表示当前目录
“..” 表示上一级目录

文件的类型：

- 普通文件
- 目录
- 链接文件
- 特殊文件

默认情况下，电脑会隐藏后缀名
在 windows 下，可以通过修改注册表来显示后缀名

```terminal
HKEY_CURRENT_USER\Control\Explorer\HideExt
```

将“HideExt”从“1”改为“0”即可显示后缀名

显示文件扩展名后，文件的类型会显示在文件名后面
例如：test.txt 是一个文本文件
test.exe 是一个可执行文件
test.dll 是一个动态链接库
test.sys 是一个系统文件

告诉用户文件的类型是什么，其次告诉电脑文件的类型是什么，这样电脑就可以根据文件的类型来处理文件

路径、文件名、文件扩展名

```terminal
C:\Users\Administrator\Desktop\test.txt
```

路径：C:\Users\Administrator\Desktop
文件名：test.txt
文件扩展名：.txt

## 代码文件

代码文件使用代码编辑器打开
代码编辑器用来打开和编辑代码的软件，例如：Visual Studio Code、Sublime Text、Atom 等。继承了文本编辑器的功能，添加了代码相关功能，例如语法高亮、代码补全、代码格式化等。还有很多开发工具，也叫 ide（集成开发环境）。
