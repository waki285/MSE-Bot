const { exec } = require("child_process");
const { createInterface } = require("readline");
const interface = createInterface(process.stdin, process.stdout);
const chalk = require("chalk");

/**
 * 
 * @param {string} command
 * @param {?boolean} okErr
 * @returns {Promise<string>}
 */
const execP = async (command, okErr) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err && !okErr) reject(err); else if (err && okErr) console.log(err);
      resolve(stderr + stdout);
    })
  })
};

/** 
 *  
 * @param {string} query
 * @returns {Promise<string>}
 */
const quesP = async (query) => {
  return new Promise((resolve) => {
    interface.question(query, (answer) => {
      resolve(answer);
    })
  });
}

(async () => {
  await execP("git add -A");

  let emoji = "";
  let msg = "";
  if (process.argv[3]) {
    switch (process.argv[2]) {
      case "feat":
        emoji = `✨ feat${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "fix":
        emoji = `🐛 fix${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "docs":
        emoji = `📋 docs${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "style":
        emoji = `🧹 style${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "refactor":
        emoji = `🔧 refactor${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "perf":
        emoji = `🏷 perf${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "test":
        emoji = `🧪 test${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      case "chore":
        emoji = `🗃 chore${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
        break;
      default:
        emoji = `${process.argv[2]}${process.argv[4] ? `(${process.argv[3]})` : ""}: `;
    }
    msg = `${emoji}${process.argv[4] ? process.argv[4] : process.argv[3]}`;
  } else msg = process.argv[2];

  console.log(chalk.bold("Commit message: ") + msg);
  const ans = await quesP(chalk.magenta("Is this OK?") + chalk.bold(" (y/n)") + ": ");
  if (ans === "n") process.exit(0);

  console.log(await execP(`git commit -m "${msg}"`, true));
})();