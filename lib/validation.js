'use strict';

import BoxModelPropTypes from './propTypes/BoxModelPropTypes';
import FlexboxPropTypes from './propTypes/FlexboxPropTypes';
import TextStylePropTypes from './propTypes/TextStylePropTypes';
import ColorPropTypes from './propTypes/ColorPropTypes';
import { pushWarnMessage } from './promptMessage';
import particular from './particular';
import chalk from 'chalk';
import { requiredParam } from './roro';
import { convertProp } from './transformer';

let allStylePropTypes = {};

/**
 * css 属性验证器
 *
 * @class Validation
 */
class Validation {
	/**
	 * 验证 CSS 属性名、数值
	 *
	 * @static
	 * @param {any} [{ prop, value, selectors = '', position = {} }={}] 属性、数值、选择器、位置等参数
	 * @returns
	 * @memberof Validation
	 */
	static validate({ prop, value, selectors = '', position = {} } = {}) {
		const camelCaseProperty = convertProp({ prop }); // 将属性转换成驼峰样式
		if (allStylePropTypes[camelCaseProperty]) {
			let error = allStylePropTypes[camelCaseProperty](value, prop, selectors);

			if (error) {
				const message = `line: ${position.start.line}, column: ${
					position.start.column
				} - ${error.message}`;
				console.warn(chalk.yellow.bold(message));
				pushWarnMessage(message);
			}
			return error;
		} else if (!particular[camelCaseProperty]) {
			const message = `line: ${position.start.line}, column: ${
				position.start.column
			} - "${prop}: ${value}" is not valid in "${selectors}" selector`;
			console.warn(chalk.yellow.bold(message));
			pushWarnMessage(message);
		}
	}

	static addValidStylePropTypes(stylePropTypes) {
		for (let prop in stylePropTypes) {
			allStylePropTypes[prop] = stylePropTypes[prop];
		}
	}
}

// 添加特定种类的 CSS 验证规则
Validation.addValidStylePropTypes(BoxModelPropTypes);
Validation.addValidStylePropTypes(FlexboxPropTypes);
Validation.addValidStylePropTypes(TextStylePropTypes);
Validation.addValidStylePropTypes(ColorPropTypes);

export default Validation;
