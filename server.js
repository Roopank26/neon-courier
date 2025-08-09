import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// In-memory scores (replace with DB in production)
let scores = [];

// API under /api
app.get('/api/scores', (req,res)=>{
  res.json(scores.slice(0,10));
});

app.post('/api/scores', (req,res)=>{
  const { name, score } = req.body || {};
  if (typeof score !== 'number' || !name) return res.status(400).json({ error:'invalid'});
  scores.push({ name: String(name).slice(0,24), score: Math.max(0, Math.floor(score)), date: Date.now() });
  scores.sort((a,b)=> b.score - a.score);
  scores = scores.slice(0, 50);
  res.json({ ok:true });
});

// Static hosting of built client
const distDir = path.resolve(__dirname, 'dist');
app.use(express.static(distDir));

// SPA fallback (let Vite app handle client routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const port = process.env.PORT || 5175;
app.listen(port, ()=> console.log('Server listening on', port));
