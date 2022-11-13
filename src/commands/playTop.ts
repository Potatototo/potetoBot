import {
  CommandInteraction,
  SlashCommandBuilder,
  VoiceBasedChannel,
} from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { search } from "../lib/ytSearch";
import { Client } from "../types/Client";
import { Logger } from "../utils/Logger";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playtop")
    .setDescription("Put given song at beginning of queue")
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
      return sendEmbed(
        interaction,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    const song = interaction.options.getString("song");
    if (client.songs.length === 0) {
      return sendEmbed(interaction, "Error", "There's nothing in the queue!");
    }
    try {
      // get song info
      const songInfos = await search(song);
      if (songInfos.length === 0) {
        return sendEmbed(interaction, "Error", "Couldn't find that song");
      }

      client.songs = songInfos.concat(client.songs);
      // client.db?.logPlaylist(songInfos, interaction.author.username);

      return sendEmbed(interaction, "Added to Queue", songInfos[0].title);
    } catch (err) {
      Logger.error(err);
      return sendEmbed(
        interaction,
        "Error",
        `Oh no something went wrong :(\n${err}`
      );
    }
  },
};
