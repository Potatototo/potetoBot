import config from "./config.json";
import { Client } from "./types/Client";
import { MongoClient } from "mongodb";
import { DBLogger } from "./lib/logDB";
import { ActivityType, Events } from "discord.js";
import { Logger } from "./utils/Logger";

const client = Client.getInstance();

const mongoClient = new MongoClient(config.mongo);
client.db = new DBLogger(client, mongoClient);

// Connection updates
client.once("ready", () => {
  if (client.user) {
    client.user.setActivity("Basti Songs", { type: ActivityType.Playing });
    Logger.info(`${client.user.tag} has logged in!`);
  } else {
    Logger.error("quantum physics bug, literally impossible, not my fault");
  }
});
client.once("reconnecting", () => {
  Logger.warning("Reconnecting");
});
client.once("disconnect", () => {
  Logger.error("Disconnected");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    Logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(config.token);
