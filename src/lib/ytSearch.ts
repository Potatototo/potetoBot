import fetch from "node-fetch";
import config from "../config.json";
import ytdl, { MoreVideoDetails, videoInfo } from "ytdl-core";
import { YTRes, YTVideo } from "../types/IYtApi";

export async function search(keyword: string): Promise<MoreVideoDetails[]> {
  if (keyword.includes("list=")) return playlistSearch(keyword);
  if (keyword.includes("v=")) return linkSearch(keyword);
  return keywordSearch(keyword);
}

async function linkSearch(keyword: string): Promise<[MoreVideoDetails]> {
  const songInfo = (await ytdl.getInfo(keyword)).videoDetails;
  return [songInfo];
}

async function keywordSearch(keyword: string): Promise<MoreVideoDetails[]> {
  const search: YTRes = (await fetch(
    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&key=${config.yt}`
  ).then((response) => response.json())) as YTRes;
  for (let i = 0; i < search.items.length; i++) {
    if (search.items[i].kind === "youtube#video") {
      const songInfo = (await ytdl.getInfo(search.items[i].id.videoId))
        .videoDetails;
      return [songInfo];
    }
  }
  const songInfo = (await ytdl.getInfo(search.items[0].id.videoId))
    .videoDetails;
  return [songInfo];
}

async function playlistSearch(keyword: string): Promise<MoreVideoDetails[]> {
  let playlistId = "";
  for (const s of keyword.split(/[&?]/)) {
    if (s.includes("list=")) playlistId = s.substring(5);
  }
  let search: YTRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${config.yt}`
  ).then((response) => response.json());

  let videoIds: YTVideo[] = search.items;
  let count = videoIds.length;

  while (count < search.pageInfo.totalResults) {
    search = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&pageToken=${search.nextPageToken}&key=${config.yt}`
    ).then((response) => response.json());
    videoIds = videoIds.concat(search.items);
    count += search.items.length;
  }

  const songInfos: MoreVideoDetails[] = [];
  const promises: Promise<videoInfo>[] = [];
  for (const v of videoIds) {
    try {
      promises.push(ytdl.getInfo(v.snippet.resourceId.videoId));
    } catch {}
  }
  await Promise.allSettled(promises).then((results) => {
    for (const res of results) {
      if (res.status === "fulfilled") {
        songInfos.push(res.value.videoDetails);
      }
    }
  });
  return songInfos;
}
