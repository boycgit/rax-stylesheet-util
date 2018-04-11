import normalizeColor from './normalizeColor';

const SUFFIX = 'rem';

const REG_NUM = /^\d+$/;

/**
 * 将数值转换成 rem 单位
 *
 * @param {any} val 数值
 * @returns {string}
 */
function convertUnit(val) {
	if (REG_NUM.test(val)) {
		return val + SUFFIX;
	}

	return val;
}

/**
 * 将诸如 padding 、margin 等属性拆分成 4 个样式
 *
 * @export
 * @param {any} value 属性值
 * @param {any} key 属性名称
 * @returns {Object}
 */
export function measure(value, key) {
	let direction = [];

	if (typeof value === 'number') {
		direction = [value, value, value, value];
	} else if (typeof value === 'string') {
		direction = value.split(/\s+/);
		switch (direction.length) {
		case 2:
			direction[2] = direction[0];
			direction[3] = direction[1];
			break;
		case 3:
			direction[3] = direction[1];
			break;
		case 4:
			break;
		default:
			return {};
		}
	}

	const topKey = key + 'Top';
	const rightKey = key + 'Right';
	const bottomKey = key + 'Bottom';
	const leftKey = key + 'Left';

	let result = {
		isDeleted: true
	};
	result[topKey] = convertUnit(direction[0]);
	result[rightKey] = convertUnit(direction[1]);
	result[bottomKey] = convertUnit(direction[2]);
	result[leftKey] = convertUnit(direction[3]);

	return result;
}

/**
 * 将 border 属性拆分成 3 个单独的属性
 * 
 * @param {any} key border属性名
 * @param {any} value 属性值
 * @returns {Object}
 */
function border(key, value) {
	let result = {
		isDeleted: true
	};
	const direction = value && value.split(' ');

	result[key + 'Width'] = direction && convertUnit(direction[0]);
	result[key + 'Style'] = direction && direction[1];
	result[key + 'Color'] = direction && normalizeColor(direction[2]);
	return result;
}

/** 
 * 特殊属性转换器
*/
export default {
	border: value => {
		return border('border', value);
	},
	borderTop: value => {
		return border('borderTop', value);
	},
	borderRight: value => {
		return border('borderRight', value);
	},
	borderBottom: value => {
		return border('borderBottom', value);
	},
	borderLeft: value => {
		return border('borderLeft', value);
	},
	padding: value => {
		return measure(value, 'padding');
	},
	margin: value => {
		return measure(value, 'margin');
	},
	lineHeight: value => {
		if (typeof value === 'number') {
			value += 'rem';
		}
		return {
			lineHeight: value
		};
	},
	fontWeight: value => {
		return {
			fontWeight: value.toString()
		};
	}
};
