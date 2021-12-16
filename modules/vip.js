const { Message, MessageEmbed, Collection } = require("discord.js");
const moment = require("moment-timezone");

module.exports = {
  name: "vip",
  /**
   *
   * @param {Message} message
   */
  async create(message) {
    const client = message.client;
    message.delete();
    const data = await client.dbs.get("users", { id: message.author.id });
    const embed = new MessageEmbed()
      .setTitle(
        `${data.nickname ?? "以下、名無しに変わりましてVIPPERがお送りします"}${
          data.trip
            ? `◆${data.trip}`
            : `◇${Buffer.from(message.author.id)
                .toString("base64")
                .slice(14, 24)}`
        }`
      )
      .setDescription(message.content)
      .setColor("RANDOM")
      .setFooter(
        moment(new Date()).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")
      );

    /**
     *
     * @type {Message}
     */
    const msg = await message.channel.send({ embeds: [embed] });

    const thread = await msg.startThread({
      autoArchiveDuration: "MAX",
      name: message.content,
    });

    const a = await client.dbs.get("threads", { id: thread.id });
    a.id = thread.id;
    a.owner = message.author.id;
    a.save();
  },
  /**
   *
   * @param {Message} message
   */
  async syori(message) {
    const client = message.client;
    await message.delete();
    /**
     *
     * @type {Collection<string, Message>}
     */
    const msgs = await message.channel.messages.fetch({ limit: 100 });
    if (msgs.first(2)[1].embeds[0].title.startsWith("101")) return message.channel.setArchived(true);
    /**
     *
     * @type {number}
     */
    const bangou = msgs.size;
    const data = await client.dbs.get("users", { id: message.author.id });
    const threadData = await client.dbs.get("threads", {
      id: message.channel.id,
    });
    let sendContent = message.content;
    if (message.reference?.messageId) {
      const msg = await message.channel.messages.fetch(
        message.reference.messageId
      );
      sendContent =
        `[>>${msg.embeds[0].title.split(":")[0]}](${msg.url})\n` + sendContent;
    }
    if (message.content.match(/>>\d{1,3}/)) {
      const msgId = message.content.match(/>>\d{1,3}/)[0].slice(2, Infinity);
      const jsg = msgs.find(
        (x) => x.embeds[0] && x.embeds[0].title.split(":")[0] === msgId
      );
      if (jsg) {
        sendContent = sendContent.replace(
          />>\d{1,3}/,
          `[>>${msgId}](${jsg.url})`
        );
      }
    }
    const embed = new MessageEmbed()
      .setTitle(
        `${bangou}: ${
          data.nickname ?? "以下、名無しに変わりましてVIPPERがお送りします"
        }${
          data.trip
            ? `◆${data.trip}`
            : `◇${Buffer.from(message.author.id)
                .toString("base64")
                .slice(14, 24)}`
        } ${
          threadData.owner === message.author.id
            ? "<:nushi:919785199187943474>"
            : ""
        }`
      )
      .setDescription(sendContent)
      .setColor("RANDOM")
      .setFooter(
        moment(new Date()).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")
      )
      .setImage(message.attachments.map((x) => x.url).shift());
    await message.channel.send({ embeds: [embed] });
    if (msgs.size >= 100) {
      await message.channel.send({
        embeds: [
          {
            title: "101: Over 100 Thread",
            description:
              "このスレッドは100を超えました。\n次スレも…VIPクオリティ！！",
            color: "RANDOM",
          },
        ],
      });
      await message.channel.setArchived(true);
      await message.channel.edit({
        locked: true,
      });
    }
  },
};
