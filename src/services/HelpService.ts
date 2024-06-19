import { ICommand } from "~/interfaces/ICommand";
import { IService } from "~/interfaces/IService";

export default class HelpService implements IService {
  private commands: Map<string, ICommand>;

  constructor(commands: Map<string, ICommand>) {
    this.commands = commands;
  }

  async execute(): Promise<string> {
    let helpMessage = "Aqui estão os comandos disponíveis:\n\n";
    this.commands.forEach((command) => {
      helpMessage += `**${command.name}**: ${command.description}\n`;
    });

    return helpMessage;
  }
}
