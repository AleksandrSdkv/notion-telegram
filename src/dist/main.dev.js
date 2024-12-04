"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _telegraf = require("telegraf");

var _scenes = require("telegraf/scenes");

var _notion = require("./notion.js");

var _data = require("./data.js");

var _filters = require("telegraf/filters");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var bot = new _telegraf.Telegraf(process.env.BOT_TOKEN, {
  handlerTimeout: 30000
});
bot.telegram.setMyCommands([{
  command: 'start',
  description: 'Start the bot'
}, {
  command: 'help',
  description: 'Get help'
}]);
var properties = {
  Наименование: {
    title: [{
      text: {
        content: 'Стул'
      }
    }]
  }
};
bot.use(function (ctx, next) {
  console.log('Следующий обработчик вызван!');
  return next();
});
bot.use(function (ctx, next) {
  console.log('Еще один следующий обработчик вызван!');
  next();
});
bot.command('Hello', function (ctx, next) {
  console.log('hello');
  return ctx.reply('Hello-hello').then(function () {
    return next();
  });
});
bot.action('Aleksandr', function _callee(ctx) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ctx.reply('действие');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
bot.start(function _callee2(ctx) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(ctx.reply('Выбери действие', _telegraf.Markup.inlineKeyboard([_telegraf.Markup.button.callback('Aleksandr', 'Aleksandr')])));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // bot.on(message('text'), (ctx) => {
//   const found = personal.find(
//     (person) => person.name.toLowerCase() === ctx.message.text.toLowerCase(),
//   );
//   if (found) {
//     properties['Утверждающий'] = {
//       people: [
//         {
//           id: found.id,
//         },
//       ],
//     };
//   }
//   console.log(properties);
// });

bot.hears('Заполнить заявку', function _callee3(ctx) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ctx.reply('Имя заполнителя', _telegraf.Markup.keyboard(["Aleksandr"]).resize()));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
});
bot.hears('Удалить заявку', function _callee4(ctx) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          ctx.reply('Имя заполнителя', _telegraf.Markup.keyboard(["\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0443"]).resize());

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});
bot.launch();
process.once('SIGINT', function () {
  return bot.stop('SIGINT');
});
process.once('SIGTERM', function () {
  return bot.stop('SIGTERM');
});