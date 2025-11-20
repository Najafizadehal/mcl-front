// src/config/env.js
// Single place to switch between dev and production config

// Toggle this flag to switch configs
const IS_PRODUCTION = true;

const devConfig = {
  API_BASE_URL: 'http://localhost:8081',
};

const prodConfig = {
  API_BASE_URL: 'https://mcl.liara.run',
};

const config = IS_PRODUCTION ? prodConfig : devConfig;

export const isProduction = IS_PRODUCTION;
export default config;

