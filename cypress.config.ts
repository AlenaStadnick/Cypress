import { defineConfig } from "cypress";
import webpack from '@cypress/webpack-preprocessor';
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import allureWriter from "@shelex/cypress-allure-plugin/writer";
import dotenv from "dotenv";

dotenv.config();

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // Додаткові плагіни і налаштування
  await addCucumberPreprocessorPlugin(on, config);
  require("cypress-mochawesome-reporter/plugin")(on);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );
  allureWriter(on, config);

  return config;
}

export default defineConfig({
  projectId: "xw17vy",
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "custom-title",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/integration/**/*.ts",
    viewportWidth: 1200,
    viewportHeight: 800,
    chromeWebSecurity: false,
    video: false,
    env: {
      base_url: "https://api.clickup.com/api/v2",
      token: process.env.TOKEN,
      allureReuseAfterSpec: true,
    },
  },
  webpackOptions: {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { transpileOnly: true }
          }
        ]
      }
    }
  }
});
