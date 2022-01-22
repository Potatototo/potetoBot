import { Command } from "../types/Command";

import { Message } from "discord.js";
import { CommandCategory } from "../types/CommandCategory";
import { LogType } from "../types/LogType";

export default class SkipCommand extends Command {
  name = "skip";
  alias: string[] = ["s"];
  description = "Skip the current song.";
  usage: string | null = null;
  category: CommandCategory = CommandCategory.MUSIC;

  execute(message: Message<boolean>): Promise<Message<boolean>> {
    if (!message.member?.voice.channel) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You have to be in a voice channel to skip this song!"
      );
    }
    try {
      if (this.client.currentSong) {
        this.client.db?.log(this.client.currentSong, "", LogType.SKIP);
        this.client.subscription?.player.stop();
        return this.sendEmbed(
          message.channel,
          "Skip",
          this.client.currentSong.title
        );
      } else {
        return this.sendEmbed(
          message.channel,
          "Error",
          "There's nothing to skip!"
        );
      }
    } catch (err) {
      console.error(err);
      return this.sendEmbed(message.channel, "Error", err as string);
    }
  }
}
