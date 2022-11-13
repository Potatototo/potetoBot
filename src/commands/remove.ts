import { SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from queue")
    .addStringOption((option) =>
      option.setName("index").setDescription("Index of song").setRequired(true)
    ),
  async execute(interaction) {
    const client = Client.getInstance();
    const pos = parseInt(interaction.options.getString("index"));
    if (isNaN(pos) || pos < 1 || pos > client.songs.length) {
      return sendEmbed(interaction, "Error", "Invalid queue position!");
    }

    const removed = client.songs.splice(pos - 1, 1);
    return sendEmbed(interaction, "Removed from Queue", removed[0].title);
  },
};
