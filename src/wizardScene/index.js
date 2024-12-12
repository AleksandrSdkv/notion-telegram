import { Scenes } from 'telegraf';
import { step1 } from './scenes/step1.js';
import { step2 } from './scenes/step2.js';
import { step3 } from './scenes/step3.js';
import { step4 } from './scenes/step4.js';
import { step5 } from './scenes/step5.js';
import { step6 } from './scenes/step6.js';
import { stepConfirmation } from './scenes/confirmation.js';

const registrationWizard = new Scenes.Stage([
  new Scenes.WizardScene(
    'registration-wizard',
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    stepConfirmation,
  ),
]);

export { registrationWizard };
