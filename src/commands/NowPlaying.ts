import { AudioPlayerPlayingState } from "@discordjs/voice";
import { Message } from "discord.js";
import { fancyTimeFormat } from "../lib/timeFormat";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class NowPlayingCommand extends Command {
  name = "nowplaying";
  alias: string[] = ["np"];
  usage: string | null = null;
  description = "Currently playing song";
  category: CommandCategory = CommandCategory.QUEUE;

  execute(message: Message<boolean>): Promise<Message<boolean>> {
    const vc = message.member?.voice.channel;
    if (!vc) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    if (this.client.currentSong) {
      const songTitle = this.client.currentSong.title;
      const songLength: number = parseInt(
        this.client.currentSong.lengthSeconds
      );
      const pbDuration: number = ~~(
        (this.client.subscription?.player.state as AudioPlayerPlayingState)
          .playbackDuration / 1000
      );
      const durationString: string = this.generateDurationDisplay(
        songLength,
        pbDuration
      );
      return this.sendEmbed(
        message.channel,
        "Currently playing",
        `${songTitle}\n${durationString}`
      );
    } else {
      return this.sendEmbed(message.channel, "Currently playing", "Nothing!");
    }
  }

  private generateDurationDisplay(songLength: number, pbDuration: number) {
    const barCount = 25;
    const durationString = `${fancyTimeFormat(pbDuration)}\/${fancyTimeFormat(
      songLength
    )}`;
    const filled: number = ~~((pbDuration / songLength) * barCount);
    let bars = "";
    for (let i = 0; i < barCount; i++) {
      bars += i < filled ? "█" : "░";
    }
    return `${bars} ${durationString}`;
  }
}
