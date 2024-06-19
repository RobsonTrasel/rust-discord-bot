import { CommandInteraction, Message } from "discord.js";
import { ICommand } from "../interfaces/ICommand";
import { IService } from "../interfaces/IService";

export default class WipeInfoCommand implements ICommand {
  name: string;
  description: string;
  private service: IService;

  constructor(service: IService) {
    this.name = "wipeinfo";
    this.description = "Mostra quando foi o último wipe.";
    this.service = service;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const response = await this.service.execute();
    await interaction.reply(response);
  }

  async executeMessage(message: Message): Promise<void> {
    const response = await this.service.execute();
    await message.reply(response);
  }
}
