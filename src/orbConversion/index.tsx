import type { ExtensionWebExports } from '@moonlight-mod/types';

// Taken from https://tools.spin.rip/file/discordorbcalc/index.html
const conversion_rate = 0.000839;

export const patches: ExtensionWebExports['patches'] = [
	{
		find: 'BalanceCounter',
		replace: [
			{
				match: /`\${(.)\.toFixed\(0\)}`/g,
				replacement: `\`$$\${($1*${conversion_rate}).toFixed(2)}\``
			},
			// The width of the number input is based on the character count of the balance
			// It uses CSS' ch units, which are based on the width of the character "0"
			// (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#ch)
			// Since the period less wide than the other characters, we reduce the character count a little
			{
				match: '`.length',
				replacement: '$&-0.8'
			}
		]
	}
];
