const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const allureRuntime = require('@shelex/cypress-allure-plugin');

module.exports = (on, config) => {
  allureRuntime(on, config);
  return allureWriter(on, config);
};


