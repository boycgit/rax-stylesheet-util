import { parse } from 'css';
import { debugMini } from './lib/debug';
import fs from 'fs';
import pkg from './package.json';

// const result = fs.readFileSync('./package.json');
console.log(777, pkg);
var ast = parse('body { font-size: 12px; }');

// debugMini(ast);
// var ast = {
// 	nice: 'job'
// };

export { ast };
