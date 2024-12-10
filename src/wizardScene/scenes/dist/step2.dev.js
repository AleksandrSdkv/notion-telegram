"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.step2 = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _yandexDiskServices = require("../../yandexAPI/yandexDiskServices.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var step2 = function step2(ctx) {
  var _ctx$message$document, fileId, fileName, pathName, _ref, _ref2, fileLink, uploadUrl, response, uploadResponse;

  return regeneratorRuntime.async(function step2$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _ctx$message$document = ctx.message.document, fileId = _ctx$message$document.file_id, fileName = _ctx$message$document.file_name;
          pathName = '/testBot/';
          _context.next = 5;
          return regeneratorRuntime.awrap(Promise.all([ctx.telegram.getFileLink(fileId), (0, _yandexDiskServices.getYandexDiskUploadUrl)(fileName, pathName, process.env.MY_TOKEN)]));

        case 5:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          fileLink = _ref2[0];
          uploadUrl = _ref2[1];
          _context.next = 11;
          return regeneratorRuntime.awrap(_axios["default"].get(fileLink, {
            responseType: 'stream'
          }));

        case 11:
          response = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(_axios["default"].put(uploadUrl, response.data, {
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          }));

        case 14:
          uploadResponse = _context.sent;

          if (!(uploadResponse.status !== 201)) {
            _context.next = 17;
            break;
          }

          throw new Error('Ошибка загрузки на Яндекс Диск');

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(ctx.reply("\u0424\u0430\u0439\u043B ".concat(fileName, " \u0431\u044B\u043B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D.")));

        case 19:
          (0, _yandexDiskServices.publishFileToYandexDisk)(fileName, pathName, process.env.MY_TOKEN).then(function (_) {
            (0, _yandexDiskServices.getYandexDiskFileMetadata)(fileName, pathName, process.env.MY_TOKEN).then(function (res) {
              ctx.reply("\u0412\u0430\u0448 \u0444\u0430\u0439\u043B \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435: ".concat(res.data.public_url));
            });
          });
          _context.next = 27;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          _context.next = 26;
          return regeneratorRuntime.awrap(ctx.reply('Ошибка при обработке файла.'));

        case 26:
          console.error(_context.t0);

        case 27:
          return _context.abrupt("return", ctx.wizard.next());

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.step2 = step2;