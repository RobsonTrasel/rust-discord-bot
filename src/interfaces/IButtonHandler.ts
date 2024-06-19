import { ButtonInteraction } from "discord.js";

export interface IButtonHandler {
  handle(interaction: ButtonInteraction): Promise<void>;
}
