import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

/** @type { import("eslint").Linter.Config[] } */
export default defineConfig([
	// Adapted from Moonlight's config

	js.configs.recommended,
	...ts.configs.recommended,

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			react,
		},
		settings: {
			react: {
				version: '18.2',
			},
		},
	},

	{
		rules: {
			eqeqeq: [
				'error',
				'always',
				{
					null: 'ignore',
				},
			],
			quotes: [
				'error',
				'single',
				{ avoidEscape: true, allowTemplateLiterals: true },
			],

			'@typescript-eslint/no-unused-vars': [
				'error',
				{ args: 'none', varsIgnorePattern: '^_' },
			],
			// Mostly so we don't forget to leave these in when committing
			'no-console': 'error',
			'no-debugger': 'error',

			// Quite honestly we're interacting with so much unknown within Discord that
			// this being enabled is a hinderance
			'@typescript-eslint/no-explicit-any': 'off',

			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-require-imports': 'off',

			// https://canary.discord.com/channels/1154257010532032512/1154275441788583996/1181760413231230976
			'no-unused-labels': 'off',

			// Patcher has support for \i
			'no-useless-escape': ['error', { allowRegexCharacters: ['i'] }],
		},
	},
	{
		// files: 'src/**',
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/comma-dangle': ['error', 'never'],
			'@stylistic/semi': ['error', 'always'],
		},
	},
]);
