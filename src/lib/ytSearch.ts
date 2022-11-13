import fetch from "node-fetch";
import config from "../config.json";
import ytdl from "ytdl-core";
import { YTRes } from "../types/IYtApi";
import { playOrQueue } from "./playMusic";
import { CommandInteraction } from "discord.js";
import { Client } from "../types/Client";
import { sendEmbed } from "./sendEmbed";

export async function search(keyword: string) {
  if (keyword.includes("https")) {
    return [(await ytdl.getInfo(keyword)).videoDetails];
  } else {
    const search: YTRes = (await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&key=${config.yt}`
    ).then((response) => response.json())) as YTRes;
    for (let i = 0; i < search.items.length; i++) {
      if (search.items[i].id.kind === "youtube#video") {
        const songInfo = (await ytdl.getInfo(search.items[i].id.videoId))
          .videoDetails;
        return [songInfo];
      }
    }
    return [];
  }
}

export async function searchAndPlay(
  interaction: CommandInteraction,
  keyword: string
) {
  if (keyword.includes("list=")) playlistSearch(interaction, keyword);
  if (keyword.includes("v=")) linkSearch(interaction, keyword);
  keywordSearch(interaction, keyword);
}

async function linkSearch(interaction: CommandInteraction, keyword: string) {
  try {
    const client = Client.getInstance();
    const videoInfo = await ytdl.getInfo(keyword);
    const embedTitle = client.currentSong ? "Added to Queue" : "Now Playing";
    playOrQueue(client, videoInfo.videoDetails);
    sendEmbed(interaction, embedTitle, videoInfo.videoDetails.title);
  } catch (error) {
    sendEmbed(interaction, "Error", "Song unavailable (Age Restriction)");
  }
}

async function keywordSearch(interaction: CommandInteraction, keyword: string) {
  const client = Client.getInstance();
  const search: YTRes = (await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&key=${config.yt}`
  ).then((response) => response.json())) as YTRes;
  for (let i = 0; i < search.items.length; i++) {
    if (search.items[i].id.kind === "youtube#video") {
      try {
        const videoInfo = await ytdl.getInfo(search.items[i].id.videoId);
        const embedTitle = client.currentSong
          ? "Added to Queue"
          : "Now Playing";
        playOrQueue(client, videoInfo.videoDetails);
        sendEmbed(interaction, embedTitle, videoInfo.videoDetails.title);
        return;
      } catch (error) {
        sendEmbed(interaction, "Error", "Song unavailable (Age Restriction)");
      }
    }
  }
  // sendEmbed(channel, "Keyword Search", "Searching...");
}

async function playlistSearch(
  interaction: CommandInteraction,
  keyword: string
) {
  const client = Client.getInstance();
  let playlistId = "";
  for (const s of keyword.split(/[&?]/)) {
    if (s.includes("list=")) playlistId = s.substring(5);
  }
  recursivePlaylistInfo(playlistId, "", 50);
  const search = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${config.yt}`
  ).then((response) => response.json());
  sendEmbed(
    interaction,
    "Now Playing",
    `${search.pageInfo.totalResults} songs`
  );
}

async function recursivePlaylistInfo(
  playlistId: string,
  pageToken: string,
  processedCount: number
) {
  const apiLink =
    pageToken === ""
      ? `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2Cstatus&maxResults=50&playlistId=${playlistId}&key=${config.yt}`
      : `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2Cstatus&maxResults=50&playlistId=${playlistId}&pageToken=${pageToken}&key=${config.yt}`;
  fetch(apiLink)
    .then((response) => response.json())
    .then((search) => {
      if (processedCount < search.pageInfo.totalResults) {
        recursivePlaylistInfo(
          playlistId,
          search.nextPageToken,
          processedCount + 50
        );
      }
      for (const v of search.items) {
        ytdl
          .getInfo(v.snippet.resourceId.videoId)
          .then((res) => {
            playOrQueue(Client.getInstance(), res.videoDetails);
          })
          .catch(() => console.log("Unavailable video in playlist"));
      }
    });
}
