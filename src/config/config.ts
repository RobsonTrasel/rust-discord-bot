import { config } from "dotenv";
import { getEnvVariable } from "../helper/getEnvVariable";

config();

export const Config = {
  discordToken: getEnvVariable("DISCORD_BOT_TOKEN"),
  serverId: getEnvVariable("SERVER_ID"),
  apiUrl: getEnvVariable("API_URL"),
  discordClientId: getEnvVariable("APPLICATION_ID"),
};
