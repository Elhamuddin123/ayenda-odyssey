const config = {
  "*.{css,js,json,md,mjs,ts,tsx}": ["prettier --write"],
  "*.{ts,tsx}": ["eslint --fix"],
};

export default config;
