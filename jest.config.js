/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  watchPathIgnorePatterns: ["<rootDir>/.postgres"],
  transformIgnorePatterns: [
    "node_modules/(?!(@faker-js|uuid|@scalar/express-api-reference)/)",
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^uuid$": "uuid",
  },
  setupFiles: ["dotenv/config"],
  globalSetup: "<rootDir>/jest.global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup-files-after-env.ts"],
};
