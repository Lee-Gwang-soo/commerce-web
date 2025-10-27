module.exports = {
  // TypeScript and JavaScript files
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],

  // JSON, CSS, SCSS, and Markdown files
  "*.{json,css,scss,md}": ["prettier --write"],
};
