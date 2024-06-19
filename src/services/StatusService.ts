import axios from "axios";
import { IService } from "../interfaces/IService";
import { IBattleMetricsResponse } from "../interfaces/IBattleMetricsResponse";

export default class StatusService implements IService {
  private serverId: string;
  private apiUrl: string;

  constructor() {
    this.serverId = process.env.SERVER_ID || "";
    this.apiUrl = process.env.API_URL || "";
  }

  async execute(): Promise<string> {
    return this.getStatus();
  }

  async getStatus(): Promise<string> {
    try {
      const response = await axios.get(`${this.apiUrl}${this.serverId}`);
      const data: any = await response.data;
      const serverName = data.data.attributes.name;
      const players = data.data.attributes.players;
      const maxPlayers = data.data.attributes.maxPlayers;
      const isOnline = data.data.attributes.status === "online";

      if (!this.isBattleMetricsResponse(data))
        throw new Error("Resposta invalida do BattleMetrics");

      return `Nome do Servidor: ${serverName}\nJogadores: ${players}/${maxPlayers}\nStatus: ${
        isOnline ? "Online" : "Offline"
      }`;
    } catch (error) {
      console.error(error);
      return `Falha ao requisitar a informação da API`;
    }
  }

  private isBattleMetricsResponse(data: any): data is IBattleMetricsResponse {
    return (
      data &&
      data.data &&
      data.data.attributes &&
      typeof data.data.attributes.name === "string"
    );
  }
}
