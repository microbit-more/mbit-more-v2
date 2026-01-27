/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
  },
  testMatch: [
    '<rootDir>/src/vm/extensions/block/**/*.{spec,test}.js',
    '<rootDir>/src/vm/extensions/block/**/*.{spec,test}.jsx',
    '<rootDir>/src/gui/lib/libraries/extensions/entry/**/*.{spec,test}.js',
    '<rootDir>/src/gui/lib/libraries/extensions/entry/**/*.{spec,test}.jsx'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/vm/extensions/block/**/*.{js,jsx}',
    'src/gui/lib/libraries/extensions/entry/**/*.{js,jsx}',
    '!src/**/index.{js,jsx}'
  ],
  moduleNameMapper: {
    '\\.(png|svg|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  roots: ['<rootDir>']
};
