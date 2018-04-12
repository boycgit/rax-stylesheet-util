import { parse } from 'css';
import { convert, sanitizeSelector } from './lib/transformer';
import {
	getErrorMessages,
	getWarnMessages,
	resetMessage
} from './lib/promptMessage';
import { debugMini, debugObj } from './lib/debug';
import { requiredParam } from './lib/roro';
// import transformer from './lib/transformer';

const RULE = 'rule';
const FONT_FACE_RULE = 'font-face';
const MEDIA_RULE = 'media';
const REG_USELESS_CHAR = /[\s;]/g;

/**
 * 清理
 * selector 有可能是下列这种情形，需要清理 `;\n\t` 这些字符：
 *
 *		 "selector": ";\n\t\t\t\t .header \t"
 *
 * @param {string} [selector='']  选择器
 */
function cleanSelector(selector = '') {
	return selector.replace(REG_USELESS_CHAR, '');
}

function parseRules({
	rules = requiredParam('rules'),
	transformDescendantCombinator = false
}) {
	let styles = {};
	let fontFaceRules = [];
	let mediaRules = [];
	debugObj('rules: ', JSON.stringify(rules, null, 4));

	rules.forEach(rule => {
		const { media, tagName, type, selectors, position, declarations } = rule;
		let style = {};

		// 格式化选择器

		const cleanedSelector = [].concat(selectors).map(cleanSelector);

		// 普通样式规则
		if (type === RULE) {
			style = convert({ tagName, selectors: cleanedSelector, declarations });

			cleanedSelector.forEach(selector => {
				let sanitizedSelector = sanitizeSelector({
					selector,
					transformDescendantCombinator,
					position
				});

				if (sanitizedSelector) {
					const pseudoIndex = sanitizedSelector.indexOf(':');
					// 处理伪类，比如将 `a:hover` 键名将转换成 `ahover`
					if (pseudoIndex > -1) {
						let pseudoStyle = {};
						const pseudoName = selector.slice(pseudoIndex + 1);
						sanitizedSelector = sanitizedSelector.slice(0, pseudoIndex);

						Object.keys(style).forEach(prop => {
							pseudoStyle[prop + pseudoName] = style[prop];
						});

						style = pseudoStyle;
					}
					// 汇总到总是 styles 对象中
					styles[sanitizedSelector] = Object.assign(
						styles[sanitizedSelector] || {},
						style
					);
				}
			});
		}

		// 字体样式规则
		if (type === FONT_FACE_RULE) {
			let font = {};
			declarations.forEach(declaration => {
				font[declaration.property] = declaration.value;
			});
			fontFaceRules.push(font);
		}

		// 媒体查询规范
		if (type === MEDIA_RULE) {
			mediaRules.push({
				key: media,
				data: parseRules({ rules: rule.rules, transformDescendantCombinator })
			});
		}
	});

	return {
		styles,
		fontFaceRules,
		mediaRules
	};
}

/**
 * 将 css 转换成 js 文件
 *
 * @export
 * @param {any} source - css 字符串
 * @param {boolean} [transformDescendantCombinator=false] 是否支持嵌套，具体说明可参考 http://www.aliued.com/?p=4052
 * @returns
 */
export function parseStyle(source, transformDescendantCombinator = false) {
	const parsedStyleAst = parse(source);
	const { stylesheet } = parsedStyleAst;

	if (stylesheet.parsingErrors.length) {
		throw new Error('StyleSheet Parsing Error occured.');
	}

	return parseRules({ rules: stylesheet.rules });
}

/**
 * 将 css 转换成 字符串 格式
 *
 * @export
 * @param {any} source - css 字符串
 * @param {boolean} [transformDescendantCombinator=false] 是否支持嵌套，具体说明可参考 http://www.aliued.com/?p=4052
 * @returns
 */
export function toStyleSheet(source, transformDescendantCombinator = false) {
	const parsedStyle = parseStyle(source, transformDescendantCombinator);

	const { styles } = parsedStyle;

	return JSON.stringify(styles || {});
}
