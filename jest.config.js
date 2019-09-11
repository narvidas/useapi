module.exports = {
  setupFilesAfterEnv: ["<rootDir>/rtl.setup.js"],
  testPathIgnorePatterns: ["node_modules", "<rootDir>/test/acceptance"],
  coveragePathIgnorePatterns: ["node_modules", "<rootDir>/test/helpers"],
  reporters: ["default", ["jest-junit", { outputDirectory: "testReport" }]],
  coverageDirectory: "testReport",
  coverageReporters: ["text", "cobertura", "lcov"],
};
