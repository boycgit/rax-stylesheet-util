# rax-stylesheet-util

>  A rax css util tools that imports a css file and converts it to be used as an inline style，used in [babel-plugin-transform-rax-styles](https://github.com/boycgit/babel-plugin-transform-rax-styles/)

> Inspired by [stylesheet-loader](https://github.com/alibaba/rax/tree/master/packages/stylesheet-loader)


[![npm version](https://img.shields.io/npm/v/rax-stylesheet-util.svg?style=flat-square)]

## Install 

```c
npm install --save-dev stylesheet-loader
```

## Usage

```css
/* foo.css */
.container{
  width:750px;
  background-color: #eee;
};
.header{
  font-size: 40px;
  color: white;
  background-color: #f44336;
};
.body{
  font-size: 20px;
}
```

```js
// foo.js
import { toStyleSheet } from 'rax-stylesheet-util';
import { readFileSync } from 'fs';

const source = readFileSync('./foo.css', 'utf8');
const styleString = toStyleSheet(source);

/** the value of styleString as follow:
{
    "container": {
        "width": "750px",
        "backgroundColor": "rgb(238,238,238)"
    },
    "header": {
        "fontSize": "40px",
        "color": "white",
        "backgroundColor": "rgb(244,67,54)"
    },
    "body": {
        "fontSize": "20px"
    }
}
*/

```

## Design Pattern

本文依据文章[Elegant patterns in modern JavaScript: RORO](https://www.codementor.io/billsourour897/elegant-patterns-in-modern-javascript-roro-hn217atuu)所提出的 `RORO` 方式组织代码，方便进行参数控制、pipe 串联