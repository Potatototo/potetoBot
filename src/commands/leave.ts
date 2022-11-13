import { ActivityType, SlashCommandBuilder } from "discord.js";
import { sendEmbed } from "../lib/sendEmbed";
import { Client } from "../types/Client";

const leaveMessages: string[] = [
  "Tschö mit Ö!",
  "Tschau Kakao!",
  "Cya later alligator!",
  "Bye",
  "Okay bye...",
  ":(",
  "Laters",
  "Peace",
  "Peace Out",
  "I'm out",
  "Bin raus für heute Leute",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave your voice channel."),
  async execute(interaction) {
    const client = Client.getInstance();
    try {
      client.user?.setActivity("Basti Songs", {
        type: ActivityType.Playing,
      });
      if (client.subscription) {
        for (const vc of client.subscription.player.playable) {
          vc.destroy();
        }
      }
      client.subscription = null;
      client.songs = [];
      client.currentSong = null;

      const leaveMessage =
        leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
      sendEmbed(interaction, "Leave", leaveMessage);
    } catch (err) {
      console.log(err);
      sendEmbed(interaction, "Error", err as string);
    }
  },
};
