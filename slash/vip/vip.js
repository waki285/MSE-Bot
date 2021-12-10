const { CommandInteraction, CommandInteractionOptionResolver, Client } = require("discord.js");
const { exec:execCallback } = require("child_process");

/**
 * 
 * @param {string} command
 * @returns {Promise<string>}
 */
const exec = async (command) => {
  return new Promise((resolve, reject) => {
    execCallback(command, (err, stdout, stderr) => {
      if (err) reject(err);
      resolve(stderr + stdout);
    })
  })
};

module.exports = {
  name: "vip",
  description: "名前を設定します。設定しないと「以下、名無しに変わりましてVIPPERがお送りします」になります。",
  category: "VIP",
  /**
   * 
   * @param {CommandInteraction} i
   * @param {Client} client
   * @param {CommandInteractionOptionResolver} options
   */
  async execute(i, client, options) {
    /**
     * 
     * @type {("trip" | "nickname")}
     */
    const sub = options.getSubcommand();
    if (sub === "trip") {
      let trip = options.getString("key");
      trip = trip.slice(0, 10);
      const salt = trip.slice(1, 3);
      let kansei = await exec(`perl -e 'print crypt "${trip}", "${salt}"'`);
      kansei = kansei.slice(3, Infinity);
      const data = await client.dbs.get("users", { id: i.user.id });
      data.id = i.user.id;
      data.trip = kansei;
      await data.save();
      i.reply({ embeds: [{
        title: "🆔Trip",
        description: `✅トリップを設定しました。\nあなたのトリップは\`${kansei}\`です。\n**トリップの生成に使った鍵を共有しないでください！**`,
        color: 0x04ff00
      }], ephemeral: true });
    }
  }
}