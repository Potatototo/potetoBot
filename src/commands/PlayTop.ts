import { Message, VoiceBasedChannel } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import { search } from "../lib/ytSearch";

export default class JoinCommand extends Command {
  name = "playtop";
  alias: string[] = ["pt"];
  usage: string | null = "<title/link>";
  description = "Put given song at beginning of queue.";
  category: CommandCategory = CommandCategory.MUSIC;

  async execute(
    message: Message<boolean>,
    args?: string[]
  ): Promise<Message<boolean>> {
    const vc: VoiceBasedChannel = message.member?.voice
      .channel as VoiceBasedChannel;
    if (!vc) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    if (!args) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You need to give me a link!"
      );
    }
    if (this.client.songs.length === 0) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "There's nothing in the queue!"
      );
    }
    try {
      // get song info
      const songInfos = await search(args.join(" "));
      if (songInfos.length === 0) {
        return this.sendEmbed(
          message.channel,
          "Error",
          "Couldn't find that song"
        );
      }

      this.client.songs = songInfos.concat(this.client.songs);
      this.client.db?.logPlaylist(songInfos, message.author.username);

      return this.sendEmbed(
        message.channel,
        "Added to Queue",
        songInfos[0].title
      );
    } catch (err) {
      console.error(err);
      return this.sendEmbed(
        message.channel,
        "Error",
        `Oh no something went wrong :(\n${err}`
      );
    }
  }
}
