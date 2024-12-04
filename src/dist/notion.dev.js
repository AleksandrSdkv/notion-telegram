"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewGroup = exports.getListLength = void 0;

var _client = require("@notionhq/client");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var notion = new _client.Client({
  auth: process.env.NOTION_KEY,
  logLevel: _client.LogLevel.DEBUG
});
var blockId = process.env.NOTION_ID_DB;

var getListLength = function getListLength() {
  var response;
  return regeneratorRuntime.async(function getListLength$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(notion.databases.retrieve({
            database_id: blockId
          }));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", Object.keys(response.properties).length);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", 0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getListLength = getListLength;

var createNewGroup = function createNewGroup(propertiesData) {
  var parameters;
  return regeneratorRuntime.async(function createNewGroup$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(propertiesData);
          _context2.prev = 1;
          parameters = {
            parent: {
              database_id: blockId
            },
            properties: propertiesData
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(notion.pages.create(parameters));

        case 5:
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          console.error('Error fetching database:', _context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

exports.createNewGroup = createNewGroup;