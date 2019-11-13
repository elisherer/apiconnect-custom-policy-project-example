// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    testEnvironment: "ibm-apiconnect",
    testEnvironmentOptions: {
      context: {
          "custom.variable.x": "Hello World" // This variable could be retreived by `apim.getvariable('custom.variable.x')`
      }
    },
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
};