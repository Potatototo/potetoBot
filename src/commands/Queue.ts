import { AudioPlayerPlayingState } from "@discordjs/voice";
import { Message } from "discord.js";
import { fancyTimeFormat } from "../lib/timeFormat";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class QueueCommand extends Command {
  name = "queue";
  alias: string[] = ["q"];
  usage: string | null = "<page>";
  description = "Show current queue.";
  category: CommandCategory = CommandCategory.QUEUE;

  execute(
    message: Message<boolean>,
    args?: string[]
  ): Promise<Message<boolean>> {
    let page = 1;
    const songCount: number = this.client.songs.length;

    if (songCount === 0) {
      return this.sendEmbed(message.channel, "Queue", "Empty");
    }

    if (args) if (args.length > 0) page = parseInt(args[0]);
    if (page < 1) page = 1;
    if (page * 10 > songCount + 10) {
      return this.sendEmbed(message.channel, "Error", "Page does not exist!");
    }

    const fields: string[] = [];
    for (let i = (page - 1) * 10; i < (page - 1) * 10 + 10; i++) {
      if (i < songCount) {
        fields.push(`${i + 1}. ${this.client.songs[i].title}`);
      }
    }

    let queueDuration: number = this.client.currentSong
      ? parseInt(this.client.currentSong.lengthSeconds) -
        ~~(
          (this.client.subscription?.player.state as AudioPlayerPlayingState)
            .playbackDuration / 1000
        )
      : 0;
    for (let i = 0; i < this.client.songs.length; i++) {
      queueDuration += parseInt(this.client.songs[i].lengthSeconds);
    }

    fields.push(
      `Page ${page}/${Math.ceil(
        Math.max(1, songCount / 10)
      )} - ${fancyTimeFormat(queueDuration)}`
    );

    return this.sendEmbed(message.channel, "Queue", fields);
  }
}
