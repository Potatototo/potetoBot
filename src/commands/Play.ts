import config from "../config.json";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import { Message, VoiceBasedChannel } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import { YTRes } from "../types/IYtApi";
import { play } from "../lib/playMusic";
import fetch from "node-fetch";
import { LogType } from "../types/LogType";
import { connectDiscord } from "../lib/joinChannel";

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
      let songInfo: MoreVideoDetails;
      if (args[0].indexOf("http") === -1) {
        const keystring: string = args.join(" ");
        const search: YTRes = (await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keystring}&key=${config.yt}`
        ).then((response) => response.json())) as YTRes;
        songInfo = (await ytdl.getInfo(search.items[0].id.videoId))
          .videoDetails;
      } else {
        songInfo = (await ytdl.getInfo(args[0])).videoDetails;
      }

      // add song to queue or play
      let embedTitle: string;
      if (
        this.client.subscription?.player.state.status === AudioPlayerStatus.Idle
      ) {
        play(this.client, songInfo.video_url);
        this.client.currentSong = songInfo;
        embedTitle = "Now Playing";
        this.client.user?.setActivity(
          this.client.currentSong?.title as string,
          {
            type: "PLAYING",
          }
        );
      } else {
        this.client.songs.push(songInfo);
        embedTitle = "Added to Queue";
      }
      // log in db
      this.client.db?.log(songInfo, message.author.username, LogType.PLAY);
      console.log(`${embedTitle}: ${songInfo.title}`);
      return this.sendEmbed(message.channel, embedTitle, songInfo.title);
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
