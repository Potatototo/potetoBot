import config from "../../config.json";
import { Message } from "discord.js";
import Genius from "genius-lyrics";
import { Command } from "../../types/Command";
import { CommandCategory } from "../../types/CommandCategory";

const Client = new Genius.Client(config.genius);

export default class LyricsCommand extends Command {
  name = "lyrics";
  alias: string[] = [];
  usage: string | null = null;
  description = "Print the lyrics of current song!";
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
      if (this.client.currentSong) {
        const searchQuery = this.client.currentSong.title.replace(
          /\(.*\)/ || /\[.*\]/,
          ""
        );
        console.log(`Searching lyrics for ${searchQuery}`);
        const searches = await Client.songs.search(searchQuery);
        const topResult = searches[0];
        const lyrics = await topResult.lyrics();

        const fields: string[] = [];
        fields.push(lyrics.substring(0, 1024));
        if (lyrics.length > 1024) fields.push(lyrics.substring(1024, 2048));
        if (lyrics.length > 2048) fields.push(lyrics.substring(2048, 3072));
        fields.push(":)");
        return this.sendEmbed(
          message.channel,
          `${topResult.title} - ${topResult.artist.name}`,
          fields
        );
      } else {
        return this.sendEmbed(
          message.channel,
          "Lyrics",
          "Nothing is playing at the moment."
        );
      }
    } catch (err) {
      console.error(err);
      return this.sendEmbed(
        message.channel,
        "Error",
        "Couldn't find any lyrics."
      );
    }
  }
}
