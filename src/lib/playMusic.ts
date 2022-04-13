import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  PlayerSubscription,
  VoiceConnection,
} from "@discordjs/voice";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import { Client } from "../types/Client";

export function playOrQueue(client: Client, song: MoreVideoDetails) {
  if (client.currentSong) {
    client.songs.push(song);
  } else {
    client.currentSong = song;
    play(client, song.video_url);
    client.user?.setActivity(client.currentSong.title, {
      type: "PLAYING",
    });
  }
}

function play(client: Client, song: string) {
  const resource = createAudioResource(
    ytdl(song, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    })
  );
  client.subscription?.player.play(resource);
}

export function createPlayerSubscription(
  client: Client,
  connection: VoiceConnection
): PlayerSubscription | undefined {
  const player: AudioPlayer = createAudioPlayer();
  player.on(AudioPlayerStatus.Idle, () => {
    console.log(`Finished: ${client.currentSong?.title}`);
    if (client.songs.length > 0) {
      const nextSong = client.songs.shift() as MoreVideoDetails;
      client.currentSong = nextSong;
      client.user?.setActivity(nextSong.title, {
        type: "PLAYING",
      });
      play(client, nextSong.video_url);
    } else {
      client.currentSong = null;
      client.user?.setActivity("you", { type: "WATCHING" });
    }
  });
  player.on("error", (error) => {
    console.log("Audio player error: ", error.message);
  });
  return connection.subscribe(player);
}
