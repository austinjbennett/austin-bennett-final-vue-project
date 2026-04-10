import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default [
	js.configs.recommended,

	// Vue file configuration
	{
		files: ['**/*.vue'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: vueParser,
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			vue: pluginVue,
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-setup-props-destructure': 'off',
		},
	},

	// JavaScript and config files
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'no-console': 'warn',
		},
	},

	// Ignore patterns
	{
		ignores: ['node_modules', 'dist', '.git'],
	},
];
