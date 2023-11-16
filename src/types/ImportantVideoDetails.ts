import { videoInfo } from "@distube/ytdl-core";

export class ImportantVideoDetails {
  title: string;
  author: string;
  lengthSeconds: number;
  video_url: string;

  public constructor(vi: videoInfo) {
    this.title = vi.videoDetails.title;
    this.author = vi.videoDetails.author.name;
    this.lengthSeconds = parseInt(vi.videoDetails.lengthSeconds);
    this.video_url = vi.videoDetails.video_url;
  }
}
