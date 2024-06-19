import { CommandInteraction, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { IService } from "../interfaces/IService";

export default class StatusCommand implements ICommand {
  name: string;
  description: string;
  private service: IService;

  constructor(service: IService) {
    this.name = "status";
    this.description = "Mostra o status do servidor.";
    this.service = service;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const status = await this.service.execute();
    await interaction.reply(status);
  }

  async executeMessage(message: Message): Promise<void> {
    const status = await this.service.execute();
    await message.reply(status);
  }
}
