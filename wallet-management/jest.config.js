module.exports = {
  verbose: true,
  reporters: [
    'default', ['jest-junit', {
      outputDirectory: './',
      outputName: 'jestReport.xml',
    }],
  ],
};
