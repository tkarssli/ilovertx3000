import {Logger} from '../Logger';

export interface NotificationInterface {
  notify(message: string, logger: Logger): void;
}
