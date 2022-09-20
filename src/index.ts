import config from "./config.json";
import { Client } from "./types/Client";
import { MongoClient } from "mongodb";
import { DBLogger } from "./lib/logDB";
import { ActivityType } from "discord.js";

const client = new Client();

const mongoClient = new MongoClient(config.mongo);
client.db = new DBLogger(client, mongoClient);

// Connection updates
client.once("ready", () => {
  if (client.user) {
    client.user.setActivity("Basti Songs", { type: ActivityType.Playing });
    console.log("Ready!");
  } else {
    console.log("quantum physics bug, literally impossible, not my fault");
  }
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});

// Command handling
client.on("messageCreate", async (message) => {
  // no prefix, wrong channel, own message
  if (
    message.author.bot ||
    !config.channels.includes(message.channel.id) ||
    !message.content.startsWith(config.prefix)
  )
    return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase() as string;

  // not a command
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  // command execution
  try {
    if (command) command.execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(config.token);
