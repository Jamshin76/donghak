// 칭호별(등급 x 대표칭호) 미리보기 이미지 + 결과 링크 페이지 생성
const {chromium}=require(process.env.NODE_PATH_PW);const fs=require('fs');const path=require('path');
const OUT='/home/claude/donghak/r'; const only=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:700}});
await p.route(/fonts\.googleapis/, r=>r.fulfill({contentType:'text/css',body:fs.readFileSync('fontfaces.css','utf8')}));
await p.goto('file:///home/claude/donghak/index.html');
const items=await p.evaluate(async (only)=>{
  try { await Promise.all(['400 100px "Black Han Sans"','700 40px "IBM Plex Sans KR"','400 40px "IBM Plex Sans KR"'].map(f => document.fonts.load(f, "가A1"))); } catch(e){}
  const BH='"Black Han Sans","IBM Plex Sans KR",sans-serif', SANS='"IBM Plex Sans KR",sans-serif', MONO='"IBM Plex Mono",monospace', GOLD="#ffcc1a";
  const mains=[...TITLES.map(t=>({k:t.id,name:t.name,roast:t.roast})),...COMBOS.map((c,i)=>({k:"c"+i,name:c.name,roast:c.roast}))];
  const out=[];
  TIERS.forEach((tr,ti)=>mains.forEach(m=>{
    const key=`${ti}-${m.k}`; if(only && key!==only) return;
    const W=1200,H=630,cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');
    ctx.fillStyle="#0f121a";ctx.fillRect(0,0,W,H);ctx.fillStyle=GOLD;ctx.fillRect(0,0,W,12);
    ctx.fillStyle="#fff";ctx.font=`400 40px ${BH}`;ctx.fillText("동학개미 시뮬레이터",56,82);
    ctx.textAlign="right";ctx.fillStyle="#98a1b5";ctx.font=`700 24px ${SANS}`;ctx.fillText("2020 코로나 폭락장 · 시드 1,000만원",W-56,78);ctx.textAlign="left";
    const bx=40,by=124,bw=W-80,bh=360;
    const g=ctx.createLinearGradient(bx,by,bx+bw,by+bh);g.addColorStop(0,"#2a2310");g.addColorStop(.5,"#15161c");g.addColorStop(1,"#2a2310");
    ctx.save();ctx.shadowColor="rgba(255,204,26,.5)";ctx.shadowBlur=30;ctx.beginPath();ctx.roundRect(bx,by,bw,bh,24);ctx.fillStyle=g;ctx.fill();ctx.restore();
    const sg=ctx.createLinearGradient(bx,by,bx+bw,by+bh);sg.addColorStop(0,"#fff1a8");sg.addColorStop(.35,GOLD);sg.addColorStop(.65,"#c8960a");sg.addColorStop(1,"#fff1a8");
    ctx.beginPath();ctx.roundRect(bx,by,bw,bh,24);ctx.lineWidth=6;ctx.strokeStyle=sg;ctx.stroke();
    ctx.font=`700 24px ${SANS}`;const lab="내 칭호",lw=ctx.measureText(lab).width+40;
    ctx.beginPath();ctx.roundRect(bx+36,by-21,lw,42,21);ctx.fillStyle=GOLD;ctx.fill();ctx.fillStyle="#1a1400";ctx.textBaseline="middle";ctx.fillText(lab,bx+56,by+1);ctx.textBaseline="alphabetic";
    const cx=W/2,inner=bw-90;ctx.textAlign="center";
    ctx.fillStyle=GOLD;ctx.font=`700 44px ${SANS}`;ctx.fillText(tr.name,cx,by+92);
    let ts=124;ctx.font=`400 ${ts}px ${BH}`;while(ctx.measureText(m.name).width>inner&&ts>60){ts-=4;ctx.font=`400 ${ts}px ${BH}`;}
    ctx.fillStyle="#fff";ctx.fillText(m.name,cx,by+92+ts+26);
    ctx.fillStyle="#c6cbd8";let rs=28;ctx.font=`400 ${rs}px ${SANS}`;while(ctx.measureText(`“${m.roast}”`).width>inner&&rs>18){rs-=1;ctx.font=`400 ${rs}px ${SANS}`;}ctx.fillText(`“${m.roast}”`,cx,by+bh-36);
    ctx.textAlign="left";
    ctx.fillStyle=GOLD;ctx.font=`700 34px ${SANS}`;ctx.fillText("너의 칭호는? 지금 플레이 →",56,H-60);
    ctx.textAlign="right";ctx.fillStyle="#fff";ctx.font=`700 26px ${SANS}`;ctx.fillText("made by 아돈노미",W-56,H-74);
    ctx.fillStyle="#98a1b5";ctx.font=`400 22px ${SANS}`;ctx.fillText("from X @DONTTknow_me",W-56,H-42);ctx.textAlign="left";
    out.push({key,tier:tr.name,name:m.name,roast:m.roast,img:cv.toDataURL("image/jpeg",.88)});
  }));
  return out;
},only);
fs.mkdirSync(OUT,{recursive:true});
const esc=s=>s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
const BASE='https://jamshin76.github.io/donghak/';
for(const it of items){
  fs.writeFileSync(path.join(OUT,it.key+'.jpg'),Buffer.from(it.img.split(',')[1],'base64'));
  const t=esc(`나는 [${it.tier} ${it.name}] · 동학개미 시뮬레이터`),d=esc(`“${it.roast}” 2020 코로나 폭락장부터 1,000만원 굴리기. 너의 칭호는?`),img=`${BASE}r/${it.key}.jpg`,url=`${BASE}r/${it.key}.html`;
  fs.writeFileSync(path.join(OUT,it.key+'.html'),`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<meta property="og:type" content="website"><meta property="og:url" content="${url}">
<meta property="og:title" content="${t}"><meta property="og:description" content="${d}">
<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@DONTTknow_me"><meta name="twitter:creator" content="@DONTTknow_me">
<meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${d}"><meta name="twitter:image" content="${img}">
<script>location.replace("../?vs=${it.key}");</script>
</head><body style="background:#0f121a;color:#fff;font-family:sans-serif;padding:24px"><a style="color:#ffcc1a" href="../?vs=${it.key}">동학개미 시뮬레이터 하러 가기 →</a></body></html>
`);
}
console.log(items.length,'made');await b.close();})();
