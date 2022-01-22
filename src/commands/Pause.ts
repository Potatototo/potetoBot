import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

export default class PauseCommand extends Command {
  name = "pause";
  alias: string[] = ["t"];
  usage: string | null = null;
  description = "Pauses or resumes the currently playing song.";
  category: CommandCategory = CommandCategory.MUSIC;

  execute(message: Message<boolean>): Promise<Message<boolean>> {
    if (!message.member?.voice.channel) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You have to be in a voice channel to pause this song!"
      );
    }
    if (!this.client.subscription) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "There's nothing to pause!"
      );
    }
    const player: AudioPlayer = this.client.subscription?.player as AudioPlayer;
    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      return this.sendEmbed(
        message.channel,
        "Unpausing",
        this.client.currentSong?.title as string
      );
    } else if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      return this.sendEmbed(
        message.channel,
        "Pausing",
        this.client.currentSong?.title as string
      );
    } else if (player.state.status === AudioPlayerStatus.Idle) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "There's nothing to pause!"
      );
    }
    return this.sendEmbed(
      message.channel,
      "Error",
      "There's nothing to pause!"
    );
  }
}
