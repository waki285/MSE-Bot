const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://suzuneu:${process.env.MONGO}@msebot.tihqh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
);

const client = new Client({
  intents: Object.values(Intents.FLAGS),
  allowedMentions: { repliedUser: false, parse: ["roles", "users"] },
  partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
  restTimeOffset: 50,
});

client.rebootFlg = 0;

require("./helpers/extends");

const config = require("./config.json");

client.commands = new Collection();
client.slash = new Collection();
client.cooldowns = new Collection();

const userSchema = new mongoose.Schema({
  id: String,
  trip: String,
  nickname: String,
});

const threadSchema = new mongoose.Schema({
  id: String,
  owner: String,
});

const uwasaSchema = new mongoose.Schema({
  uwasas: Array
})

client.dbs = {
  /**
   *
   * @param {string} dbName
   * @param {any} data
   */
  get: async function (dbName, data) {
    const d =
      (await client.dbs[dbName].findOne(data)) || new client.dbs[dbName]();
    return d;
  },
  /**
   *
   * @param {string} dbName
   * @param {any} keyData
   * @param {any} data
   */
  set: async function (dbName, keyData, data) {
    const d = await client.dbs.get(dbName, keyData);
    Object.keys(data).forEach((a, i) => (d[a] = Object.values(data)[i]));
    d.save();
  },
  users: mongoose.model("user", userSchema),
  threads: mongoose.model("thread", threadSchema),
  uwasa: mongoose.model("uwasa", uwasaSchema)
};

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

const slashCommandFolders = fs.readdirSync("./slash");

for (const folder of slashCommandFolders) {
  const commandFiles = fs
    .readdirSync(`./slash/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./slash/${folder}/${file}`);
    client.slash.set(command.name, command);
  }
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.BOT_TOKEN);

process.on("uncaughtException", (e) => {
  console.log(e);
  client.channels
    .fetch(config.errorLog)
    .then((x) =>
      x.send(`\`\`\`js\n${require("util").inspect(e).slice(0, 1800)}\n\`\`\``)
    );
});
