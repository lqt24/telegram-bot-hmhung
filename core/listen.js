module.exports = function ({ msg, bot, commands }) {
  require("./handle/handleCommand.js")({ bot, commands, msg });
};
