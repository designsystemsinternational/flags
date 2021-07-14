const { extendDefaultPlugins } = require("svgo");

module.exports = {
  multipass: true, // boolean. false by default
  plugins: extendDefaultPlugins([
    { name: "convertStyleToAttrs", active: true },
    { name: "removeDimensions", active: true },
    { name: "removeViewBox", active: false },
    { name: "convertPathData", active: false },
    { name: "convertTransform", active: false },
    { name: "cleanupIDs", active: false },
    { name: "prefixIds", active: true },
  ]),
};
