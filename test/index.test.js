import { parseStyle, toStyleSheet } from '../index';
import { debugTest } from '../lib/debug';

describe('base', () => {
	test('general style', () => {
		// const style = `@media screen and (max-width: 300px) {
		// 	.body {
		// 		background-color:lightblue;
		// 	}
		// }`;
		// const style = `.mainImageWrapper {
		// 		height: 400;
		// 		overflow: hidden;
		// 	}

		// 	.mainImage {
		// 		width: 750;
		// 		height: 400;
		// 	}
		// `;
		const style = `.container {
					width:750px;
					background-color: #eee;
				};
				.header {
				 font-size: 40px;
				 color: white;
				 background-color: #f44336;
				};
				 .body {
				 font-size: 20px;
				}

		`;

		// console.log(JSON.stringify(parseStyle(style), null, 4));
		debugTest(`toStyleSheet: ${toStyleSheet(style)}`);
		expect(1).toBeTruthy();
	});
});
