import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class RemoveCommand extends Command {
  name = "remove";
  alias: string[] = ["r"];
  usage = "<index>";
  description = "Remove song from queue.";
  category: CommandCategory = CommandCategory.QUEUE;

  execute(
    message: Message<boolean>,
    args?: string[]
  ): Promise<Message<boolean>> {
    if (!args) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "Please specify a queue position!"
      );
    }

    const pos = parseInt(args[0]);
    if (isNaN(pos) || pos < 1 || pos > this.client.songs.length) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "Invalid queue position!"
      );
    }

    const removed = this.client.songs.splice(pos - 1, 1);
    return this.sendEmbed(
      message.channel,
      "Removed from Queue",
      removed[0].title
    );
  }
}
