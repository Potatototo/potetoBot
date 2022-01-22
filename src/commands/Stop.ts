import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class StopCommand extends Command {
  name = "stop";
  alias: string[] = [];
  description = "Stop playing.";
  usage: string | null = null;
  category: CommandCategory = CommandCategory.MUSIC;

  execute(message: Message<boolean>): Promise<Message<boolean>> {
    if (!message.member?.voice.channel) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You have to be in a voice channel to stop the music!"
      );
    }
    try {
      this.client.songs = [];
      this.client.subscription?.player.stop();
      return this.sendEmbed(message.channel, "Stop", "Okay :(");
    } catch (err) {
      console.error(err);
      return this.sendEmbed(message.channel, "Error", err as string);
    }
  }
}
