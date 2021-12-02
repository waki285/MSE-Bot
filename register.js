const { Client, ClientApplication } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const command = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("BotのPing値を計測します。");

(async () => {
  const client = new Client({ intents: 0 });
  client.token = process.env.BOT_TOKEN;
  client.application = new ClientApplication(client, {});
  await client.application.fetch();

  await client.application.commands.create(command, process.argv[2]);

  console.log("Registration Success!");
})();
