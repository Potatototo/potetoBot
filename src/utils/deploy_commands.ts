import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

const { clientID, token } = require("../config.json");
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandPath = "../commands/";
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync(
    process.argv[0].includes("ts-node") ? "src/commands" : "dist/commands"
  )
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`${commandPath}${file}`);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    // DELETE ALL COMMANDS
    // rest.put(Routes.applicationCommands(clientID), { body: [] })
    // .then(() => console.log('Successfully deleted all application commands.'))
    // .catch(console.error);

    console.log(
      `Started refreshing ${commands.length} application slash commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientID), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application slash commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
