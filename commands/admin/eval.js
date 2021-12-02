const { Message, Client, MessageAttachment } = require("discord.js");

module.exports = {
  name: "eval",
  description: "コードを実行します。",
  adminOnly: true,
  category: "Bot管理者専用",
  aliases: ["run"],
  cooldown: 1,
  args: true,
  argList: ["コード"],
  requiredArg: [true],
  /**
   *
   * @param {Message} message
   * @param {Client} client
   * @param {string[]} args
   */
  async execute(message, client, args) {
    //各種定義
    const fs = require("fs");
    const axios = require("axios");
    const crypto = require("crypto");
    const child = require("child_process");
    const discord = require("discord.js");
    const ms = require("ms");
    const moment = require("moment-timezone");
    const util = require("util");
    const channel = message.channel;
    const guild = message.guild;
    const archiver = require("archiver");

    //実行
    /**
     *
     * @type {Promise<string>}
     */
    const result = new Promise((resolve) => resolve(eval(args.join(" "))));
    return result
      .then(async (output) => {
        if (typeof output !== "string") {
          output = require("util").inspect(output, { depth: 0 });
        }
        if (output.includes(message.client.token)) {
          output = output.replace(message.client.token, "[TOKEN]");
        }
        if (output.length > 1980) {
          message.channel.send({
            content: "実行結果が長すぎます。",
            files: [
              new MessageAttachment(Buffer.from(output, "utf8"), "result.js"),
            ],
          });
        } else {
          message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
        }
      })
      .catch(async (err) => {
        err = err.toString();
        if (err.includes(message.client.token)) {
          err = err.replace(message.client.token, "[TOKEN]");
        }
        message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
      });
  },
};