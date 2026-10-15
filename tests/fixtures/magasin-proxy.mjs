import http from 'node:http';
const upstream=process.env.QA_FIXTURE_API_URL||'http://127.0.0.1:8011';
const port=Number(process.env.QA_FIXTURE_PORT)||8021;
http.createServer(async(req,res)=>{
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 try{
  const response=await fetch(upstream+req.url,{redirect:'error',headers:{Accept:req.headers.accept||'application/json',...(req.headers['x-time-stone-proxy']?{'X-Time-Stone-Proxy':req.headers['x-time-stone-proxy']}:{})},signal:AbortSignal.timeout(8000)});
  if(req.url.startsWith('/api/v1/site?')){
   const data=await response.json();data.data.contacts={...(data.data.contacts||{}),address:'QA ONLY — synthetic location, not TIME STONE’s address',maps_directions_url:'https://www.google.com/maps?q=QA+ONLY+NONBUSINESS+TEST+LOCATION'};
   res.writeHead(response.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));
  }else{res.writeHead(response.status,{'Content-Type':response.headers.get('content-type')||'application/octet-stream','Cache-Control':'no-store'});res.end(Buffer.from(await response.arrayBuffer()));}
 }catch{res.writeHead(503);res.end('unavailable');}
}).listen(port,'127.0.0.1',()=>console.log(`Read-only location fixture proxy on loopback ${port}`));
