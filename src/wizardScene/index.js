import { Scenes } from 'telegraf';
import { step1 } from './scenes/step1.js';
import { step2 } from './scenes/step2.js';
// import { step3 } from './scenes/step3.js';
// import { step4 } from './scenes/step4.js';
// import { Check } from './scenes/Check.js';
// import { Confirmation } from './scenes/Confirmation.js';

const registrationWizard = new Scenes.Stage([
  new Scenes.WizardScene(
    'registration-wizard',
    step1,
    step2,
    // step3,
    // step4,
    // Check,
    // Confirmation,
  ),
]);

export { registrationWizard };
