module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['BraveHeadless'],
    customLaunchers: {
      BraveHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--remote-debugging-port=9222'],
        executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
