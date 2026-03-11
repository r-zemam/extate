// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Web Crypto API for Node.js environment
if (typeof crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  global.crypto = webcrypto;
}
