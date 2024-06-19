import axios from "axios";
import { IService } from "../interfaces/IService";
import { IBattleMetricsResponse } from "../interfaces/IBattleMetricsResponse";

export default class WipeInfoService implements IService {
  private serverId: string;
  private apiUrl: string;

  constructor() {
    this.serverId = process.env.SERVER_ID || "";
    this.apiUrl = process.env.API_URL || "";
  }

  async execute(): Promise<string> {
    return this.getWipeInfo();
  }

  async getWipeInfo(): Promise<string> {
    try {
      const response = await axios.get(`${this.apiUrl}${this.serverId}`);
      const data: any = await response.data;
      const lastWipe = data.data.attributes.details.rust_last_wipe;

      if (!this.isBattleMetricsResponse(data))
        throw new Error("Resposta invalida do BattleMetrics");

      return `Último WIPE: ${lastWipe}`;
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
