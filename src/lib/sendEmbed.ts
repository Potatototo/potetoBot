import { CommandInteraction, EmbedBuilder } from "discord.js";
import { EmbedConst } from "../types/EmbedConst";

export async function sendEmbed(
  interaction: CommandInteraction,
  title: string,
  fields: string | string[]
) {
  const e = new EmbedBuilder()
    .setAuthor(EmbedConst.author)
    .setColor(EmbedConst.color);
  if (typeof fields === "string") {
    e.addFields({
      name: title,
      value: fields,
      inline: false,
    });
  } else {
    for (let i = 0; i < fields.length; i++) {
      const f = {
        name: "",
        value: fields[i],
        inline: false,
      };
      f["name"] = i === 0 ? title : "\u200b";
      e.addFields(f);
    }
  }
  // return interaction.channel!.send({ embeds: [e] });
  return interaction.reply({ embeds: [e] });
}
