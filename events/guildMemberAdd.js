const { GuildMember, TextChannel } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    /**
     *
     * @type {TextChannel}
     */
    const channel = member.client.channels.cache.get("798922824349646938");
    channel.send({
      content: `**<@${member.id}>ãããMSEð´ãã¡ãªéå¶ãã¸ãããã!!ðð**\n> æ­è¿ä¿å¼ã³åºãï¼<@&779648088369266698>\n\`\`\`diff\n+ ç¾å¨ã®ãµã¼ãã¼äººæ°ï¼${member.guild.memberCount}ã«ãªãã¾ããð\n\`\`\``,
    });
  },
};
