import { SlashCommandBuilder } from "discord.js";
import { connectDiscord } from "../lib/joinChannel";
import { sendEmbed } from "../lib/sendEmbed";
import { searchAndPlay } from "../lib/ytSearch";
import { Logger } from "../utils/Logger";
import { Client } from "../types/Client";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("p")
    .setDescription("Play a song, just shorter")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Song title, link or playlist")
        .setRequired(true)
    ),
  async execute(interaction) {
    const client = Client.getInstance();
    const vc = interaction.member.voice.channel;
    if (!vc) {
      sendEmbed(
        interaction,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    const song = interaction.options.getString("song");
    try {
      // connect
      if (!client.subscription) {
        await connectDiscord(client, vc);
      }
      // get song info
      searchAndPlay(interaction, song);
    } catch (err) {
      Logger.error(err);
      sendEmbed(interaction, "Error", `Oh no something went wrong :(\n${err}`);
    }
  },
};
