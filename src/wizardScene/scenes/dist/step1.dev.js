"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.step1 = void 0;

var _telegraf = require("telegraf");

var _buttonConstants = require("../../constants/buttonConstants.js");

var step1 = function step1(ctx, keyOut) {
  return regeneratorRuntime.async(function step1$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ctx.wizard.state.list = {};
          ctx.reply('Выберите заявителя:', _telegraf.Markup.keyboard([['Aleksandr', 'Vladimir'], ["".concat(_buttonConstants.key.out)]]).resize().oneTime());
          return _context.abrupt("return", ctx.wizard.next());

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.step1 = step1;