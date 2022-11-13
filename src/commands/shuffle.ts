import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the queue"),
  async execute(interaction: CommandInteraction) {
    const client = Client.getInstance();
    client.songs = shuffle(this.client.songs);
    return sendEmbed(interaction, "Queue", "Shuffle!");
  },
};

function shuffle(array: MoreVideoDetails[]): MoreVideoDetails[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
