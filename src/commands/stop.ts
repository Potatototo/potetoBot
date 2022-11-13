import { SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";
import { Logger } from "../utils/Logger";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return sendEmbed(
        interaction,
        "Error",
        "You have to be in a voice channel to stop the music!"
      );
    }
    try {
      const client = Client.getInstance();
      client.songs = [];
      client.subscription?.player.stop();
      return sendEmbed(interaction, "Stop", "Okay :(");
    } catch (err) {
      Logger.error(err);
      return sendEmbed(interaction, "Error", err as string);
    }
  },
};
