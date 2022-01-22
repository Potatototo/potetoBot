import { Message } from "discord.js";
import { Command } from "../types/Command";
import { CommandCategory } from "../types/CommandCategory";
import { connectDiscord } from "../lib/joinChannel";

export default class JoinCommand extends Command {
  name = "join";
  alias: string[] = [];
  usage: string | null = null;
  description = "Join your voice channel.";
  category: CommandCategory = CommandCategory.UTILITY;

  async execute(message: Message<boolean>): Promise<Message<boolean>> {
    const vc = message.member?.voice.channel;
    if (!vc) {
      return this.sendEmbed(
        message.channel,
        "Error",
        "You need to be in a voice channel for this!"
      );
    }
    try {
      connectDiscord(this.client, vc);
      return this.sendEmbed(message.channel, "Joining", vc.toString());
    } catch (err) {
      console.log(err);
      return this.sendEmbed(message.channel, "Error", err as string);
    }
  }
}
