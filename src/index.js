import fs from "fs"; import dayjs from "dayjs";
const cfg={EVENTS_FILE:process.env.EVENTS_FILE||"data/events.jsonl",
  WEIGHTS:{discord_msg:+(process.env.WEIGHT_DISCORD_MSG||1),
           discord_reply:+(process.env.WEIGHT_DISCORD_REPLY||2),
           tweet:+(process.env.WEIGHT_TWEET||3),
           github_commit:+(process.env.WEIGHT_GITHUB_COMMIT||5)}};
if(!fs.existsSync(cfg.EVENTS_FILE)){console.error(`[!] Events file not found: ${cfg.EVENTS_FILE}. Run "npm run seed" first.`);process.exit(1);}
const events=fs.readFileSync(cfg.EVENTS_FILE,"utf8").trim().split("\\n").filter(Boolean).map(l=>JSON.parse(l));
const scores={},counts={discord_msg:0,discord_reply:0,tweet:0,github_commit:0,other:0};
for(const e of events){const w=cfg.WEIGHTS[e.type]??0.5;scores[e.user]=(scores[e.user]||0)+w;if(counts[e.type]!==undefined)counts[e.type]++;else counts.other++;}
const leaderboard=Object.entries(scores).map(([user,score])=>({user,score})).sort((a,b)=>b.score-a.score);
fs.mkdirSync("public",{recursive:true});
fs.writeFileSync("public/leaderboard.json",JSON.stringify({generatedAt:new Date().toISOString(),weights:cfg.WEIGHTS,eventsProcessed:events.length,counts,leaderboard},null,2));
const md=["# Attention Leaderboard","",`Generated: ${dayjs().format("YYYY-MM-DD HH:mm:ss")} UTC`,"","| Rank | User | Score |","|----:|:-----|------:|",...leaderboard.map((r,i)=>`| ${i+1} | ${r.user} | ${r.score} |`)].join("\\n");
fs.writeFileSync("leaderboard.md",md);
const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"/><title>Attention Leaderboard</title>
<body style="font-family:system-ui;margin:40px;max-width:900px">
<h1>Attention Leaderboard</h1>
<p><small>Generated at <span id="ts"></span></small></p>
<table id="tbl" border="1" cellpadding="8" cellspacing="0"></table>
<script>
fetch("./leaderboard.json").then(r=>r.json()).then(d=>{
  document.getElementById("ts").textContent = d.generatedAt;
  const t = document.getElementById("tbl");
  t.innerHTML = "<tr><th>Rank</th><th>User</th><th>Score</th></tr>" +
    d.leaderboard.map((r,i)=>"<tr><td>"+(i+1)+"</td><td>"+r.user+"</td><td>"+r.score+"</td></tr>").join("");
});
</script>
</body></html>`;
fs.writeFileSync("public/index.html", html);
console.log("✅ Wrote public/leaderboard.json, leaderboard.md, public/index.html");
