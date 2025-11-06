module.exports = {
  // TypeScript and JavaScript files
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix",
    () => "tsc --noEmit", // Type check all files
  ],

  // JSON, CSS, SCSS, and Markdown files
  "*.{json,css,scss,md}": ["prettier --write"],
};
