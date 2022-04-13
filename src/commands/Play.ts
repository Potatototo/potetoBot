import { Message, VoiceBasedChannel } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import { connectDiscord } from "../lib/joinChannel";
import { searchAndPlay } from "../lib/ytSearch";

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
      return searchAndPlay(this, message.channel, args.join(" "));
      // return this.sendEmbed(message.channel, "Playing", "Playing songs now.");
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
