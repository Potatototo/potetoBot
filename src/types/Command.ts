import {
  ColorResolvable,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
  TextBasedChannel,
} from "discord.js";
import { Client } from "./Client";
import { CommandCategory } from "./CommandCategory";

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
    const eo: MessageEmbedOptions = {
      author: {
        name: "potetoBot",
        iconURL: "https://i.imgur.com/8HzsYp9.png",
      },
      color: "#E6722E" as ColorResolvable,
      fields: [],
    };
    if (typeof fields === "string") {
      eo.fields?.push({
        name: title,
        value: fields,
        inline: false,
      });
    } else {
      for (let i = 0; i < fields.length - 1; i++) {
        const f = {
          name: "",
          value: fields[i],
          inline: false,
        };
        f["name"] = i === 0 ? title : "\u200b";
        eo.fields?.push(f);
      }
      eo["footer"] = {
        text: fields[fields.length - 1],
      };
    }
    const e = new MessageEmbed(eo);
    return channel.send({ embeds: [e] });
  }
}
