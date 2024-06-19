import { CommandInteraction, Message } from "discord.js";
import { ICommand } from "~/interfaces/ICommand";
import { IService } from "~/interfaces/IService";

export default class HelpCommand implements ICommand {
  name: string;
  description: string;
  private service: IService;

  constructor(service: IService) {
    this.name = "help";
    this.description = "Mostra a lista de todos os comandos disponíveis.";
    this.service = service;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const helpMessage = await this.service.execute();
    await interaction.reply(helpMessage);
  }

  async executeMessage(message: Message): Promise<void> {
    const helpMessage = await this.service.execute();
    await message.reply(helpMessage);
  }
}
