import config from '@moonlight-mod/eslint-config';
import stylistic from '@stylistic/eslint-plugin';

/** @type { import("eslint").Linter.Config[] } */
export default [
	// Removes the Prettier rules from the base config
	...config.filter(e => !e.plugins?.prettier),
	{
		plugins: {
			'@stylistic': stylistic
		},
		rules: {
			'quotes': ['off'],

			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/no-trailing-spaces': 'error',

			'@stylistic/comma-dangle': ['error', 'never']
		}
	}
];
