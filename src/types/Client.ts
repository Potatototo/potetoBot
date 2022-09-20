import {
  Collection,
  Client as DiscordClient,
  GatewayIntentBits,
} from "discord.js";
import { Command } from "./Command";
import { MoreVideoDetails } from "ytdl-core";
import { readdirSync } from "fs";
import { PlayerSubscription } from "@discordjs/voice";
import { DBLogger } from "../lib/logDB";

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  subscription: PlayerSubscription | null;
  db: DBLogger | null;
  songs: MoreVideoDetails[];
  currentSong: MoreVideoDetails | null;

  public constructor() {
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const commandFile = require(`../commands/${file}`).default;
      const command: Command = new commandFile(this);
      this.commands.set(command.name, command);
      console.log(`Loading command ${command.name}`);
      for (const a of command.alias) {
        this.commands.set(a, command);
        console.log(`Loading command alias ${a}`);
      }
    }
  }
}
