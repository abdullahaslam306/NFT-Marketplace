/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	testMatch: ["**/__test__/handlers/assets/list.test.ts"],
	reporters: [
		'default', ['jest-junit', {
			outputDirectory: './',
			outputName: 'jestReport.xml',
		}],
	],
};
