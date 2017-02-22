Tools for Visual Compare
=============================

## github
https://github.com/liuyuanyangscript/visual-compare

## issues
https://github.com/liuyuanyangscript/visual-compare/issues

## Who is using ?

+   Front-End engineer
+   UEDer

## When to use ?

+   for Front-End engineer

    +   When coding...
    +   Before showing pages to UEDer...

+   for UEDer

    +   When comparing pages written by FEer with designed pictures.

## Quick Start

Visual-Compare supports UMD.

+   local

    in terminal
    
    ```
    $ npm install
    $ npm run build
    ```

    in js

    ```
    import VisualCompare from './build/index'

    new VisualCompare()
    ```

+   npm

    in terminal

    ```
    $ npm install visual-compare --save
    ```

    in js

    ```
    import VisualCompare from 'visual-compare'

    new VisualCompare()
    ```

+   src

    in html

    ```
    <script src="build/visual-compare.js"></script>
    ```

    in js

    ```
    new window.VisualCompare()
    ```

## rules

The input of `img src` should be an online img address, such as `https://img.alicdn.com/tps/TB1gx13PFXXXXXFXXXXXXXXXXXX-1130-500.jpg_q100.jpg_.webp`


视觉稿还原度对比工具
=============================

## github
https://github.com/liuyuanyangscript/visual-compare

## issues
https://github.com/liuyuanyangscript/visual-compare/issues

## 适合谁用？

+   前端工程师
+   UED 人员: 交互、视觉

## 场景

+   前端工程师在
    +   开发过程中
    +   交付视觉 review 前

    可以实时地将开发出来的页面和视觉稿对比，发现可能没有注意到的差别，及时修正，避免不必要的沟通成本。

+   UED 人员

    视觉设计师、交互设计师可以将页面和视觉稿进行对比，发现细微差别。

## 快速开始

Visual-Compare 支持 UMD 规范.

+   本地使用

    终端

    ```
    $ npm install
    $ npm run build
    ```

    js

    ```
    import VisualCompare from './build/index'

    new VisualCompare()
    ```

+   npm

    终端

    ```
    $ npm install visual-compare --save
    ```

    js

    ```
    import VisualCompare from 'visual-compare'

    new VisualCompare()
    ```

+   <script> 引用

    html

    ```
    <script src="build/visual-compare.js"></script>
    ```

    js

    ```
    new window.VisualCompare()
    ```

## 规则

呈现在页面右下角的设置栏里的 `img src` 处，需要填写线上的视觉稿地址，如 `https://img.alicdn.com/tps/TB1gx13PFXXXXXFXXXXXXXXXXXX-1130-500.jpg_q100.jpg_.webp`。
