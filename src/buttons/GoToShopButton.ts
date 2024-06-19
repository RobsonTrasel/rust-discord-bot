import { ButtonInteraction, Guild } from "discord.js";
import { IButton } from "~/interfaces/IButton";
import { IService } from "~/interfaces/IService";

export default class GoToShopButton implements IButton {
  customId: string;
  label: string;
  style: "PRIMARY";
  private service: IService;

  constructor(service: IService) {
    this.customId = "gotoShop";
    this.label = "Ir para a loja";
    this.style = "PRIMARY";
    this.service = service;
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    const guild = interaction.guild as Guild;
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
      const response = await this.service.execute(userId, username, guild);
      await interaction.reply({ content: response, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Falha ao criar o canal.",
        ephemeral: true,
      });
    }
  }
}
