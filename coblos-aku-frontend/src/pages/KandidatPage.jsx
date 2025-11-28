import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import { ChevronRight, User, Award, Plus, X, Save } from 'lucide-react';

export default function KandidatPage({ onDetail }) {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Tambah
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', title: '', number: '', visi: '', misi: '', username: '', password: ''
  });

  // Fetch Data
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.getCandidates();
      setList(res.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Handle Submit Tambah Kandidat
  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      // Format misi menjadi array jika dipisah koma
      const payload = {
        ...formData,
        misi: formData.misi.split(',').map(m => m.trim()) 
      };
      
      const res = await api.addCandidate(payload);
      if (res.success) {
        alert('Kandidat berhasil ditambahkan!');
        setShowAddModal(false);
        setFormData({ name: '', title: '', number: '', visi: '', misi: '', username: '', password: '' });
        fetchCandidates(); // Refresh list
      } else {
        alert('Gagal: ' + res.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan server');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400">Memuat data...</div>;

  return (
    <div className="px-6 py-8 pb-24 bg-slate-50 min-h-screen font-sans relative">
      
      {/* Header & Tombol Tambah */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-navy-900 p-2 rounded-lg text-gold-500">
            <Award size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-navy-900 leading-none">Daftar Kandidat</h2>
            <p className="text-xs text-slate-500 mt-1">Pilih pemimpin masa depanmu</p>
          </div>
        </div>
        {/* Tombol Tambah (Hanya User Login) */}
        {user && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gold-500 text-navy-900 p-2 rounded-xl shadow-lg hover:bg-gold-600 transition-transform active:scale-95"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* Grid Kandidat */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map(k => (
          <div 
            key={k.id} 
            onClick={() => onDetail(k.id)} 
            className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group relative flex flex-col"
          >
            <div className="absolute top-3 left-3 z-10">
                <span className="bg-navy-900/90 backdrop-blur-sm text-gold-500 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-white/10">
                    No. {k.number}
                </span>
            </div>

            <div className="relative h-56 bg-slate-200 overflow-hidden">
              {k.image ? (
                <img src={k.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={k.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-navy-50 text-navy-200">
                  <User size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                 <h3 className="font-bold text-lg leading-tight truncate">{k.name}</h3>
                 <p className="text-xs text-slate-300 opacity-90 truncate">{k.title || 'Kandidat'}</p>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center bg-white">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lihat Detail</span>
               <div className="bg-slate-100 p-1.5 rounded-full text-navy-900 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                 <ChevronRight size={16} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TAMBAH KANDIDAT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl p-6 relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 p-1 rounded-full">
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-xl text-navy-900 mb-6 flex items-center gap-2">
              <Plus className="text-gold-500"/> Tambah Kandidat
            </h3>
            
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1">Nama Lengkap</label>
                  <input className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1">No. Urut</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1">Slogan / Jabatan</label>
                <input className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Contoh: Calon Ketua BEM" />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div>
                  <label className="text-xs font-bold text-blue-800 block mb-1">Username Login</label>
                  <input className="w-full p-2 bg-white border rounded-lg text-sm" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required placeholder="User ID" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-800 block mb-1">Password</label>
                  <input className="w-full p-2 bg-white border rounded-lg text-sm" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="******" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1">Visi</label>
                <textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" rows="2" value={formData.visi} onChange={e => setFormData({...formData, visi: e.target.value})}></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-navy-900 block mb-1">Misi (Pisahkan dengan koma)</label>
                <textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" rows="2" value={formData.misi} onChange={e => setFormData({...formData, misi: e.target.value})} placeholder="Misi 1, Misi 2, Misi 3"></textarea>
              </div>

              <button className="w-full py-3.5 bg-navy-900 text-white font-bold rounded-xl shadow-lg hover:bg-navy-800 transition-all flex items-center justify-center gap-2 mt-2">
                <Save size={18} /> SIMPAN KANDIDAT
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}