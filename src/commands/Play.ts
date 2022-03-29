import { Message, VoiceBasedChannel } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import { play } from "../lib/playMusic";
import { connectDiscord } from "../lib/joinChannel";
import { search } from "../lib/ytSearch";
import { MoreVideoDetails } from "ytdl-core";
import { LogType } from "../types/LogType";

export default class PlayCommand extends Command {
  name = "play";
  alias: string[] = ["p"];
  description = "Play given song.";
  usage: string | null = "<title/link>";
  category: CommandCategory = CommandCategory.MUSIC;

  async execute(message: Message, args?: string[]): Promise<Message> {
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
    try {
      // connect
      if (!this.client.subscription) {
        await connectDiscord(this.client, vc);
      }
      // get song info
      const songInfos = await search(args.join(" "));

      if (songInfos.length === 0) {
        return this.sendEmbed(
          message.channel,
          "Error",
          "Coulnd't find that song"
        );
      }

      if (!this.client.currentSong) {
        const song = songInfos.shift() as MoreVideoDetails;
        if (!this.client.currentSong) {
          play(this.client, song.video_url);
          this.client.currentSong = song;
          this.client.user?.setActivity(
            this.client.currentSong?.title as string,
            {
              type: "PLAYING",
            }
          );
          this.client.db?.log(song, message.author.username, LogType.PLAY);
          if (songInfos.length > 0) {
            this.sendEmbed(message.channel, "Now Playing", song.title);
          } else {
            return this.sendEmbed(message.channel, "Now Playing", song.title);
          }
        }
      }

      this.client.songs = this.client.songs.concat(songInfos);
      this.client.db?.logPlaylist(songInfos, message.author.username);

      if (songInfos.length > 0) {
        return this.sendEmbed(
          message.channel,
          "Added to Queue",
          `${songInfos.length} ${
            songInfos.length > 1 ? "songs" : "song"
          } from playlist`
        );
      }
      return this.sendEmbed(
        message.channel,
        "Error",
        "How did we even get here?"
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
