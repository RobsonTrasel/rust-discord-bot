import { ButtonInteraction } from "discord.js";
import { IButton } from "~/interfaces/IButton";
import { IService } from "~/interfaces/IService";

export default class StatusButton implements IButton {
  customId: string;
  label: string;
  style: "PRIMARY";
  private service: IService;

  constructor(service: IService) {
    this.customId = "statusPrimary";
    this.label = "Status";
    this.style = "PRIMARY";
    this.service = service;
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    const status = await this.service.execute();
    await interaction.reply(status);
  }
}
