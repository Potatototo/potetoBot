import { AudioPlayerPlayingState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";
import { fancyTimeFormat } from "../utils/TimeFormat";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("q")
    .setDescription("Show current queue, just shorter")
    .addStringOption((option) =>
      option.setName("page").setDescription("Page of queue to view")
    ),
  async execute(interaction) {
    const client = Client.getInstance();
    const pageToGet = interaction.options.getString("page") ?? 1;
    let page = parseInt(pageToGet);
    const songCount: number = client.songs.length;

    if (songCount === 0) {
      return sendEmbed(interaction, "Queue", "Empty");
    }

    if (page < 1) page = 1;
    if (page * 10 > songCount + 10) {
      return sendEmbed(interaction, "Error", "Page does not exist!");
    }

    const fields: string[] = [];
    for (let i = (page - 1) * 10; i < (page - 1) * 10 + 10; i++) {
      if (i < songCount) {
        fields.push(`${i + 1}. ${client.songs[i].title}`);
      }
    }

    let queueDuration: number = client.currentSong
      ? parseInt(client.currentSong.lengthSeconds) -
        ~~(
          (client.subscription?.player.state as AudioPlayerPlayingState)
            .playbackDuration / 1000
        )
      : 0;
    for (let i = 0; i < client.songs.length; i++) {
      queueDuration += parseInt(client.songs[i].lengthSeconds);
    }

    fields.push(
      `Page ${page}/${Math.ceil(
        Math.max(1, songCount / 10)
      )} - ${fancyTimeFormat(queueDuration)}`
    );

    return sendEmbed(interaction, "Queue", fields);
  },
};
