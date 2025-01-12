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
			'quotes': 'off',
			'require-await': 'error',

			'@typescript-eslint/consistent-type-imports': ['error', {
				disallowTypeAnnotations: false
			}],

			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/comma-dangle': ['error', 'never'],
			'@stylistic/semi': ['error', 'always'],
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/jsx-quotes': ['error', 'prefer-single'],
			'@stylistic/jsx-curly-brace-presence': ['error', {
				propElementValues: 'always'
			}],
			'@stylistic/eol-last': ['error']
		}
	}
];
