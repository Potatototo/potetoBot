import { AudioPlayerPlayingState } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";
import { fancyTimeFormat } from "../utils/TimeFormat";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Current playing song"),
  async execute(interaction: CommandInteraction) {
    const client = Client.getInstance();
    if (client.currentSong) {
      const songTitle = client.currentSong.title;
      const songLength: number = parseInt(client.currentSong.lengthSeconds);
      const pbDuration: number = ~~(
        (client.subscription?.player.state as AudioPlayerPlayingState)
          .playbackDuration / 1000
      );
      const durationString: string = generateDurationDisplay(
        songLength,
        pbDuration
      );
      sendEmbed(
        interaction,
        "Currently playing",
        `${songTitle}\n${durationString}`
      );
    } else {
      sendEmbed(interaction, "Currently playing", "Nothing!");
    }
  },
};
function generateDurationDisplay(songLength: number, pbDuration: number) {
  const barCount = 25;
  const durationString = `${fancyTimeFormat(pbDuration)}\/${fancyTimeFormat(
    songLength
  )}`;
  const filled: number = ~~((pbDuration / songLength) * barCount);
  let bars = "";
  for (let i = 0; i < barCount; i++) {
    bars += i < filled ? "█" : "░";
  }
  return `${bars} ${durationString}`;
}
