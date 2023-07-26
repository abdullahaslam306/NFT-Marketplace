/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	reporters: [
		'default', ['jest-junit', {
			outputDirectory: './',
			outputName: 'jestReport.xml',
		}],
	],
};
