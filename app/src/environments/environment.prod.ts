import { environment as secretEnv } from './environment.prod.secret';
import { environment as templateEnv } from './environment.prod.template';

export const environment = (() => {
  try {
    return secretEnv;
  } catch {
    return templateEnv;
  }
})();
