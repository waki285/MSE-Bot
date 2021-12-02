const { exec } = require("child_process");

/**
 * 
 * @param {string} command
 * @returns {Promise<string>}
 */
const execP = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) reject(err);
      resolve(stderr + stdout);
    })
  })
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

  await execP(`git commit -m "${msg}"`)
  execP("git push origin HEAD");

})();