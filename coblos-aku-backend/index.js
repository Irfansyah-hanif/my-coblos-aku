const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- SETUP UPLOAD ---
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- DATABASE ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- DATA DUMMY BERITA ---
let mockNews = [
  { id: 1, title: "Tata Cara Pemilihan", date: "2024-11-26", category: "Edukasi", content: "Panduan lengkap...", author: "Panitia", image: "" },
  { id: 2, title: "Debat Kandidat", date: "2024-11-25", category: "Agenda", content: "Saksikan debat...", author: "Humas", image: "" },
];

// ================= ROUTES =================

// 1. AUTH
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase.from('candidates').select('*').eq('username', username).eq('password', password).single();
  if (error || !data) return res.status(401).json({ success: false, message: 'Username atau Password salah' });
  res.json({ success: true, user: data });
});

app.post('/api/register', async (req, res) => {
  const { name, username, password } = req.body;
  const { data: exist } = await supabase.from('candidates').select('id').eq('username', username).single();
  if (exist) return res.status(400).json({ success: false, message: 'Username sudah dipakai' });

  const { error } = await supabase.from('candidates').insert([{ name, username, password, title: 'Kandidat Baru', visi: '-', misi: [], image: '' }]);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Registrasi Berhasil' });
});

// 2. KANDIDAT
app.get('/api/candidates', async (req, res) => {
  const { data } = await supabase.from('candidates').select('*').order('number', { ascending: true });
  res.json({ success: true, data: data || [] });
});
app.get('/api/candidates/:id', async (req, res) => {
  const { data } = await supabase.from('candidates').select('*').eq('id', req.params.id).single();
  res.json({ success: true, data });
});
app.post('/api/candidates', async (req, res) => {
  const { name, title, number, visi, misi, username, password } = req.body;
  const { error } = await supabase.from('candidates').insert([{ name, title, number, visi, misi, username, password, image: '' }]);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true });
});
app.put('/api/candidate/:id', async (req, res) => {
  const { error } = await supabase.from('candidates').update(req.body).eq('id', req.params.id);
  if (error) return res.status(500).json({ success: false });
  res.json({ success: true });
});

// 3. BERITA (UPDATE: Handle Category)
app.get('/api/news', (req, res) => res.json({ success: true, data: mockNews }));
app.get('/api/news/:id', (req, res) => {
  const news = mockNews.find(n => n.id == req.params.id);
  res.json({ success: true, data: news });
});

app.post('/api/news', upload.single('file'), (req, res) => {
  const fileUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : '';
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || 'Info', // Default category
    date: new Date().toISOString(),
    image: fileUrl,
    ...req.body
  };
  mockNews.unshift(newItem);
  res.json({ success: true, data: newItem });
});

app.put('/api/news/:id', upload.single('file'), (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockNews.findIndex(n => n.id === id);

  if (index !== -1) {
    const fileUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : mockNews[index].image;
    mockNews[index] = {
      ...mockNews[index],
      title: req.body.title,
      content: req.body.content,
      category: req.body.category, // UPDATE: Simpan kategori baru
      image: fileUrl
    };
    res.json({ success: true, data: mockNews[index] });
  } else {
    res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
});

app.delete('/api/news/:id', (req, res) => {
  mockNews = mockNews.filter(n => n.id != req.params.id);
  res.json({ success: true });
});

// 4. VOTE
app.post('/api/vote', async (req, res) => {
  const { candidateId, userId } = req.body;
  const { error } = await supabase.from('votes').insert([{ candidate_id: candidateId, user_id: userId }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});
app.get('/api/results', async (req, res) => {
  const { data: candidates } = await supabase.from('candidates').select('id, name');
  const { data: votes } = await supabase.from('votes').select('candidate_id');
  const total = votes?.length || 0;
  const results = candidates?.map(c => {
    const count = votes?.filter(v => v.candidate_id === c.id).length || 0;
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    return { ...c, count, percentage };
  });
  res.json({ success: true, data: results, total });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));