"use strict";

var _telegraf = require("telegraf");

var _index = require("./wizardScene/index.js");

var _data = require("./data.js");

var _notion = require("./notion.js");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config(); // Инициализация бота


var bot = new _telegraf.Telegraf(process.env.BOT_TOKEN);
bot.telegram.setMyCommands([{
  command: 'start',
  description: 'Start the bot'
}, {
  command: 'create',
  description: 'Создать новый заказ'
}]);

var foundPerson = function foundPerson(ctx) {
  var found = _data.personal.find(function (person) {
    return person.name.toLowerCase() === ctx.toLowerCase();
  });

  return found;
}; // Функция для получения ссылки для загрузки файла на Яндекс Диск
//   if (ctx.message.text === 'Выйти') {
//     await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
//     return ctx.scene.leave();
//   }
//   const person = foundPerson(ctx.message.text);
//   if (!person) {
//     await ctx.reply(
//       `Вы выбрали: ${ctx.message.text}. К сожалению сотрудника с таким именем нет! Введите /start, чтобы начать снова.`,
//     );
//     ctx.scene.leave();
//     return;
//   }
//   if (person) {
//     ctx.wizard.state.list['Утверждающий'] = {
//       // Сохраняем имя пользователя
//       people: [
//         {
//           id: person.id,
//         },
//       ],
//     };
//   }
//   if (ctx.message.text === 'Выйти') {
//     await ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.');
//     return ctx.scene.leave();
//   }
//   ctx.wizard.state.user = ctx.message.text;
//   await ctx.reply(
//     `Отлично, ${ctx.message.text}!  Пожалуйста, введите поле "Наименование" (пример: "Стул"):`,
//     Markup.keyboard([[`${key.out}`]])
//       .resize()
//       .oneTime(),
//   );
// Шаг 3: Подтверждение информации


var step3 = function step3(ctx) {
  return regeneratorRuntime.async(function step3$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(ctx.message.text === 'Выйти')) {
            _context.next = 4;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 3:
          return _context.abrupt("return", ctx.scene.leave());

        case 4:
          ctx.wizard.state.list['Наименование'] = {
            title: [{
              text: {
                content: ctx.message.text
              }
            }]
          };
          ctx.wizard.state.product = ctx.message.text;
          _context.next = 8;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u0414\u0430\u043B\u0435\u0435 \u043D\u0443\u0436\u043D\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0440\u043E\u0447\u043D\u043E\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0438"), Markup.keyboard([['Срочно', 'Не срочно'], ["".concat(key.out)]]).resize().oneTime()));

        case 8:
          return _context.abrupt("return", ctx.wizard.next());

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

var step4 = function step4(ctx) {
  return regeneratorRuntime.async(function step4$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(ctx.message.text === 'Выйти')) {
            _context2.next = 4;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 3:
          return _context2.abrupt("return", ctx.scene.leave());

        case 4:
          if (!(ctx.message.text === 'Не срочно' && ctx.message.text === 'Срочно')) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430 \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u0412\u044B\u0439\u0442\u0438"), Markup.keyboard([['Срочно', 'Не срочно'], ["".concat(key.out)]]).resize().oneTime()));

        case 7:
          if (!(ctx.message.text === 'Не срочно')) {
            _context2.next = 12;
            break;
          }

          ctx.wizard.state.quickly = ctx.message.text;
          _context2.next = 11;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430 \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u0412\u044B\u0439\u0442\u0438"), Markup.keyboard([['Срочно', 'Не срочно'], ["".concat(key.out)]]).resize().oneTime()));

        case 11:
          return _context2.abrupt("return", ctx.wizard.next());

        case 12:
          if (ctx.message.text === 'Срочно') {
            ctx.wizard.state.list['Срочность'] = {
              type: 'status',
              status: {
                name: 'Срочно'
              }
            };
            ctx.wizard.state.quickly = ctx.message.text;
          }

          return _context2.abrupt("return", ctx.wizard.next());

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var step5 = function step5(ctx) {
  return regeneratorRuntime.async(function step5$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(ctx.message.text === 'Выйти')) {
            _context3.next = 4;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 3:
          return _context3.abrupt("return", ctx.scene.leave());

        case 4:
          if (ctx.message.text === 'Срочно') {
            ctx.wizard.state.list['Срочность'] = {
              type: 'status',
              status: {
                name: 'Срочно'
              }
            };
            ctx.wizard.state.quickly = ctx.message.text;
          }

          return _context3.abrupt("return", ctx.wizard.next());

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var stepСheck = function stepСheck(ctx) {
  return regeneratorRuntime.async(function stepСheck$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(ctx.message.text === 'Выйти')) {
            _context4.next = 4;
            break;
          }

          _context4.next = 3;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 3:
          return _context4.abrupt("return", ctx.scene.leave());

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(ctx.reply("\u041E\u0442\u043B\u0438\u0447\u043D\u043E! \u0414\u0430\u0432\u0430\u0439 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C:\n  - \u0418\u043C\u044F: ".concat(ctx.wizard.state.user, "\n  - \u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435: ").concat(ctx.wizard.state.product, "\n  - \u0421\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u044C: ").concat(ctx.wizard.state.quickly, "\n  \u0412\u0441\u0451 \u0432\u0435\u0440\u043D\u043E? (\u0434\u0430/\u043D\u0435\u0442)")));

        case 6:
          return _context4.abrupt("return", ctx.wizard.next());

        case 7:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Шаг 4: Завершение


var stepConfirmation = function stepConfirmation(ctx) {
  var confirmation;
  return regeneratorRuntime.async(function stepConfirmation$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          confirmation = ctx.message.text.toLowerCase();

          if (!(confirmation === 'да')) {
            _context5.next = 8;
            break;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(ctx.reply('Запрос завершен! 🎉'));

        case 4:
          (0, _notion.createNewGroup)(ctx.wizard.state.list);
          return _context5.abrupt("return", ctx.scene.leave());

        case 8:
          if (!(confirmation === 'нет')) {
            _context5.next = 14;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(ctx.reply('Давай начнем сначала. Введи /start.'));

        case 11:
          return _context5.abrupt("return", ctx.scene.leave());

        case 14:
          _context5.next = 16;
          return regeneratorRuntime.awrap(ctx.reply('Пожалуйста, ответь "да" или "нет".'));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Включаем поддержку сессий и сцен


bot.use((0, _telegraf.session)());
bot.use(_index.registrationWizard); // подключаем сцены через stage.middleware()
// Обрабатываем команду /create для запуска сцены

bot.command('create', function (ctx) {
  return ctx.scene.enter('registration-wizard');
});
bot.launch().then(function () {
  return console.log('Бот запущен 🚀');
})["catch"](function (err) {
  return console.error('Ошибка при запуске бота:', err);
});
process.once('SIGINT', function () {
  return bot.stop('SIGINT');
});
process.once('SIGTERM', function () {
  return bot.stop('SIGTERM');
});