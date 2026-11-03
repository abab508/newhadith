import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.json':'application/json; charset=utf-8'};
const port = Number(process.env.PORT || 10000);
http.createServer(async (req,res)=>{
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = resolve(root, '.'+path);
    if (!(target === root || target.startsWith(root+sep))) { res.writeHead(403);res.end('Forbidden');return; }
    const candidate = path === '/' ? resolve(root,'index.html') : target;
    let file = candidate;
    try { if (!(await stat(file)).isFile()) file = resolve(root,'index.html'); } catch {file=resolve(root,'index.html');}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':file.endsWith('index.html')?'no-cache':'public, max-age=86400'}); res.end(data);
  } catch(e) {res.writeHead(500);res.end('Server error');}
}).listen(port,'0.0.0.0',()=>console.log('Milaghaiba accueil running on '+port));
