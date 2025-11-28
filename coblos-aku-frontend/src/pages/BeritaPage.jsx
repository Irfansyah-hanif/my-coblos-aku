import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth'; 
import { Calendar, ChevronRight, Newspaper, Plus, Trash2, X, FileText, Edit2, Image as ImageIcon } from 'lucide-react';
import LazyImage from '../components/LazyImage';

export default function BeritaPage({ onDetail }) {
  const { user } = useAuth(); 
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // UPDATE: Tambah state 'category' di form
  const [form, setForm] = useState({ id: null, title: '', content: '', category: 'Info', file: null, imagePreview: '' });

  useEffect(() => { loadNews(); }, []);
  const loadNews = () => api.getNews().then(res => setList(res.data || []));

  const resetForm = () => {
    setForm({ id: null, title: '', content: '', category: 'Info', file: null, imagePreview: '' });
    setShowForm(false);
  };

  const handleEditClick = (e, item) => {
    e.stopPropagation();
    setForm({
      id: item.id,
      title: item.title,
      content: item.content,
      category: item.category || 'Info', // Ambil kategori lama
      file: null,
      imagePreview: item.image
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('category', form.category); // Kirim kategori ke backend
    if (form.file) {
      formData.append('file', form.file);
    }

    try {
      if (form.id) {
        const res = await api.updateNews(form.id, formData);
        if (res.success) {
          setList(prev => prev.map(item => item.id === form.id ? res.data : item));
          alert('Berita diperbarui!');
        }
      } else {
        const res = await api.postNews(formData);
        if (res.success) {
          setList(prev => [res.data, ...prev]);
          alert('Berita diposting!');
        }
      }
      resetForm();
    } catch (error) {
      alert('Gagal menyimpan berita.');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(confirm('Hapus berita ini?')) {
      await api.deleteNews(id);
      setList(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="px-6 py-8 pb-24 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900 font-serif border-l-4 border-gold-500 pl-3">
          Berita Kampanye
        </h2>
        {user && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-navy-900 text-gold-500 p-2.5 rounded-xl shadow-lg hover:scale-105 transition">
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <button onClick={resetForm} className="absolute top-4 right-4 text-slate-400"><X/></button>
            <h3 className="font-bold text-lg mb-4 text-navy-900 flex gap-2">
              <FileText className="text-gold-500"/> {form.id ? 'Edit Berita' : 'Buat Berita'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input Judul */}
              <input className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-sm" placeholder="Judul Berita" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              
              {/* Input Kategori (BARU) */}
              <div>
                <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">Kategori</label>
                <select className="w-full p-3 border rounded-xl bg-white text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Info">Info</option>
                  <option value="Edukasi">Edukasi</option>
                  <option value="Agenda">Agenda</option>
                  <option value="Kampanye">Kampanye</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>

              {/* Input Konten */}
              <textarea className="w-full p-3 border rounded-xl bg-slate-50 text-sm resize-none" rows="4" placeholder="Isi konten..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required></textarea>
              
              {/* Upload */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50">
                {form.imagePreview ? (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2">
                    <img src={form.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => setForm({...form, file: null, imagePreview: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 py-4">
                    <ImageIcon size={24} className="mb-1"/>
                    <span className="text-xs">Upload Gambar</span>
                  </div>
                )}
                <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-800" onChange={handleFileChange} accept="image/*" />
              </div>

              <button className="w-full py-3 bg-gold-500 text-navy-900 font-bold rounded-xl mt-2 shadow-md">
                {form.id ? 'SIMPAN PERUBAHAN' : 'PUBLIKASIKAN'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIST BERITA */}
      <div className="space-y-4">
        {list.map(item => (
          <div key={item.id} onClick={() => onDetail(item.id)} className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all group relative">
            {user && (
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <button onClick={(e) => handleEditClick(e, item)} className="bg-white/90 p-1.5 rounded-full text-blue-500 shadow-sm hover:bg-blue-50"><Edit2 size={16} /></button>
                <button onClick={(e) => handleDelete(e, item.id)} className="bg-white/90 p-1.5 rounded-full text-red-500 shadow-sm hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            )}
            <div className="h-36 w-full relative bg-slate-200">
              {item.image ? <LazyImage src={item.image} className="w-full h-full"/> : <div className="w-full h-full flex items-center justify-center"><Newspaper className="text-slate-300"/></div>}
              <div className="absolute bottom-2 left-2 bg-gold-500 text-navy-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">{item.category || 'Info'}</div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1 text-slate-400 text-[10px]">
                <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
              </div>
              <h3 className="font-bold text-navy-900 text-sm leading-snug line-clamp-2">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}