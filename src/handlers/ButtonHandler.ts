import path from "path";
import fs from "node:fs";
import { IButton } from "~/interfaces/IButton";
import { ServiceLoader } from "../loaders/ServiceLoaders";
import { IButtonHandler } from "~/interfaces/IButtonHandler";
import { ButtonInteraction } from "discord.js";

export class ButtonHandler implements IButtonHandler {
  private button: Map<string, IButton> = new Map();
  private serviceLoader: ServiceLoader;

  constructor(serviceLoader: ServiceLoader) {
    this.serviceLoader = serviceLoader;
    this.loadButtons();
  }

  async handle(interaction: ButtonInteraction): Promise<void> {
    const button = this.button.get(interaction.customId);
    if (button) {
      await button.execute(interaction);
    } else {
      await interaction.reply("Botão não encontrado.");
    }
  }

  private loadButtons(): void {
    const buttonsPath = path.join(__dirname, "../buttons");
    fs.readdirSync(buttonsPath).forEach((file) => {
      if (file.endsWith(".ts")) {
        const { default: ButtonClass } = require(path.join(buttonsPath, file));
        if (typeof ButtonClass === "function") {
          const serviceName = file.replace("Button.ts", "Service");
          const service = this.serviceLoader.getService(serviceName);

          if (service) {
            const buttonsInstance = new ButtonClass(service);
            this.button.set(buttonsInstance.customId, buttonsInstance);
            console.log(
              `Botão ${file.replace(".ts", "")} carregado com sucesso.`
            );
          } else {
            console.warn(
              `Serviço ${serviceName} não encontrado para o botão ${file}.`
            );
          }
        } else {
          console.error(`Falha ao carregar botão: ${file}`);
        }
      }
    });
  }
}
