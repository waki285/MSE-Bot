const { GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    member.client.channels.cache.get("798922824349646938").send({
      content: `${member.user.toString()}**さんが退出しました...**\n\`\`\`diff\n- 現在のサーバー人数: ${
        member.guild.memberCount
      }になりました\n\`\`\``,
      embeds: [
        {
          color: "RED",
          description: `> ${member.user.username}さん、また来てくれると幸いです!!☘`,
        },
      ],
    });
  },
};
