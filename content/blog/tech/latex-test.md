---
title: "LaTeX 公式测试"
date: "2026-07-29"
tags: ["LaTeX", "数学", "测试"]
description: "测试博客的 LaTeX 数学公式渲染"
published: false
---

## 行内公式

爱因斯坦的质能方程：$E = mc^2$

薛定谔方程：$i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi$

## 块级公式

### Adam 优化器更新规则

$$
m_t = \beta_1 m_{t-1} + (1-\beta_1) g_t
$$

$$
v_t = \beta_2 v_{t-1} + (1-\beta_2) g_t^2
$$

$$
\hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}
$$

$$
\theta_t = \theta_{t-1} - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
$$

### SPGD 梯度估计

$$
\hat{\nabla} J = \frac{J(\theta + \delta) - J(\theta - \delta)}{2\delta} \cdot \Delta\theta
$$

### 偏振态 Jones 向量

$$
\mathbf{E} = \begin{pmatrix} E_x \\ E_y \end{pmatrix} = \begin{pmatrix} |E_x| e^{i\phi_x} \\ |E_y| e^{i\phi_y} \end{pmatrix}
$$

### Mueller 矩阵

$$
\mathbf{M} = \begin{pmatrix} m_{00} & m_{01} & m_{02} & m_{03} \\ m_{10} & m_{11} & m_{12} & m_{13} \\ m_{20} & m_{21} & m_{22} & m_{23} \\ m_{30} & m_{31} & m_{32} & m_{33} \end{pmatrix}
$$

### Poincaré 球面参数化

$$
\begin{cases}
S_1 = \cos(2\theta)\cos(2\phi) \\
S_2 = \sin(2\theta)\cos(2\phi) \\
S_3 = \sin(2\phi)
\end{cases}
$$

## 代码与公式结合

SPGD 算法核心：

$$
\theta_{n+1} = \theta_n + \mu \cdot \Delta J \cdot \Delta\theta_n
$$

其中 $\mu$ 是增益系数，$\Delta J$ 是性能指标变化量，$\Delta\theta_n$ 是随机扰动向量。
