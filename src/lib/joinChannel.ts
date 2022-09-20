import {
  DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { ActivityType, VoiceBasedChannel } from "discord.js";
import { Client } from "../types/Client";
import { createPlayerSubscription } from "./playMusic";

export async function connectDiscord(client: Client, vc: VoiceBasedChannel) {
  console.log(`Joining ${vc.name}`);
  const connection: VoiceConnection = joinVoiceChannel({
    channelId: vc.id,
    guildId: vc.guild.id,
    selfDeaf: false,
    adapterCreator: vc.guild
      .voiceAdapterCreator as DiscordGatewayAdapterCreator,
  });
  await entersState(connection, VoiceConnectionStatus.Ready, 5000);

  const sub = createPlayerSubscription(client, connection);
  if (sub) {
    client.subscription = sub;
    console.log("Setting connection");
  }

  const intervalId = setInterval(function () {
    if (Array.from(vc.members.keys()).length <= 1) {
      connection.destroy();
      client.subscription = null;
      client.songs = [];
      client.currentSong = null;
      client.user?.setActivity("Basti Songs", { type: ActivityType.Playing });
      clearInterval(intervalId);
    }
  }, 5 * 60 * 1000);
}
