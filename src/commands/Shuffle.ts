import { Message } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

function shuffle(array: MoreVideoDetails[]): MoreVideoDetails[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export default class LeaveCommand extends Command {
  name = "shuffle";
  alias: string[] = [];
  description = "Shuffle the queue.";
  usage: string | null = null;
  category: CommandCategory = CommandCategory.QUEUE;

  async execute(message: Message): Promise<Message> {
    this.client.songs = shuffle(this.client.songs);
    return this.sendEmbed(message.channel, "Queue", "Shuffle!");
  }
}
