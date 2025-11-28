import { useEffect, useState } from 'react';
import { getCandidateDetail, submitVote, api } from '../api'; // Pastikan import api untuk update
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, CheckCircle, Edit, Save, X, Trash2, Plus, Camera, Vote } from 'lucide-react';

export default function CandidateDetailPage({ id, onBack }) {
  const { user } = useAuth(); // Cek user login
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk Mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [misiInput, setMisiInput] = useState('');

  // Cek apakah user yang login adalah pemilik profil ini
  const isOwner = user && data && user.id === data.id;

  useEffect(() => {
    if(id) {
      getCandidateDetail(id).then(res => {
        setData(res.data);
        setEditForm(res.data); // Siapkan data untuk form edit
        setLoading(false);
      });
    }
  }, [id]);

  // --- FUNGSI VOTING (UNTUK TAMU) ---
  const handleVote = async () => {
    if(confirm(`Apakah Anda yakin ingin memilih ${data.name}?`)) {
      // Gunakan ID tamu dummy atau dari session
      const guestId = localStorage.getItem('voter_session') || 'guest-' + Date.now();
      await submitVote({ candidateId: id, userId: guestId });
      alert('Terima kasih! Suara Anda telah tersimpan.');
      onBack();
    }
  };

  // --- FUNGSI EDIT (UNTUK KANDIDAT) ---
  const handleSave = async () => {
    try {
      await api.updateProfile(data.id, editForm);
      setData(editForm);
      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan perubahan.');
    }
  };

  const handleAddMisi = () => {
    if (misiInput.trim()) {
      setEditForm(prev => ({ ...prev, misi: [...(prev.misi || []), misiInput.trim()] }));
      setMisiInput('');
    }
  };

  const handleRemoveMisi = (idx) => {
    setEditForm(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== idx) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulasi preview (di real app perlu upload dulu ke server)
      setEditForm(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  if(loading) return <div className="h-screen flex items-center justify-center text-slate-500">Memuat profil...</div>;
  if(!data) return <div className="h-screen flex items-center justify-center text-slate-500">Data tidak ditemukan</div>;

  return (
    <div className="bg-white min-h-screen pb-10 font-sans">
      
      {/* --- HEADER GAMBAR --- */}
      <div className="relative h-80 bg-navy-900">
        <img 
          src={isEditing ? editForm.image : data.image} 
          className="w-full h-full object-cover opacity-80" 
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
        
        {/* Tombol Kembali */}
        <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 backdrop-blur p-2 rounded-full text-white hover:bg-white/30 transition z-20">
          <ArrowLeft size={24} />
        </button>

        {/* Tombol Edit Foto (Hanya saat Mode Edit) */}
        {isEditing && (
          <label className="absolute bottom-4 right-4 bg-gold-500 text-navy-900 p-3 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors z-20">
            <Camera size={20} />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        )}

        {/* Info Header (Mode Baca) */}
        {!isEditing && (
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <span className="bg-gold-500 text-navy-900 text-[10px] font-bold px-3 py-1 rounded mb-2 inline-block uppercase tracking-wider shadow-sm">
              Kandidat No. {data.number}
            </span>
            <h1 className="text-3xl font-serif font-bold leading-tight">{data.name}</h1>
            <p className="text-slate-300 text-sm mt-1 opacity-90">{data.title}</p>
          </div>
        )}
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="p-6 -mt-4 bg-white rounded-t-3xl relative z-10">
        
        {/* Tombol Masuk Mode Edit (Hanya untuk Pemilik Akun) */}
        {isOwner && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full mb-6 py-3 border-2 border-navy-900 text-navy-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-navy-900 hover:text-white transition-all"
          >
            <Edit size={18} /> Edit Profil Saya
          </button>
        )}

        {/* --- MODE EDIT --- */}
        {isEditing ? (
          <div className="space-y-5 animate-fade-in">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="font-bold text-navy-900">Edit Informasi</h3>
              <button onClick={() => setIsEditing(false)} className="text-red-500"><X size={20}/></button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Lengkap</label>
              <input className="w-full p-3 bg-slate-50 border rounded-xl font-bold text-navy-900" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Posisi / Slogan</label>
              <input className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Visi</label>
              <textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm h-24" value={editForm.visi} onChange={e => setEditForm({...editForm, visi: e.target.value})}></textarea>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Misi</label>
              <div className="space-y-2 mb-3">
                {editForm.misi?.map((m, i) => (
                  <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-sm flex-1">{m}</span>
                    <button onClick={() => handleRemoveMisi(i)} className="text-red-500"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="flex-1 p-3 border rounded-xl text-sm" placeholder="Tambah Misi..." value={misiInput} onChange={e => setMisiInput(e.target.value)} />
                <button onClick={handleAddMisi} className="bg-navy-900 text-white p-3 rounded-xl"><Plus size={20}/></button>
              </div>
            </div>

            <button onClick={handleSave} className="w-full py-4 bg-gold-500 text-navy-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 mt-4">
              <Save size={20} /> SIMPAN PERUBAHAN
            </button>
          </div>
        ) : (
          /* --- MODE BACA (VIEW ONLY) --- */
          <div className="space-y-8 animate-fade-in">
            
            {/* Section Visi */}
            <div>
              <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span> VISI
              </h3>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-slate-700 italic leading-relaxed text-sm relative">
                <span className="absolute top-2 left-3 text-4xl text-gold-200 font-serif">“</span>
                <span className="relative z-10">{data.visi}</span>
              </div>
            </div>

            {/* Section Misi */}
            <div>
              <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-1.5 h-6 bg-gold-500 rounded-full"></span> MISI
              </h3>
              <ul className="space-y-3">
                {data.misi?.map((m, i) => (
                  <li key={i} className="flex gap-3 text-slate-700 text-sm group">
                    <div className="mt-0.5 bg-white p-1 rounded-full shadow-sm border border-slate-100 group-hover:border-gold-500 transition-colors">
                        <CheckCircle size={16} className="text-gold-500" />
                    </div>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tombol Coblos (Hanya untuk Tamu / Bukan Pemilik) */}
            {!isOwner && (
              <div className="pt-4">
                <button 
                  onClick={handleVote} 
                  className="w-full py-4 bg-navy-900 text-white font-bold rounded-2xl shadow-xl shadow-navy-900/20 hover:bg-gold-500 hover:text-navy-900 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <Vote size={20} />
                  </div>
                  COBLOS KANDIDAT INI
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                  Pilihan Anda bersifat rahasia dan tidak dapat diubah.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}