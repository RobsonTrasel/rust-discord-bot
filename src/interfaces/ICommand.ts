import { CommandInteraction, Message } from "discord.js";

export interface ICommand {
  name: string;
  description: string;
  execute(interaction: CommandInteraction): Promise<void>;
  executeMessage(message: Message): Promise<void>;
}
