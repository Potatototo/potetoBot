import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class PingCommand extends Command {
  name = "ping";
  alias: string[] = ["oing"];
  description = "Pong!";
  usage: string | null = null;
  category = CommandCategory.UTILITY;

  execute(message: Message) {
    const ping = Date.now() - message.createdTimestamp;
    return message.channel.send(`Pong! The ping is **${ping}ms**`);
  }
}
