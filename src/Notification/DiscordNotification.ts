import { NotificationInterface } from "./NotificationInterface";
import { Logger } from "../Logger";
import Discord from "discord.js";

export class DiscordNotification implements NotificationInterface {
  // private readonly client: Discord.Client;
  private readonly webhookClient: Discord.WebhookClient;

  constructor(webhookId: string, webhookToken: string) {
    // this.client = new Discord.Client();
    this.webhookClient = new Discord.WebhookClient(webhookId, webhookToken);
  }

  notify(message: string, logger: Logger) {
    logger.debug("Notifying via discord", { message });
    try {
      this.webhookClient.send(message);
    } catch (e) {
      console.log(e);
    }
  }
}
