/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  watchPathIgnorePatterns: ["<rootDir>/.postgres"],
  transformIgnorePatterns: ["/node_modules/(?!@faker-js)"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  globalSetup: "<rootDir>/jest.global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup-files-after-env.ts"],
};
