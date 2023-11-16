import {
  Collection,
  Client as DiscordClient,
  GatewayIntentBits,
} from "discord.js";
import { Command } from "./Command";
import { MoreVideoDetails } from "@distube/ytdl-core";
import { readdirSync } from "fs";
import { PlayerSubscription } from "@discordjs/voice";
import { DBLogger } from "../lib/logDB";
import { Logger, LogLevel } from "../utils/Logger";

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  subscription: PlayerSubscription | null;
  db: DBLogger | null;
  songs: MoreVideoDetails[];
  currentSong: MoreVideoDetails | null;

  private static instance: Client;
  public static getInstance(): Client {
    if (!Client.instance) {
      Client.instance = new Client();
    }
    return Client.instance;
  }

  private constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
    this.commands = new Collection();
    this.subscription = null;
    this.db = null;
    this.songs = [];
    this.currentSong = null;

    this.loadCommands();
  }

  private loadCommands() {
    const dev: boolean = process.argv[0].includes("ts-node");
    const commandPath: string = dev ? "src/commands" : "dist/commands";

    const commandFiles: string[] = readdirSync(commandPath).filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of commandFiles) {
      const filePath = `../commands/${file}`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        this.commands.set(command.data.name, command);
        Logger.info(`Loading command ${command.data.name}`);
        // for (const a of command.alias) {
        //   this.commands.set(a, command);
        //   Logger.log(LogLevel.INFO, "");
        //   console.log(`Loading command alias ${a}`);
        // }
      } else {
        Logger.log(
          LogLevel.WARN,
          `The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}
