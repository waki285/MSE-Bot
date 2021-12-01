const { execSync, exec } = require("child_process");

console.log(execSync("git add -A").toString());

let emoji = "";
let msg = "";
if (process.argv[3]) {
  switch (process.argv[2]) {
    case "feat":
      emoji = `✨ feat${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "fix":
      emoji = `🐛 fix${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "docs":
      emoji = `📋 docs${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "style":
      emoji = `🧹 style${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "refactor":
      emoji = `🔧 refactor${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "perf":
      emoji = `🏷 perf${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "test":
      emoji = `🧪 test${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    case "chore":
      emoji = `🗃 chore${process.argv[4] ? `(${process.argv[3]})`:""}: `;
      break;
    default:
      emoji = `${process.argv[2]}${process.argv[4] ? `(${process.argv[3]})`:""}: `;
  }
  msg = `${emoji}${process.argv[4] ? process.argv[4]:process.argv[3]}`;
} else msg = process.argv[2];

exec(`git commit -m "${msg}"`, (err, stdout, stderr) => {
  if (err) console.log(err.message.substr(err.message.indexOf("}"))); else console.log(stderr + stdout);
  console.log(execSync("git push origin HEAD").toString())
})