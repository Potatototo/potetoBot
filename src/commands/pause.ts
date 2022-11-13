import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses or resumes the current playing song"),
  async execute(interaction: CommandInteraction) {
    const client = Client.getInstance();
    if (!client.subscription) {
      return sendEmbed(interaction, "Error", "There's nothing to pause!");
    }
    const player: AudioPlayer = client.subscription?.player as AudioPlayer;
    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      return sendEmbed(
        interaction,
        "Unpausing",
        client.currentSong?.title as string
      );
    } else if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      return sendEmbed(
        interaction,
        "Pausing",
        client.currentSong?.title as string
      );
    } else if (player.state.status === AudioPlayerStatus.Idle) {
      return sendEmbed(interaction, "Error", "There's nothing to pause!");
    }
    return sendEmbed(interaction, "Error", "There's nothing to pause!");
  },
};
