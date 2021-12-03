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
      content: `**<@${member.id}>さん、MSE🌴マメな運営をへようこそ!!🎉🎉**\n> 歓迎係呼び出し：<@&779648088369266698>\n\`\`\`diff\n+ 現在のサーバー人数：${member.guild.memberCount}になりました👏\n\`\`\``
    })
}
}