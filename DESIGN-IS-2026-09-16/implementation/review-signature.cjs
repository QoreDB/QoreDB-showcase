const fs = require('node:fs/promises');
const path = require('node:path');
const repository = path.resolve(__dirname, '../..');
const puppeteer = require(path.join(repository, 'node_modules/puppeteer'));
const base=process.env.SHOWCASE_BASE_URL || 'http://127.0.0.1:3101';
const out=path.join(__dirname, 'signature-v2', 'production');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
await fs.mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox']});
const reports=[];
const configs=process.env.REVIEW_VISUAL_ONLY ? [] : [
 {name:'home-desktop-light',width:1440,height:1000},
 {name:'home-mobile-light',width:390,height:844},
 ...[1,2,3].map(n=>({name:'throttled-'+n,width:390,height:844,throttled:true}))
];
try {
for(const config of configs){
 const context=await browser.createBrowserContext();const page=await context.newPage();
 await page.setViewport({width:config.width,height:config.height,deviceScaleFactor:1});
 await page.setCacheEnabled(false);await page.setRequestInterception(true);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{const u=new URL(r.url());if(!['http:','https:'].includes(u.protocol))return r.continue();if(u.origin!==base||!['GET','HEAD','OPTIONS'].includes(r.method()))return r.abort('blockedbyclient');return r.continue();});
 await page.evaluateOnNewDocument(()=>{localStorage.setItem('theme','light');window.__perf={lcp:[],cls:[],long:[]};for(const [type,key] of [['largest-contentful-paint','lcp'],['layout-shift','cls'],['longtask','long']]){new PerformanceObserver(list=>{for(const e of list.getEntries()){if(key==='cls'&&e.hadRecentInput)continue;window.__perf[key].push({start:e.startTime,duration:e.duration,value:e.value,element:e.element?.outerHTML.slice(0,300)});}}).observe({type,buffered:true});}});
 if(config.throttled){const client=await page.createCDPSession();await client.send('Emulation.setCPUThrottlingRate',{rate:4});await client.send('Network.enable');await client.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});}
 const response=await page.goto(base+'/fr',{waitUntil:'load',timeout:60000});const html=await response.text();const initialScripts=[...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].filter(m=>!m[0].toLowerCase().includes('nomodule')).map(m=>m[1]);await wait(3000);
 const data=await page.evaluate(()=>({metrics:window.__perf,nav:performance.getEntriesByType('navigation').map(e=>({ttfb:e.responseStart,load:e.loadEventEnd,dcl:e.domContentLoadedEventEnd,encoded:e.encodedBodySize,decoded:e.decodedBodySize})),scripts:[...document.querySelectorAll('script[src]:not([nomodule])')].map(e=>new URL(e.src).pathname),resources:performance.getEntriesByType('resource').map(e=>({url:new URL(e.name).pathname,type:e.initiatorType,encoded:e.encodedBodySize,decoded:e.decodedBodySize})),videoSources:[...document.querySelectorAll('video')].map(v=>v.getAttribute('src')),height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,hero:document.querySelector('main figure img').getBoundingClientRect().toJSON(),infinite:document.getAnimations().filter(a=>a.effect.getTiming().iterations===Infinity).length}));
 data.initialHtmlScripts=initialScripts;const initial=data.resources.filter(r=>initialScripts.includes(r.url));const all=data.resources.filter(r=>r.url.endsWith('.js'));const sum=(a,k)=>a.reduce((n,r)=>n+r[k],0);
 data.totals={initialEncoded:sum(initial,'encoded'),initialDecoded:sum(initial,'decoded'),startupJsEncoded:sum(all,'encoded'),startupJsDecoded:sum(all,'decoded'),resources:data.resources.length,totalResourceEncoded:sum(data.resources,'encoded'),databaseLogosEncoded:sum(data.resources.filter(r=>r.url.includes('/images/databases/')),'encoded')};
 reports.push({config,status:response.status(),errors,...data});
 await page.screenshot({path:path.join(out,config.name+'.png')});console.log(config.name,JSON.stringify({totals:data.totals,lcp:data.metrics.lcp,cls:data.metrics.cls}));await context.close();
}
if(configs.length)await fs.writeFile(path.join(out,'performance.json'),JSON.stringify({protocol:{browser:await browser.version(),viewport:'390x844 DPR1',cpuSlowdown:4,latencyMs:150,downloadBytesPerSecond:200000,uploadBytesPerSecond:93750,cache:'disabled, new browser context each run',externalRequests:'blocked',server:'local production :3101, warmed',sampleWindow:'load + 3 seconds'},runs:reports},null,2));
if(process.env.REVIEW_MEASURE_ONLY)return;
const visuals=[];
for(const theme of ['light','dark'])for(const width of [390,1440])for(const route of ['']){
 const context=await browser.createBrowserContext();const page=await context.newPage();await page.setViewport({width,height:width===390?844:1000});await page.evaluateOnNewDocument(t=>localStorage.setItem('theme',t),theme);await page.setRequestInterception(true);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{const u=new URL(r.url());if(!['http:','https:'].includes(u.protocol))return r.continue();if(u.origin!==base||!['GET','HEAD','OPTIONS'].includes(r.method()))return r.abort('blockedbyclient');return r.continue();});
 const response=await page.goto(base+'/fr'+route,{waitUntil:'networkidle0',timeout:60000});await page.evaluate(()=>document.fonts.ready);await wait(300);
 const name=(route.slice(1)||'home')+'-'+theme+'-'+width;
 await page.screenshot({path:path.join(out,name+'.png')});
 if(!route){await page.evaluate(async()=>{for(const img of document.querySelectorAll('main img')){img.scrollIntoView();await new Promise(r=>setTimeout(r,200));try{await img.decode()}catch{}}});await page.evaluate(()=>scrollTo(0,0));await wait(300);await page.screenshot({path:path.join(out,name+'-full.png'),fullPage:true});}
 await page.$eval('.q-demo', e=>e.scrollIntoView({block:'center'})); await wait(200); await page.screenshot({path:path.join(out,name+'-demo-poster.png')});
 await page.locator('.q-demo-play').click(); await page.waitForFunction(()=>{const v=document.querySelector('.q-demo-video');return v && !v.paused && v.currentTime > 2;});
 await page.evaluate(()=>document.querySelector('.q-demo-video').pause()); await page.screenshot({path:path.join(out,name+'-demo-playing.png')});
 const info=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),main:document.querySelectorAll('main').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));visuals.push({name,status:response.status(),errors,...info});console.log(name,response.status(),info.width,errors);await context.close();
}
await fs.writeFile(path.join(out,'visual-review.json'),JSON.stringify(visuals,null,2));
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
