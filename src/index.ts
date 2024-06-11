import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { Config } from "./config/config";
import { BattleMetricsService } from "./services/BattleMetricsService";
import { CommandHandler } from "./handlers/CommandHandler";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const service = new BattleMetricsService(Config.serverId, Config.apiUrl);
const commandHandler = new CommandHandler(service);

client.once("ready", () => console.log(`Logado como: ${client.user?.tag}`));

client.on("interactionCreate", async (interaction: Interaction) => {
  console.log(interaction);
  if (!interaction.isCommand()) return;
  await commandHandler.handle(interaction);
});

client.on("messageCreate", async (message) => {
  await commandHandler.handleMessage(message);
});

client.login(Config.discordToken);
