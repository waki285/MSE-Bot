const config = require("../config.json");
const Discord = require("discord.js");
const Matcher = require("didyoumean2").default;
const jap = require("permission-to-japanese");
module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Discord.Message} message
   */
  async execute(message) {
    if (message.partial) await message.fetch();
    if (message.channel.partial) await message.channel.fetch();

    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) {
      let m = Matcher(commandName, [...message.client.commands.keys()], {
        returnType: require("didyoumean2").ReturnTypeEnums.ALL_MATCHES,
      });
      if (Array.isArray(m)) m = m.join("`, `");
      message.error(
        "❌コマンドがありません",
        `そのコマンドは存在しません。\n\nもしかして:\`${
          m ? m : "見つかりませんでした。"
        }\``
      );
      return;
    }

    if (
      message.client.rebootFlg === 1 &&
      !config.executable.mod.includes(message.author.id)
    )
      return message.error(
        "⏲起動中",
        "現在起動中です。\n起動完了までしばらくお待ちください…"
      );

    if (command.guildOnly && !message.channel.type) {
      return message.error(
        "🧩サーバー専用コマンド",
        "このコマンドはサーバー内でしか使用できません。"
      );
    }

    if (command.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author);
      if (
        !authorPerms ||
        !command.permissions.every((perm) =>
          authorPerms.has(Discord.Permissions.FLAGS[perm])
        )
      ) {
        return message.error(
          "🧰権限不足",
          "あなたにこのコマンドを実行する権限がありません\nこのコマンドを実行するにはあなたに`" +
            jap(command.permissions).join(", ") +
            "`の権限が必要です"
        );
      }
    }

    if (command.modOnly) {
      if (!config.executable.mod.includes(message.author.id)) {
        return message.error(
          "👮モデレーター専用コマンド",
          "あなたはこのコマンドを実行できません"
        );
      }
    }

    if (command.adminOnly) {
      if (!config.executable.admin.includes(message.author.id)) {
        return message.error(
          "🌟管理者専用コマンド",
          "あなたはこのコマンドを実行できません"
        );
      }
    }

    if (command.requiredArg) {
      const reqArg = command.requiredArg;
      if (
        reqArg.some((x) => x) &&
        !reqArg.every((x, i) => !x || !!args[i] === x)
      )
        return message.error(
          "🍁引数",
          `必要な引数が足りません\n\n> このコマンドは次のように書いてください(\`[\`と\`]\`で囲まれているのは任意の引数です)\n\`${
            config.prefix
          }${commandName}${command.args ? " " : ""}${command.argList
            .map((x, i) => (command.requiredArg[i] ? x : `[${x}]`))
            .join(" ")}\``
        );
    }

    const { cooldowns } = message.client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || config.defaultCooldown) * 1000;

    if (
      timestamps.has(message.author.id) &&
      !config.executable.mod.includes(message.author.id)
    ) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.error(
          "💧コマンドクールダウン",
          `クールダウン中です\nあと\`${timeLeft.toFixed(1)}\`秒お待ちください`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    if (command.args && !args)
      return message.error(
        "❌引数が必要です",
        "このコマンドには引数が必要です。\n`" +
          config.prefix +
          command.name +
          ""
      );
    try {
      command.execute(message, message.client, args)?.catch((error) => {
        console.error(error);
        const errorId = Discord.SnowflakeUtil.generate();
        message.error(
          "❌エラー",
          "原因不明のエラーが発生しました。\n下のエラーIDを控えて、サポートサーバーでお問い合わせください。\n\nエラーID:`" +
            errorId +
            "`\n開発者用エラーメッセージ:```js\n" +
            error +
            "\n```"
        );
        message.client.channels.cache.get(config.errorLog).send({
          content: `${config.executable.admin.map((x) => `<@${x}>`).join(",")}`,
          embeds: [
            {
              title: "エラーが発生しています",
              fields: [
                {
                  name: "エラーID",
                  value: errorId,
                },
                {
                  name: "エラー",
                  value:
                    "```js\n" +
                    require("util").inspect(error).slice(0, 1000) +
                    "\n```",
                },
              ],
            },
          ],
        });
      });
    } catch (error) {
      console.error(error);
      const errorId = Discord.SnowflakeUtil.generate();
      message.error(
        "❌エラー",
        "原因不明のエラーが発生しました。\n下のエラーIDを控えて、サポートサーバーでお問い合わせください。\n\nエラーID:`" +
          errorId +
          "`\n開発者用エラーメッセージ:```js\n" +
          error +
          "\n```"
      );
      message.client.channels.cache.get(config.errorLog).send({
        content: `${config.executable.admin.map((x) => `<@${x}>`).join(",")}`,
        embeds: [
          {
            title: "エラーが発生しています",
            fields: [
              {
                name: "エラーID",
                value: errorId,
              },
              {
                name: "エラー",
                value:
                  "```js\n" +
                  require("util").inspect(error).slice(0, 1000) +
                  "\n```",
              },
            ],
          },
        ],
      });
    }
  },
};
