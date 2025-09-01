import fs from "fs";
const sample = [
  { ts: "2025-09-01T12:00:00Z", user: "Ineu02",   type: "discord_msg",   channel:"#dev-playground" },
  { ts: "2025-09-01T12:03:00Z", user: "flupyxyz", type: "discord_msg",   channel:"#dev-playground" },
  { ts: "2025-09-01T12:10:00Z", user: "Ineu02",   type: "tweet",         url:"https://x.com/..."  },
  { ts: "2025-09-01T12:20:00Z", user: "neo",      type: "github_commit", repo:"soundness/vapps"   },
  { ts: "2025-09-01T13:00:00Z", user: "Ineu02",   type: "discord_reply", channel:"#dev-playground" }
];
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/events.jsonl", sample.map(o=>JSON.stringify(o)).join("\\n")+"\\n");
console.log("seed -> data/events.jsonl");
