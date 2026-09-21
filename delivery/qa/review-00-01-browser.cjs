const {chromium}=require('../../web/node_modules/@playwright/test');
const {spawn}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'../../web');
(async()=>{
 const server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','-p','4317'],{cwd:root,windowsHide:true,stdio:'pipe'});
 let startup='';server.stdout.on('data',d=>startup+=d);server.stderr.on('data',d=>startup+=d);
 let browser;
 try{
  for(let i=0;i<100;i++){if(server.exitCode!==null)throw Error(startup);try{const r=await fetch('http://localhost:4317');if(r.ok)break;}catch{} await new Promise(r=>setTimeout(r,200));}
  browser=await chromium.launch({headless:true}); const page=await browser.newPage();
  const results=[];
  for(const width of [320,360,390,430,768,1024,1440]){
   await page.setViewportSize({width,height:900}); await page.goto('http://localhost:4317');
   results.push(await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth,bodyFont:getComputedStyle(document.querySelector('.body-text')).fontSize,descriptionFont:getComputedStyle(document.querySelector('.responsive-card p')).fontSize,cards:[...document.querySelectorAll('.responsive-card')].map(e=>Math.round(e.getBoundingClientRect().width)),buttons:[...document.querySelectorAll('button')].map(e=>({height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width}))})));
   if(width===390)await page.screenshot({path:path.join(__dirname,'review-00-01-mobile.png'),fullPage:true});
  }
  fs.writeFileSync(path.join(__dirname,'review-00-01-browser.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
