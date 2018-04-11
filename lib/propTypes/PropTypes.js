import normalizeColor from '../normalizeColor';

const LENGTH_REGEXP = /^[-+]?[0-9]*\.?[0-9]+(px|em|rem|\%)?$/;
const INTEGER_REGEXP = /^[-+]?[0-9]+$/;

/**
 * 检查长度数值是否合法
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createLengthChecker(value = '', prop, selectors) {
	value = value.toString();

	if (!value.match(LENGTH_REGEXP)) {
		return new Error(getMessage(prop, value, selectors, '16、16rem、16px'));
	}
	return null;
}

/**
 * 检查数值是否合法
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createNumberChecker(value = '', prop, selectors) {
	value = value.toString();
	let match = value.match(LENGTH_REGEXP);

	if (!match || match[1]) {
		return new Error(getMessage(prop, value, selectors, '16、24、5.2'));
	}
	return null;
}

/**
 * 检查整数是否合法
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createIntegerChecker(value = '', prop, selectors) {
	value = value.toString();

	if (!value.match(INTEGER_REGEXP)) {
		return new Error(getMessage(prop, value, selectors, '16、24、12'));
	}
	return null;
}

/**
 * 检查是否是枚举值
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createEnumChecker(list) {
	return function validate(value, prop, selectors) {
		let index = list.indexOf(value);

		if (index < 0) {
			return new Error(
				getMessage(prop, value, selectors, `${list.join('、')}`)
			);
		}

		return null;
	};
}

/**
 * 检查颜色是否合法
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createColorChecker(value, prop, selectors) {
	if (typeof value === 'number') {
		return;
	}

	if (normalizeColor(value) === null) {
		return new Error(
			getMessage(prop, value, selectors, '#333、#fefefe、rgb(255, 0, 0)')
		);
	}
	return null;
}

/**
 * 检查字符串是否存在
 *
 * @param {any} [value=''] 属性值
 * @param {string} prop 属性名
 * @param {string} selectors 选择器
 * @returns {Error | null}
 */
function createStringChecker(value, prop, selectors) {
	if (!value) {
		return new Error(getMessage(prop, value, selectors, ''));
	}
	return null;
}

function getMessage(prop, value, selectors, link) {
	return `"${prop}: ${value}" is not valid value in "${selectors}" selector (e.g. "${link}")`;
}

export default {
	length: createLengthChecker,
	number: createNumberChecker,
	integer: createIntegerChecker,
	oneOf: createEnumChecker,
	color: createColorChecker,
	string: createStringChecker
};
