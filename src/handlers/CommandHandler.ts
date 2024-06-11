import { CommandInteraction, Message } from "discord.js";
import { ICommandHandler } from "../interfaces/ICommandHandler";
import { IService } from "../interfaces/IService";

export class CommandHandler implements ICommandHandler {
  private service: IService;

  constructor(service: IService) {
    this.service = service;
  }

  async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    if (commandName === "!status") {
      const status = await this.service.getStatus();
      await interaction.reply(status);
    } else if (commandName === "!wipeinfo") {
      const wipeInfo = await this.service.getWipeInfo();
      await interaction.reply(wipeInfo);
    } else {
      await interaction.reply("Comando não reconhecido.");
    }
  }

  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    if (content.startsWith("!status")) {
      const status = await this.service.getStatus();
      await message.reply(status);
    } else if (content.startsWith("!wipeinfo")) {
      const wipeInfo = await this.service.getWipeInfo();
      await message.reply(wipeInfo);
    } else {
      await message.reply("Comando não reconhecido.");
    }
  }
}
