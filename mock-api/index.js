const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

let failOnce = false; let delayMs = 0;
app.get('/__admin', (req,res)=> res.json({ failOnce, delayMs }));
app.post('/__admin/toggle', (req,res)=> {
  const { type, value } = req.body;
  if (type === 'failOnce') failOnce = !!value;
  if (type === 'delayMs') delayMs = Number(value||0);
  res.json({ ok: true, failOnce, delayMs });
});
app.use(async (_, __, next)=>{ if (delayMs) await new Promise(r=>setTimeout(r,delayMs)); next(); });

const categories = require('./seed/categories.json');
let activities = require('./seed/activities.json');
let tickets = require('./seed/tickets.json');
const docs = require('./seed/docs.json');

app.get('/activities', (_,res)=> res.json({ items: activities }));
app.get('/tickets', (req,res)=> {
  const page = Number(req.query.page||1), size=10, s=(page-1)*size;
  res.json({ items: tickets.slice(s,s+size), nextPage: page*size < tickets.length ? page+1 : null });
});
app.get('/docs', (_,res)=> res.json({ items: docs }));
app.get('/categories', (_,res)=> res.json({ items: categories }));

app.post('/upload/init', (_,res)=>{
  const id = Date.now().toString(36);
  res.json({ uploadUrl: `http://localhost:3001/upload/put/${id}`, fileUrl: `http://localhost:3001/upload/file/${id}` });
});
app.put('/upload/put/:id', (_,res)=> res.status(200).end());
app.get('/upload/file/:id', (req,res)=> res.json({ ok: true, id: req.params.id }));

app.post('/activities', (req,res)=>{
  if (failOnce) { failOnce=false; return res.status(503).json({ message:'Temporary outage' }); }
  const item = { id: Date.now(), ...req.body, status: 'Posted', createdAt: new Date().toISOString() };
  activities = [item, ...activities]; res.json(item);
});
app.post('/tickets', (req,res)=>{
  if (failOnce) { failOnce=false; return res.status(503).json({ message:'Temporary outage' }); }
  const t = { id: Date.now(), ...req.body, status: 'Open', createdAt: new Date().toISOString() };
  tickets = [t, ...tickets]; res.json(t);
});

app.get('/docs/:id/file', (req,res)=> res.json({ url: `https://example.com/fake-${req.params.id}.pdf` }));
app.listen(3001, ()=> console.log('Mock API on http://localhost:3001'));
