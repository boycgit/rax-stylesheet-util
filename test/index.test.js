import { parseStyle, toStyleSheet } from '../dist/index';

describe('base', () => {
	test('ast', () => {
		// const style = `@media screen and (max-width: 300px) {
		// 	.body {
		// 		background-color:lightblue;
		// 	}
		// }`;
		const style = `.mainImageWrapper {
				height: 400;
				overflow: hidden;
			}

			.mainImage {
				width: 750;
				height: 400;
			}
		`;

		// console.log(JSON.stringify(parseStyle(style), null, 4));
		console.log(`toStyleSheet: ${toStyleSheet(style)}`);
		expect(1).toBeTruthy();
	});
});
