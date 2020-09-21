import { Bot } from "./src/Bot";
import { Logger, LogLevel } from "./src/Logger";
import { DiscordNotification } from "./src/Notification/DiscordNotification";
import { Evga } from "./src/Crawler/Evga";
import { Nvidia } from "./src/Crawler/Nvidia";
import { Bestbuy } from "./src/Crawler/Bestbuy";
require("dotenv").config();

const bot = new Bot(
  (process.env.DELAY as unknown) as number,
  [new Nvidia(), new Evga(), new Bestbuy()],
  [
    new DiscordNotification(
      process.env.DISCORD_WEBHOOK_ID as string,
      process.env.DISCORD_WEBHOOK_TOKEN as string
    ),
  ],
  new Logger(
    parseInt((process.env.DEBUG as unknown) as string) === 1
      ? LogLevel.Debug
      : LogLevel.Info
  )
);

bot.start();
