"use strict";

var _telegraf = require("telegraf");

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
};

var key = {
  out: 'Выйти'
}; // Шаг 1: Запрос имени пользователя

var step1 = function step1(ctx) {
  return regeneratorRuntime.async(function step1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ctx.wizard.state.list = {};
          ctx.reply('Выберите заявителя:', _telegraf.Markup.keyboard([['Aleksandr', 'Vladimir'], ["".concat(key.out)]]).resize().oneTime());
          return _context.abrupt("return", ctx.wizard.next());

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Шаг 2: Запрос возраста пользователя


var step2 = function step2(ctx) {
  var person;
  return regeneratorRuntime.async(function step2$(_context2) {
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
          person = foundPerson(ctx.message.text);

          if (person) {
            _context2.next = 10;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u0430 \u0441 \u0442\u0430\u043A\u0438\u043C \u0438\u043C\u0435\u043D\u0435\u043C \u043D\u0435\u0442! \u0412\u0432\u0435\u0434\u0438\u0442\u0435 /start, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430.")));

        case 8:
          ctx.scene.leave();
          return _context2.abrupt("return");

        case 10:
          if (person) {
            ctx.wizard.state.list['Утверждающий'] = {
              // Сохраняем имя пользователя
              people: [{
                id: person.id
              }]
            };
          }

          if (!(ctx.message.text === 'Выйти')) {
            _context2.next = 15;
            break;
          }

          _context2.next = 14;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 14:
          return _context2.abrupt("return", ctx.scene.leave());

        case 15:
          ctx.wizard.state.user = ctx.message.text;
          _context2.next = 18;
          return regeneratorRuntime.awrap(ctx.reply("\u041E\u0442\u043B\u0438\u0447\u043D\u043E, ".concat(ctx.message.text, "!  \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u043E\u043B\u0435 \"\u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435\" (\u043F\u0440\u0438\u043C\u0435\u0440: \"\u0421\u0442\u0443\u043B\"):"), _telegraf.Markup.keyboard([["".concat(key.out)]]).resize().oneTime()));

        case 18:
          return _context2.abrupt("return", ctx.wizard.next());

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Шаг 3: Подтверждение информации


var step3 = function step3(ctx) {
  return regeneratorRuntime.async(function step3$(_context3) {
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
          ctx.wizard.state.list['Наименование'] = {
            title: [{
              text: {
                content: ctx.message.text
              }
            }]
          };
          ctx.wizard.state.product = ctx.message.text;
          _context3.next = 8;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u0414\u0430\u043B\u0435\u0435 \u043D\u0443\u0436\u043D\u043E \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0440\u043E\u0447\u043D\u043E\u0442\u044C \u0437\u0430\u044F\u0432\u043A\u0438"), _telegraf.Markup.keyboard([['Срочно', 'Не срочно'], ["".concat(key.out)]]).resize().oneTime()));

        case 8:
          return _context3.abrupt("return", ctx.wizard.next());

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var step4 = function step4(ctx) {
  return regeneratorRuntime.async(function step4$(_context4) {
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
          if (!(ctx.message.text === 'Не срочно' && ctx.message.text === 'Срочно')) {
            _context4.next = 7;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(ctx.reply("\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438: ".concat(ctx.message.text, ". \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430 \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u0412\u044B\u0439\u0442\u0438"), _telegraf.Markup.keyboard([['Срочно', 'Не срочно'], ["".concat(key.out)]]).resize().oneTime()));

        case 7:
          if (!(ctx.message.text === 'Не срочно')) {
            _context4.next = 10;
            break;
          }

          ctx.wizard.state.quickly = ctx.message.text;
          return _context4.abrupt("return", ctx.wizard.next());

        case 10:
          if (ctx.message.text === 'Срочно') {
            ctx.wizard.state.list['Срочность'] = {
              type: 'status',
              status: {
                name: 'Срочно'
              }
            };
            ctx.wizard.state.quickly = ctx.message.text;
          }

          return _context4.abrupt("return", ctx.wizard.next());

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var stepСheck = function stepСheck(ctx) {
  return regeneratorRuntime.async(function stepСheck$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!(ctx.message.text === 'Выйти')) {
            _context5.next = 4;
            break;
          }

          _context5.next = 3;
          return regeneratorRuntime.awrap(ctx.reply('Вы вышли из сцены. Введите /start, чтобы начать снова.'));

        case 3:
          return _context5.abrupt("return", ctx.scene.leave());

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(ctx.reply("\u041E\u0442\u043B\u0438\u0447\u043D\u043E! \u0414\u0430\u0432\u0430\u0439 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043C: \n  - \u0418\u043C\u044F: ".concat(ctx.wizard.state.user, "\n  - \u041D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435: ").concat(ctx.wizard.state.product, "\n  - \u0421\u0440\u043E\u0447\u043D\u043E\u0441\u0442\u044C: ").concat(ctx.wizard.state.quickly, "\n  \u0412\u0441\u0451 \u0432\u0435\u0440\u043D\u043E? (\u0434\u0430/\u043D\u0435\u0442)")));

        case 6:
          return _context5.abrupt("return", ctx.wizard.next());

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Шаг 4: Завершение


var stepConfirmation = function stepConfirmation(ctx) {
  var confirmation;
  return regeneratorRuntime.async(function stepConfirmation$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          confirmation = ctx.message.text.toLowerCase();

          if (!(confirmation === 'да')) {
            _context6.next = 8;
            break;
          }

          _context6.next = 4;
          return regeneratorRuntime.awrap(ctx.reply('Запрос завершен! 🎉'));

        case 4:
          (0, _notion.createNewGroup)(ctx.wizard.state.list);
          return _context6.abrupt("return", ctx.scene.leave());

        case 8:
          if (!(confirmation === 'нет')) {
            _context6.next = 14;
            break;
          }

          _context6.next = 11;
          return regeneratorRuntime.awrap(ctx.reply('Давай начнем сначала. Введи /start.'));

        case 11:
          return _context6.abrupt("return", ctx.scene.leave());

        case 14:
          _context6.next = 16;
          return regeneratorRuntime.awrap(ctx.reply('Пожалуйста, ответь "да" или "нет".'));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // Создание Wizard Scene


var registrationWizard = new _telegraf.Scenes.WizardScene('registration-wizard', step1, step2, step3, step4, stepСheck, stepConfirmation); // Создаем менеджер сцен и добавляем сцену

var stage = new _telegraf.Scenes.Stage([registrationWizard]); // Включаем поддержку сессий и сцен

bot.use((0, _telegraf.session)());
bot.use(stage.middleware()); // Обрабатываем команду /create для запуска сцены

bot.command('create', function (ctx) {
  return ctx.scene.enter('registration-wizard');
}); // Запуск бота

bot.launch().then(function () {
  return console.log('Бот запущен 🚀');
})["catch"](function (err) {
  return console.error('Ошибка при запуске бота:', err);
}); // Обработка ошибок

process.once('SIGINT', function () {
  return bot.stop('SIGINT');
});
process.once('SIGTERM', function () {
  return bot.stop('SIGTERM');
});