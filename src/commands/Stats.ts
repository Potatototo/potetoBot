import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class StatsCommand extends Command {
  name = "stats";
  alias: string[] = [];
  description = "Show stats website.";
  usage: string | null = null;
  category = CommandCategory.UTILITY;

  execute(message: Message) {
    return this.sendEmbed(
      message.channel,
      "Stats",
      "https://stoske.eu/potetobotstats"
    );
  }
}
