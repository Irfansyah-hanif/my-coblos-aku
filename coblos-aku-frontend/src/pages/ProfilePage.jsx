import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import { User, LogOut, Camera, Save, Plus, Trash2 } from 'lucide-react';

export default function ProfilePage({ onLogout }) {
  const { user, logout, loginCandidate } = useAuth(); 
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    title: user?.title || '',
    visi: user?.visi || '',
    misi: user?.misi || [],
    image: user?.image || ''
  });
  const [misiInput, setMisiInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        title: user.title || '',
        visi: user.visi || '',
        misi: user.misi || [],
        image: user.image || ''
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, image: URL.createObjectURL(file) });
  };

  const handleAddMisi = () => {
    if (misiInput.trim()) {
      setProfile(prev => ({ ...prev, misi: [...prev.misi, misiInput.trim()] }));
      setMisiInput('');
    }
  };

  const handleRemoveMisi = (index) => {
    setProfile(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile(user.id, profile);
      loginCandidate({ ...user, ...profile });
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      alert('Gagal menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = () => {
    if (confirm(user ? "Keluar dari akun kandidat?" : "Keluar dari mode tamu?")) {
      logout();
      if (onLogout) onLogout();
    }
  };

  // --- TAMPILAN TAMU ---
  if (!user) {
    return (
      // PERBAIKAN: Hapus 'min-h-screen' dan kurangi padding bawah
      <div className="p-6 pb-10 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100 mt-10">
          <div className="w-24 h-24 bg-navy-900 rounded-full mx-auto flex items-center justify-center text-gold-500 mb-4 border-4 border-slate-100 shadow-lg">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy-900">Pengguna Tamu</h2>
          <p className="text-sm text-slate-500 mt-1">Anda memiliki akses terbatas.</p>
          
          <div className="mt-8 border-t pt-6">
            <button onClick={handleLogoutClick} className="flex items-center justify-center gap-2 w-full text-red-500 font-bold text-sm py-3 hover:bg-red-50 rounded-xl transition">
              <LogOut size={18} /> KELUAR APLIKASI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN KANDIDAT ---
  return (
    // PERBAIKAN: Hapus 'min-h-screen'
    <div className="px-6 py-8 pb-10 bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900 border-l-4 border-gold-500 pl-3">Edit Profil</h2>
        <button onClick={handleLogoutClick} className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded-lg">LOGOUT</button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 space-y-6">
        
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 mb-3 group">
            <img src={profile.image || 'https://via.placeholder.com/150'} className="w-full h-full rounded-full object-cover border-4 border-slate-100 shadow-md" />
            <label className="absolute bottom-0 right-0 bg-gold-500 text-white p-2 rounded-full cursor-pointer hover:bg-gold-600 shadow-lg">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <p className="text-[10px] text-slate-400">Ketuk kamera untuk ganti foto</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Nama Lengkap</label>
            <input className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-bold" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Slogan / Jabatan</label>
            <input className="w-full p-3 bg-slate-50 border rounded-xl text-sm" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1">Visi</label>
            <textarea className="w-full p-3 bg-slate-50 border rounded-xl text-sm" rows="3" value={profile.visi} onChange={e => setProfile({...profile, visi: e.target.value})}></textarea>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-2">Misi</label>
            <ul className="space-y-2 mb-3">
              {profile.misi.map((m, i) => (
                <li key={i} className="flex justify-between bg-blue-50 p-2 rounded-lg text-xs text-navy-800">
                  <span>• {m}</span>
                  <button onClick={() => handleRemoveMisi(i)} className="text-red-500"><Trash2 size={14}/></button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input type="text" className="flex-1 p-3 bg-slate-50 border rounded-xl text-sm" placeholder="Tambah misi..." value={misiInput} onChange={e => setMisiInput(e.target.value)} />
              <button onClick={handleAddMisi} className="bg-navy-900 text-white w-12 rounded-xl flex items-center justify-center hover:bg-gold-500"><Plus size={20}/></button>
            </div>
          </div>
        </div>

        <button onClick={handleSaveProfile} disabled={isSaving} className="w-full py-3 bg-gold-500 text-navy-900 font-bold rounded-xl shadow-lg hover:bg-gold-600 transition-all flex items-center justify-center gap-2">
          <Save size={18} /> {isSaving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
        </button>
      </div>
      
      {/* Spacer untuk memastikan konten terbawah tidak tertutup navbar di HP */}
      <div className="h-10"></div>
    </div>
  );
}