module.exports = function({bot,msg}) {
      const context = { bot, args, msg }; // Gói bot và các tham số vào object
      event.execute(context);
  });
}