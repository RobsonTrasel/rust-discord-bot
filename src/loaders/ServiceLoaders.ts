import { IService } from "../interfaces/IService";
import { Client } from "discord.js";
import path from "node:path";
import fs from "node:fs";

export class ServiceLoader {
  private static instance: ServiceLoader;
  private services: Map<string, IService> = new Map();

  constructor(client: Client) {
    this.loadServices(client);
  }

  public static getInstance(client: Client): ServiceLoader {
    if (!ServiceLoader.instance) {
      ServiceLoader.instance = new ServiceLoader(client);
    }

    return ServiceLoader.instance;
  }

  private loadServices(client: Client): void {
    const servicesPath = path.join(__dirname, "../services");

    fs.readdirSync(servicesPath).forEach((file) => {
      if (file.endsWith(".ts")) {
        const { default: ServiceClass } = require(path.join(
          servicesPath,
          file
        ));
        if (typeof ServiceClass === "function") {
          const serviceInstance = new ServiceClass(client);
          this.services.set(file.replace(".ts", ""), serviceInstance);
          console.log(
            `Serviço ${file.replace(".ts", "")} carregado com sucesso.`
          );
        } else {
          console.error(`Falha ao carregar serviço: ${file}`);
        }
      }
    });
  }

  public getService(name: string): IService | undefined {
    return this.services.get(name);
  }
}
