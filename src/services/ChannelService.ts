import { Client, TextChannel } from "discord.js";

export default class ChannelService {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async execute(): Promise<void> {
    await this.ensureTestChannelExists();
  }

  private async ensureTestChannelExists(): Promise<void> {
    const guild = this.client.guilds.cache.first();
    if (!guild) return;

    let testChannel = guild.channels.cache.find(
      (channel) => channel.name === "canal-de-teste" && channel.isTextBased()
    ) as TextChannel;

    if (!testChannel) {
      testChannel = await guild.channels.create({
        name: "canal-de-teste",
        type: 0,
      });

      console.log(`Canal de teste criado: ${testChannel.name}`);

      await testChannel.send({
        content: "Mensagem de teste com botão",
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Ir para a loja",
                style: 1,
                customId: "gotoShop",
              },
            ],
          },
        ],
      });
    }
  }
}
