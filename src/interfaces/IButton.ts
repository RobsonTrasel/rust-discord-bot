import { ButtonInteraction } from "discord.js";

export interface IButton {
  customId: string;
  label: string;
  style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK";
  execute(interaction: ButtonInteraction): Promise<void>;
}
