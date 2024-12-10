"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registrationWizard = void 0;

var _telegraf = require("telegraf");

var _step = require("./scenes/step1.js");

var _step2 = require("./scenes/step2.js");

// import { step3 } from './scenes/step3.js';
// import { step4 } from './scenes/step4.js';
// import { Check } from './scenes/Check.js';
// import { Confirmation } from './scenes/Confirmation.js';
var registrationWizard = new _telegraf.Scenes.Stage([new _telegraf.Scenes.WizardScene('registration-wizard', _step.step1, _step2.step2)]);
exports.registrationWizard = registrationWizard;