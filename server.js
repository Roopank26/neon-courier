import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let scores = [];

app.get('/scores', (req,res)=>{
  res.json(scores.slice(0,10));
});

app.post('/scores', (req,res)=>{
  const { name, score } = req.body || {};
  if (typeof score !== 'number' || !name) return res.status(400).json({ error:'invalid'});
  scores.push({ name: String(name).slice(0,24), score: Math.max(0, Math.floor(score)), date: Date.now() });
  scores.sort((a,b)=> b.score - a.score);
  scores = scores.slice(0, 50);
  res.json({ ok:true });
});

const port = process.env.PORT || 5175;
app.listen(port, ()=> console.log('Leaderboard API listening on', port));
