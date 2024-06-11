import { CommandInteraction } from "discord.js";

export interface ICommandHandler {
  handle(interaction: CommandInteraction): Promise<void>;
}
