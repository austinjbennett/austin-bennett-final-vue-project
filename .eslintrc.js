module.exports = {
	"root": true,
	"env": {
		"node": true,
		"es6": true,
		"browser": true
	},
	"extends": [
		"plugin:vue/essential",
		"@vue/airbnb"
	],
	"rules": {
		"arrow-body-style": [
			1,
			"as-needed"
		],
		"no-tabs": [
			"error",
			{
				"allowIndentationTabs": true
			}
		],
		"indent": [
			2,
			"tab"
		],
		"space-before-function-paren": 2,
		"no-underscore-dangle": 1,
		"no-new": 1,
		"no-console": 1,
		"max-len": 0
	},
	"parserOptions": {
		"parser": "babel-eslint"
	}
},