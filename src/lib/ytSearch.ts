import fetch from "node-fetch";
import config from "../config.json";
import ytdl from "ytdl-core";
import { YTRes } from "../types/IYtApi";
import { playOrQueue } from "./playMusic";
import { Command } from "../types/Command";
import { Message, TextBasedChannel } from "discord.js";

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
  command: Command,
  channel: TextBasedChannel,
  keyword: string
): Promise<Message> {
  if (keyword.includes("list="))
    return playlistSearch(command, channel, keyword);
  if (keyword.includes("v=")) return linkSearch(command, channel, keyword);
  return keywordSearch(command, channel, keyword);
}

async function linkSearch(
  command: Command,
  channel: TextBasedChannel,
  keyword: string
): Promise<Message<boolean>> {
  return ytdl
    .getInfo(keyword)
    .then((songInfo) => {
      const embedTitle = command.client.currentSong
        ? "Added to Queue"
        : "Now Playing";
      playOrQueue(command.client, songInfo.videoDetails);
      return command.sendEmbed(
        channel,
        embedTitle,
        songInfo.videoDetails.title
      );
    })
    .catch(() => {
      return command.sendEmbed(
        channel,
        "Error",
        "Song unavailable (Age Restriction)"
      );
    });

  return command.sendEmbed(channel, "Keyword Search", "Searching...");
}

async function keywordSearch(
  command: Command,
  channel: TextBasedChannel,
  keyword: string
): Promise<Message<boolean>> {
  const search: YTRes = (await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&key=${config.yt}`
  ).then((response) => response.json())) as YTRes;
  for (let i = 0; i < search.items.length; i++) {
    if (search.items[i].id.kind === "youtube#video") {
      return ytdl
        .getInfo(search.items[i].id.videoId)
        .then((songInfo) => {
          const embedTitle = command.client.currentSong
            ? "Added to Queue"
            : "Now Playing";
          playOrQueue(command.client, songInfo.videoDetails);
          return command.sendEmbed(
            channel,
            embedTitle,
            songInfo.videoDetails.title
          );
        })
        .catch(() => {
          return command.sendEmbed(
            channel,
            "Error",
            "Song unavailable (Age Restriction)"
          );
        });
    }
  }
  return command.sendEmbed(channel, "Keyword Search", "Searching...");
}

async function playlistSearch(
  command: Command,
  channel: TextBasedChannel,
  keyword: string
) {
  let playlistId = "";
  for (const s of keyword.split(/[&?]/)) {
    if (s.includes("list=")) playlistId = s.substring(5);
  }
  recPlaylistInfo(command, playlistId, "", 50);
  const search = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${config.yt}`
  ).then((response) => response.json());
  return command.sendEmbed(
    channel,
    "Now Playing",
    `${search.pageInfo.totalResults} songs`
  );
}

async function recPlaylistInfo(
  command: Command,
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
        recPlaylistInfo(
          command,
          playlistId,
          search.nextPageToken,
          processedCount + 50
        );
      }
      for (const v of search.items) {
        ytdl
          .getInfo(v.snippet.resourceId.videoId)
          .then((res) => {
            playOrQueue(command.client, res.videoDetails);
          })
          .catch(() => console.log("Unavailable video in playlist"));
      }
    });
}
