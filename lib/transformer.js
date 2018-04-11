'use strict';

import camelCase from 'camelcase';
import normalizeColor from './normalizeColor';
import particular from './particular';
import Validation from './Validation';
import { pushErrorMessage } from './promptMessage';
import chalk from 'chalk';

import { pipe, requiredParam } from './roro';

const REG_QUOTES = /[\\'|\\"]/g;
const REG_CSS_SELECTOR = /^\.[a-zA-Z0-9_:\-]+$/;

const COLOR_PROPERTIES = {
	color: true,
	backgroundColor: true,
	borderColor: true,
	borderBottomColor: true,
	borderTopColor: true,
	borderRightColor: true,
	borderLeftColor: true
};

/**
 * 将 css 选择器转换成规范 JS 变量
 * 比如将 `.container` 转换成 `container`
 * 如果 `transformDescendantCombinator` 为 true，则可以将 `.container .title` 转换成 `container_title`
 *
 * @param {object} [{
 * 	selector = requiredParam('selector'),
 *  transformDescendantCombinator = false,
 *  position = {
 *         start: {
 *             line: 0,
 *             column: 0
 *         }
 *     }
 * }={}]
 */
export function sanitizeSelector({
	selector = requiredParam('selector'),
	transformDescendantCombinator = false,
	position = {
		start: {
			line: 0,
			column: 0
		}
	}
} = {}) {
	if (!transformDescendantCombinator && !REG_CSS_SELECTOR.test(selector)) {
		const message = `line: ${position.start.line}, column: ${
			position.start.column
		} - "${selector}" is not a valid selector (e.g. ".abc、.abcBcd、.abc_bcd")`;
		console.error(chalk.red.bold(message));
		pushErrorMessage(message);
		return null;
	}
	return selector.replace(/\s/gi, '_').replace(/[\.]/g, '');
}

/**
 * 将 css 属性名转换成大JS 驼峰类型的变量
 * 比如将 `border-width` 转换成个 `borderWidth`
 *
 * @param {object} [{
 *     prop = requiredParam('prop')
 * }={}]
 */
export function convertProp({ prop = requiredParam('prop') } = {}) {
	let result = camelCase(prop);

	// Handle vendor prefixes
	if (prop.indexOf('-webkit') === 0) {
		result = result.replace('webkit', 'Webkit');
	} else if (prop.indexOf('-moz') === 0) {
		result = result.replace('moz', 'Moz');
	}

	return result;
}

/**
 * 转换属性值
 *  - 如果是数值，使用 Nubmer 格式化一下；
 *  - 如果是颜色属性，则调用颜色转换函数`normalizeColor`将其统一成 RGB 数值
 *  - 否则就原样返回字符串
 * @param {any} [{ property, value }={}]
 * @returns
 */
export function convertValue({ property, value } = {}) {
	let result = value;

	if (!Number.isNaN(Number(result))) {
		result = Number(result);
	}

	if (COLOR_PROPERTIES[property]) {
		result = normalizeColor(value);
	}

	return result;
}

/**
 * 对解析出来的 样式规则(rule) 格式化成目标 style 对象
 *
 * @export
 * @param {object} [{rule=requiredParam('rule')}={}]  rule是 css.parse 后的有效对象，结构为： [type:'rule', selectors:[], declarations: [], position:{}]
 * @returns 转换成 JS style 对象
 */
export function convert({
	tagName,
	selectors,
	declarations = requiredParam('declarations')
} = {}) {
	let style = {};

	if (tagName === 'text') {
		return;
	}

	declarations.forEach(declaration => {
		if (declaration.type !== 'declaration') {
			return;
		}
		declaration.value = declaration.value.replace(REG_QUOTES, '');
		let camelCaseProperty = convertProp({ prop: declaration.property });
		let value = convertValue({
			property: camelCaseProperty,
			value: declaration.value
		});
		style[camelCaseProperty] = value;

		// 校验样式
		Validation.validate({
			prop: declaration.property,
			value: declaration.value,
			selectors: selectors.join(', '),
			position: declaration.position
		});

		// 如果是特殊类型，需要多一层 `particular` 转换
		if (particular[camelCaseProperty]) {
			let particularResult = particular[camelCaseProperty](value);
			if (particularResult.isDeleted) {
				style[camelCaseProperty] = null;
				delete style[camelCaseProperty];
				delete particularResult.isDeleted;
			}
			Object.assign(style, particularResult);
		}
	});

	return style;
}
