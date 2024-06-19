import { CommandInteraction, Message } from "discord.js";
import { ICommandHandler } from "../interfaces/ICommandHandler";
import { ICommand } from "../interfaces/ICommand";
import { ServiceLoader } from "../loaders/ServiceLoaders";
import path from "node:path";
import fs from "node:fs";
import HelpService from "../services/HelpService";
import HelpCommand from "../commands/HelpCommand";

export class CommandHandler implements ICommandHandler {
  private commands: Map<string, ICommand> = new Map();

  constructor(serviceLoader: ServiceLoader) {
    this.loadCommands(serviceLoader);
    this.addHelpCommand();
  }

  private loadCommands(serviceLoader: ServiceLoader): void {
    const commandsPath = path.join(__dirname, "../commands");

    fs.readdirSync(commandsPath).forEach((file) => {
      if (file.endsWith(".ts")) {
        const { default: CommandClass } = require(path.join(
          commandsPath,
          file
        ));
        if (typeof CommandClass === "function") {
          const serviceName = file.replace("Command.ts", "Service");
          const service = serviceLoader.getService(serviceName);

          if (service) {
            const commandInstance = new CommandClass(service);
            this.commands.set(commandInstance.name, commandInstance);
            console.log(
              `Comando ${file.replace(".ts", "")} carregado com sucesso.`
            );
          } else {
            console.warn(
              `Serviço ${serviceName} não encontrado para o comando ${file}.`
            );
          }
        } else {
          console.error(`Falha ao carregar comando: ${file}`);
        }
      }
    });
  }

  private addHelpCommand(): void {
    const helpService = new HelpService(this.commands);
    const helpCommand = new HelpCommand(helpService);
    this.commands.set(helpCommand.name, helpCommand);
    console.log("Comando HelpCommand carregado com sucesso");
  }

  async handle(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isCommand()) return;

    const command = this.commands.get(interaction.commandName);
    if (command) {
      await command.execute(interaction);
    } else {
      await interaction.reply("Comando não reconhecido.");
    }
  }

  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const commandName = content.split(" ")[0].substring(1);

    const command = this.commands.get(commandName);
    if (command) {
      await command.executeMessage(message);
    } else {
      await message.reply("Comando não reconhecido.");
    }
  }
}
