import { ActivityType, Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";

const leaveMessages: string[] = [
  "Tschö mit Ö!",
  "Tschau Kakao!",
  "Cya later alligator!",
  "Bye",
  "Okay bye...",
  ":(",
  "Fuck you all anyways",
  "Laters",
  "Peace",
  "Peace Out",
  "I'm out",
  "Bin raus für heute Leute",
];

export default class LeaveCommand extends Command {
  name = "leave";
  alias: string[] = ["l"];
  description = "Leave your voice channel.";
  usage: string | null = null;
  category: CommandCategory = CommandCategory.UTILITY;

  async execute(message: Message): Promise<Message> {
    try {
      this.client.user?.setActivity("Basti Songs", {
        type: ActivityType.Playing,
      });
      if (this.client.subscription) {
        for (const vc of this.client.subscription.player.playable) {
          vc.destroy();
        }
      }
      this.client.subscription = null;
      this.client.songs = [];
      this.client.currentSong = null;

      const leaveMessage =
        leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
      return this.sendEmbed(message.channel, "Leave", leaveMessage);
    } catch (err) {
      console.log(err);
      return this.sendEmbed(message.channel, "Error", err as string);
    }
  }
}
