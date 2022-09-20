import { Message, EmbedBuilder, TextBasedChannel } from "discord.js";
import { Client } from "./Client";
import { CommandCategory } from "./CommandCategory";
import { EmbedConst } from "./EmbedConst";

export abstract class Command {
  client: Client;
  abstract name: string;
  abstract alias: string[];
  abstract usage: string | null;
  abstract description: string;
  abstract category: CommandCategory;

  abstract execute(message: Message, args?: string[]): Promise<Message>;

  public constructor(client: Client) {
    this.client = client;
  }

  sendEmbed(
    channel: TextBasedChannel,
    title: string,
    fields: string | string[]
  ) {
    const e = new EmbedBuilder()
      .setAuthor(EmbedConst.author)
      .setColor(EmbedConst.color);
    if (typeof fields === "string") {
      e.addFields({
        name: title,
        value: fields,
        inline: false,
      });
    } else {
      // for (let i = 0; i < fields.length - 1; i++) {
      for (let i = 0; i < fields.length; i++) {
        const f = {
          name: "",
          value: fields[i],
          inline: false,
        };
        f["name"] = i === 0 ? title : "\u200b";
        e.addFields(f);
      }
      // eo["footer"] = {
      //   text: fields[fields.length - 1],
      // };
    }
    return channel.send({ embeds: [e] });
  }
}
