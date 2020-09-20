import {Bot} from './src/Bot';
import {Logger, LogLevel} from './src/Logger';
import {TwitterNotification} from './src/Notification/TwitterNotification';
require('dotenv').config();

const bot = new Bot(process.env.DELAY as unknown as number, [
], [
  new TwitterNotification(
    process.env.TWITTER_CONSUMER_KEY as string,
    process.env.TWITTER_CONSUMER_SECRET as string,
    process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  )
], new Logger(parseInt(process.env.DEBUG as unknown as string) === 1 ? LogLevel.Debug : LogLevel.Info));

bot.start();
