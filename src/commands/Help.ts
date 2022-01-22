import { readdirSync } from "fs";
import {
  ColorResolvable,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
} from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import config from "../config.json";

export default class HelpCommand extends Command {
  name = "help";
  alias: string[] = ["h"];
  usage: string | null = null;
  description = "List all available commands.";
  category: CommandCategory = CommandCategory.UTILITY;

  execute(message: Message<boolean>): Promise<Message<boolean>> {
    let m = "";
    let q = "";
    let u = "";

    const dev: boolean = process.argv[0].includes("ts-node");
    const commandPath: string = dev ? "src/commands" : "dist/commands";
    const commandFiles: string[] = readdirSync(commandPath).filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const commandFile = require(`../commands/${file}`).default;
      const command: Command = new commandFile(this);
      let line = "";
      line += `${config.prefix}${command.name}`;
      if (command.alias.length > 0) {
        line += ` | ${config.prefix}${command.alias}`;
      }

      if (command.usage) {
        line += ` ${command.usage}`;
      }
      line += ` - ${command.description}`;

      if (command.category === CommandCategory.MUSIC) m += line + "\n";
      else if (command.category === CommandCategory.QUEUE) q += line + "\n";
      else if (command.category === CommandCategory.UTILITY) u += line + "\n";
    }

    const eo: MessageEmbedOptions = {
      author: {
        name: "potetoBot",
        iconURL: "https://i.imgur.com/8HzsYp9.png",
      },
      color: "#E6722E" as ColorResolvable,
      fields: [
        {
          name: "Music",
          value: m,
          inline: false,
        },
        {
          name: "Queue",
          value: q,
          inline: false,
        },
        {
          name: "Utility",
          value: u,
          inline: false,
        },
      ],
    };
    return message.channel.send({ embeds: [new MessageEmbed(eo)] });
  }
}
