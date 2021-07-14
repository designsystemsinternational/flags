(function (factory) {
  typeof define === "function" && define.amd ? define(factory) : factory();
})(function () {
  "use strict";

  const flags = require("./flag-colors.json");

  module.exports = flags;
});
