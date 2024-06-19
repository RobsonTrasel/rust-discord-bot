import { Client, GatewayIntentBits, Interaction, Message } from "discord.js";
import { Config } from "./config/config";
import { CommandHandler } from "./handlers/CommandHandler";
import { ButtonHandler } from "./handlers/ButtonHandler";
import { ServiceLoader } from "./loaders/ServiceLoaders";

export class Bootstrap {
  private client: Client;
  private commandHandler: CommandHandler;
  private buttonHandler: ButtonHandler;
  private serviceLoader: ServiceLoader;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.serviceLoader = ServiceLoader.getInstance(this.client);
    this.commandHandler = new CommandHandler(this.serviceLoader);
    this.buttonHandler = new ButtonHandler(this.serviceLoader);
  }

  public async start(): Promise<void> {
    this.client.once("ready", async () => {
      console.log(`Logado como: ${this.client.user?.tag}`);
      await this.initializeService();
    });

    this.client.on("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        await this.commandHandler.handle(interaction);
      } else if (interaction.isButton()) {
        await this.buttonHandler.handle(interaction);
      }
    });

    this.client.on("messageCreate", async (message: Message) => {
      await this.commandHandler.handleMessage(message);
    });

    await this.client.login(Config.discordToken);
  }

  private async initializeService() {
    const channelService = this.serviceLoader.getService("ChannelService");
    const rpcService = this.serviceLoader.getService("RichPresenceService");
    if (rpcService) await rpcService.execute();
    if (channelService) await channelService.execute();
  }
}
