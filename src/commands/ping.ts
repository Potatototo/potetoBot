import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction: CommandInteraction) {
    const ping = Date.now() - interaction.createdTimestamp;
    sendEmbed(interaction, "Ping", `Pong! The ping is **${ping}ms**`);
  },
};
