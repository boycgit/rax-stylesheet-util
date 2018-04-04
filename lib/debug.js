import Debug from 'debug';

var baseName = 'raxstyle:util';
var debug = Debug(baseName);

// 基本 log 构造函数
// 添加一些基本的注释，方面理解；
var debugBase = (type, ...notes) => (...props) => {
	let str = '';
	[].concat(notes).forEach(note => {
		str += `[${note}]`;
	});

	props[0] = str + props[0];
	Debug(`${baseName}:${type}`)(...props);
};

var debugMini = debugBase('mini', '普通'); // 普通的日志
var debugError = debugBase('error', '错误'); // 错误日志

// The logger should only be disabled if we’re not in production.
if (ENV !== 'production') {
	// Enable the logger.
	Debug.enable('*');
    debugMini('Logging is enabled!');
} else {
	Debug.disable();
}

export { debug, debugBase, debugMini, debugError };