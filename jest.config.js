const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./__tests__/tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1"
  },
  // tslint:disable-next-line:no-null-keyword
  resolver: null,
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }//  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */ )
};