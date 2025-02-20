import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './'
})

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
    '!<rootDir>/.vercel/**',
    '!<rootDir>/*.config.[tj]s',
    '!<rootDir>/tailwind-indicator.tsx'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM: true
    }
  },
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@/auth$': '<rootDir>/__mocks__/auth.ts',
    '^next-auth/providers/credentials$':
      '<rootDir>/__mocks__/next-auth-providers-credentials.ts',
    'next-auth': '<rootDir>/__mocks__/next-auth.ts',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
    '^ai/rsc$': '<rootDir>/node_modules/ai/rsc/dist',
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '**/__tests__/**/*\\([^)]+\\)*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/.vercel/',
    '<rootDir>/node_modules/',
    '<rootDir>/*.config.[tj]s',
    '!<rootDir>/tailwind-indicator.tsx',
    '^.+\\.module\\.(css|sass|scss)$'
  ]
}

const modulesToTransform = [
  'nanoid',
  'react',
  'react-markdown',
  'micromark-util-combine-extensions',
  'micromark-util-chunked',
  'micromark-factory-space',
  'micromark-util-character',
  'micromark-core-commonmark',
  'micromark-util-classify-character',
  'micromark-util-resolve-all',
  'decode-named-character-reference',
  'micromark-util-subtokenize',
  'micromark-factory-destination',
  'micromark-factory-label',
  'micromark-factory-title',
  'micromark-factory-whitespace',
  'micromark-util-normalize-identifier',
  'micromark-util-html-tag-name',
  'remark-gfm',
  'micromark-extension-gfm',
  'micromark-util-sanitize-uri',
  'micromark-util-encode',
  'mdast-util-gfm',
  'ccount',
  'mdast-util-find-and-replace',
  'escape-string-regexp',
  'unist-util-visit-parents',
  'unist-util-is',
  'mdast-util-gfm-footnote',
  'mdast-util-to-markdown',
  'micromark-util-decode-string',
  'micromark-util-decode-numeric-character-reference',
  'markdown-table',
  'remark-math',
  'micromark-extension-math',
  'mdast-util-math',
  'longest-streak',
  'rehype-raw',
  'hast-util-raw',
  'hast-util-from-parse5',
  'devlop',
  'hastscript',
  'property-information',
  'comma-separated-tokens',
  ''

];

module.exports = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: [
    `/node_modules/(?!${modulesToTransform.join('|')})`,
  ],
});