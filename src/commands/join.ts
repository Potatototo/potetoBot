import { SlashCommandBuilder } from "discord.js";
import { connectDiscord } from "../lib/joinChannel";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join your current channel"),
  async execute(interaction) {
    const vc = interaction.member.voice.channel;
    if (!vc) {
      sendEmbed(
        interaction,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    try {
      connectDiscord(Client.getInstance(), vc);
      sendEmbed(interaction, "Joining", vc.toString());
    } catch (err) {
      console.log(err);
      sendEmbed(interaction, "Error", err as string);
    }
  },
};
