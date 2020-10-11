//Custom register script for testing.
const register = require("@babel/register");
register({
  extensions: [".ts", ".tsx"],
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: ["@babel/plugin-proposal-class-properties"],
});
