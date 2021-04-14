exports.config = {
  tests: "./tests/*_test.js",
  output: "./tests/output",
  helpers: {
    Playwright: {
      url: "http://lvh.me",
      show: true,
      browser: "chromium",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap: null,
  mocha: {},
  name: "web",
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
