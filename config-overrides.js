/* config-overrides.js */
const { injectBabelPlugin } = require("react-app-rewired");
const rewireMobX = require("react-app-rewire-mobx");
const rewireStyledComponents = require("react-app-rewire-styled-components");

module.exports = function override(config, env) {
  // antd design
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: "css" }],
    config
  );
  // use the MobX rewire
  config = rewireMobX(config, env);

  // use the styled component rewire
  config = rewireStyledComponents(config, env);

  return config;
};
