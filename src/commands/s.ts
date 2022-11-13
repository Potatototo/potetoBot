import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";
import { Logger } from "../utils/Logger";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("s")
    .setDescription("Skip current song, just shorter"),
  async execute(interaction) {
    const client = Client.getInstance();
    const vc = interaction.member.voice.channel;
    if (!vc) {
      return sendEmbed(
        interaction,
        "Error",
        "You have to be in a voice channel to skip this song!"
      );
    }
    try {
      if (client.currentSong) {
        // client.db?.log(this.client.currentSong, "", LogType.SKIP);
        client.subscription?.player.stop();
        return sendEmbed(interaction, "Skip", client.currentSong.title);
      } else {
        return sendEmbed(interaction, "Error", "There's nothing to skip!");
      }
    } catch (err) {
      Logger.error(err);
      sendEmbed(interaction, "Error", err as string);
    }
  },
};
