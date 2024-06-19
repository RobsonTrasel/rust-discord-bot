import * as RPC from "discord-rpc";
import axios from "axios";
import { Config } from "../config/config";
import { ActivityType, Client } from "discord.js";
import { format } from "date-fns";

export default class RichPresenceService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async execute(): Promise<void> {
    await this.startUpdatingPresence();
  }

  async startUpdatingPresence(): Promise<void> {
    this.updatePresence();
    setInterval(() => this.updatePresence(), 15000);
  }

  async updatePresence(): Promise<void> {
    try {
      const response = await axios.get(`${Config.apiUrl}${Config.serverId}`);
      const data = await response.data;

      const players = data.data.attributes.players;
      const maxPlayers = data.data.attributes.maxPlayers;
      const lastWipe = data.data.attributes.details.rust_last_wipe;
      const serverName = data.data.attributes.name;
      const serverStatus = data.data.attributes.status;
      const serverRegion =
        data.data.attributes.details.region || "Desconhecida";

      const lastWipeDate = new Date(lastWipe);
      const formattedLastWipe = format(lastWipeDate, "dd/MM/yyyy");

      const activities = [
        {
          name: `Jogadores Online: ${players}/${maxPlayers}`,
          type: ActivityType.Playing,
          state: `Servidor: ${serverName}`,
          details: `Status: ${serverStatus}`,
        },
        {
          name: `Servidor: ${serverName}`,
          type: ActivityType.Watching,
          state: `Região: ${serverRegion}`,
          details: `Último wipe: ${formattedLastWipe}`,
        },
        {
          name: `Último Wipe: ${formattedLastWipe}`,
          type: ActivityType.Listening,
          state: `Jogadores Ativos: ${players}`,
          details: `Max Jogadores: ${maxPlayers}`,
        },
        {
          name: `Monitorando: ${serverName}`,
          type: ActivityType.Watching,
          state: `Status: ${serverStatus}`,
          details: `Região: ${serverRegion}`,
        },
      ];

      const randomActivity =
        activities[Math.floor(Math.random() * activities.length)];
      this.client.user?.setActivity(randomActivity);
    } catch (error) {
      console.error("Falha ao atualizar o estado do BOT:", error);
    }
  }
}
