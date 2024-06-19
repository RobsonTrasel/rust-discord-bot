import { Client, Guild, TextChannel } from "discord.js";
import { IService } from "../interfaces/IService";
import { clearTimeout } from "timers";

export default class GoToShopService implements IService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async execute(
    userId: string,
    username: string,
    guild: Guild
  ): Promise<string> {
    const member = guild.members.cache.get(userId);
    if (!member) throw new Error("Membro não encontrado no servidor.");

    const channel = await guild.channels.create({
      name: `loja-${username}`,
      type: 0,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["ViewChannel"],
        },
        {
          id: userId,
          allow: ["ViewChannel"],
        },
      ],
    });

    await channel.send(`Bem-vindo à loja, ${member}!`);

    this.startInactivityTimer(channel);

    return `Canal criado: ${channel.toString()}`;
  }

  private startInactivityTimer(channel: TextChannel): void {
    const inactivityTimeLimit = 60000;
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await channel.send(
            "Nenhuma interação detectada em 1 minuto. Este canal será excluído."
          );
          await channel.delete();
        } catch (error) {
          console.error(`Erro ao excluir o canal: ${error.message}`);
        }
      }, inactivityTimeLimit);
    };

    channel.client.on("messageCreate", (message) => {
      if (message.channel.id === channel.id && !message.author.bot) {
        resetTimer();
      }
    });

    resetTimer();
  }
}
