import config from "../config.json";
import { MongoClient, ReplaceOptions, UpdateResult } from "mongodb";
import { MoreVideoDetails } from "@distube/ytdl-core";
import { Client } from "../types/Client";
import { LogType } from "../types/LogType";

export class DBLogger {
  mongoClient: MongoClient;
  client: Client;

  public constructor(client: Client, mongo: MongoClient) {
    this.client = client;
    this.mongoClient = mongo;
  }

  public async log(
    songInfo: MoreVideoDetails,
    username: string,
    logType: LogType
  ): Promise<boolean> {
    if (!config.prod) return false;
    try {
      // log play in DB
      await this.mongoClient?.connect();
      const collection = this.mongoClient?.db("potetobot").collection("stats");

      // get existing DB entry
      const query = {
        title: songInfo.title,
        artist: songInfo.ownerChannelName,
      };
      const findResult = collection ? await collection.findOne(query) : null;

      const userPlayCount = findResult === null ? {} : findResult.userPlayCount;
      if (logType === LogType.PLAY) {
        if (userPlayCount === null || Object.keys(userPlayCount).length === 0) {
          userPlayCount[username] = 1;
        } else {
          userPlayCount[username] =
            username in userPlayCount ? userPlayCount[username] + 1 : 1;
        }
      }

      // update with new play count
      const dbSong = {
        title: songInfo.title,
        artist: songInfo.ownerChannelName,
        playCount:
          findResult === null
            ? 1
            : logType === LogType.PLAY
            ? findResult.playCount + 1
            : findResult.playCount,
        skipCount:
          findResult === null
            ? 0
            : logType === LogType.SKIP
            ? findResult.skipCount + 1
            : findResult.skipCount,
        userPlayCount: userPlayCount,
        songLength: parseInt(songInfo.lengthSeconds),
      };
      const options: ReplaceOptions = { upsert: true };

      const result: UpdateResult = (await collection?.replaceOne(
        query,
        dbSong,
        options
      )) as UpdateResult;
      return result?.acknowledged as boolean;
    } finally {
      this.mongoClient?.close();
    }
  }

  public async logPlaylist(songInfos: MoreVideoDetails[], username: string) {
    if (!config.prod) return false;
    await this.mongoClient?.connect();
    const collection = this.mongoClient?.db("potetobot").collection("stats");

    const promises: Promise<UpdateResult>[] = [];
    for (const songInfo of songInfos) {
      const query = {
        title: songInfo.title,
        artist: songInfo.ownerChannelName,
      };
      const findResult = collection ? await collection.findOne(query) : null;

      const userPlayCount = findResult === null ? {} : findResult.userPlayCount;
      if (userPlayCount === null || Object.keys(userPlayCount).length === 0) {
        userPlayCount[username] = 1;
      } else {
        userPlayCount[username] =
          username in userPlayCount ? userPlayCount[username] + 1 : 1;
      }

      // update with new play count
      const dbSong = {
        title: songInfo.title,
        artist: songInfo.ownerChannelName,
        playCount: findResult === null ? 1 : findResult.playCount + 1,
        skipCount: findResult === null ? 0 : findResult.skipCount,
        userPlayCount: userPlayCount,
        songLength: parseInt(songInfo.lengthSeconds),
      };
      const options: ReplaceOptions = { upsert: true };

      promises.push(
        collection?.replaceOne(query, dbSong, options) as Promise<UpdateResult>
      );
    }
    Promise.allSettled(promises).then(() => {
      this.mongoClient?.close();
    });
  }
}
