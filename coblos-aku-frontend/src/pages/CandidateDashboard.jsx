import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Camera, Save, Plus, Trash2, Edit, FileText, X } from 'lucide-react';
import LazyImage from '../components/LazyImage';

export default function CandidateDashboard() {
  const { user, logout, loginCandidate } = useAuth(); // loginCandidate untuk update session lokal
  const [activeTab, setActiveTab] = useState('profil'); // 'profil' | 'berita'
  
  // State Profil
  const [profile, setProfile] = useState({
    name: user?.name || '',
    title: user?.title || '',
    visi: user?.visi || '',
    misi: user?.misi || [],
    image: user?.image || null
  });
  const [misiInput, setMisiInput] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // State Berita
  const [myNews, setMyNews] = useState([]);
  const [isEditingNews, setIsEditingNews] = useState(false);
  const [newsForm, setNewsForm] = useState({ id: null, title: '', content: '', file: null, existingImage: '' });
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // --- LOGIKA PROFIL ---

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Preview lokal
      setProfile(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
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
    if (!profile.name || !profile.visi || profile.misi.length === 0) {
      alert('Nama, Visi, dan minimal 1 Misi wajib diisi!');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Upload Foto jika ada
      let imageUrl = profile.image;
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('file', profileImageFile);
        // Simulasi upload (ganti dengan api.uploadFile jika backend mendukung)
        // const uploadRes = await api.uploadFile(formData);
        // imageUrl = uploadRes.url;
        console.log('Mengupload foto profil...', profileImageFile.name);
      }

      // 2. Update Data Profil
      const updatedData = { ...profile, image: imageUrl };
      await api.updateProfile(user.id, updatedData);
      
      // Update session lokal agar perubahan langsung terlihat tanpa relogin
      loginCandidate({ ...user, ...updatedData });
      
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- LOGIKA BERITA ---

  useEffect(() => {
    if (activeTab === 'berita') {
      fetchMyNews();
    }
  }, [activeTab]);

  const fetchMyNews = async () => {
    setIsLoadingNews(true);
    try {
      // Ambil semua berita lalu filter punya sendiri (idealnya backend filter by ID)
      const allNews = await api.getNews(1, 100); 
      // Anggap data punya field 'author_id' atau kita filter manual simulasi
      // Di backend real, gunakan endpoint: /api/news?candidate_id=...
      const myData = allNews.data; // Simulasi: Anggap semua data sementara
      setMyNews(myData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('candidateId', user.id);
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      if (newsForm.file) formData.append('file', newsForm.file);

      if (newsForm.id) {
        // Edit Mode
        // await api.updateNews(newsForm.id, formData);
        alert('Berita diperbarui (Simulasi)');
      } else {
        // Create Mode
        await api.postNews(formData);
        alert('Berita berhasil diunggah!');
      }
      
      setIsEditingNews(false);
      setNewsForm({ id: null, title: '', content: '', file: null, existingImage: '' });
      fetchMyNews();
    } catch (error) {
      alert('Gagal menyimpan berita.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        await api.deleteNews(id);
        setMyNews(prev => prev.filter(n => n.id !== id));
        alert('Berita dihapus.');
      } catch (error) {
        alert('Gagal menghapus berita.');
      }
    }
  };

  const openEditNews = (newsItem) => {
    setNewsForm({
      id: newsItem.id,
      title: newsItem.title,
      content: newsItem.content,
      file: null,
      existingImage: newsItem.image
    });
    setIsEditingNews(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* HEADER KANDIDAT */}
      <div className="bg-navy-900 pt-8 pb-16 px-6 rounded-b-[40px] shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-serif font-bold text-white mb-1">
            Dashboard Kandidat
          </h1>
          <p className="text-slate-300 text-xs">Kelola Profil & Kampanye Anda</p>
        </div>
      </div>

      {/* NAVIGASI TAB KANDIDAT */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-2 flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profil' 
                ? 'bg-gold-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Profil Saya
          </button>
          <button 
            onClick={() => setActiveTab('berita')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'berita' 
                ? 'bg-gold-500 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            Berita Kampanye
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="px-6 py-6">
        
        {/* --- TAB PROFIL --- */}
        {activeTab === 'profil' && (
          <div className="space-y-6 animate-fade-in">
            {/* Foto Profil */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-100 shadow-inner">
                  {profile.image ? (
                    <img src={profile.image} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                      <Camera size={40} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-navy-900 text-white p-2 rounded-full cursor-pointer hover:bg-gold-500 transition-colors shadow-lg">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-slate-400">Format: JPG, PNG (Max 2MB)</p>
            </div>

            {/* Form Data Diri */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-gold-500 outline-none"
                  placeholder="Nama Lengkap Kandidat"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Slogan / Jabatan</label>
                <input 
                  type="text" 
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-gold-500 outline-none"
                  placeholder="Contoh: Calon Ketua BEM 2025"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Visi</label>
                <textarea 
                  value={profile.visi}
                  onChange={(e) => setProfile({...profile, visi: e.target.value})}
                  rows="3"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-gold-500 outline-none resize-none"
                  placeholder="Tuliskan visi Anda..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-2">Misi & Program Kerja</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={misiInput}
                    onChange={(e) => setMisiInput(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-gold-500 outline-none"
                    placeholder="Tambah poin misi..."
                  />
                  <button 
                    onClick={handleAddMisi}
                    className="bg-navy-900 text-white p-3 rounded-xl hover:bg-gold-500 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <ul className="space-y-2">
                  {profile.misi.length === 0 && <p className="text-xs text-slate-400 italic">Belum ada misi ditambahkan.</p>}
                  {profile.misi.map((m, i) => (
                    <li key={i} className="flex items-start justify-between bg-slate-50 p-3 rounded-xl text-sm text-slate-700">
                      <span className="flex-1 mr-2">• {m}</span>
                      <button onClick={() => handleRemoveMisi(i)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-4 bg-gold-500 text-white font-bold rounded-xl shadow-lg hover:bg-gold-600 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Save size={20} />
                {isSaving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
              </button>
            </div>
          </div>
        )}

        {/* --- TAB BERITA / KAMPANYE --- */}
        {activeTab === 'berita' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Tombol Tambah Berita */}
            {!isEditingNews && (
              <button 
                onClick={() => setIsEditingNews(true)}
                className="w-full py-4 border-2 border-dashed border-gold-500 text-gold-600 font-bold rounded-xl hover:bg-gold-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} /> BUAT BERITA BARU
              </button>
            )}

            {/* Form Editor Berita */}
            {isEditingNews && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gold-100 relative">
                <button 
                  onClick={() => {
                    setIsEditingNews(false);
                    setNewsForm({ id: null, title: '', content: '', file: null, existingImage: '' });
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
                
                <h3 className="font-bold text-navy-900 mb-4">{newsForm.id ? 'Edit Berita' : 'Berita Baru'}</h3>
                
                <form onSubmit={handleSaveNews} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-gold-500 outline-none"
                      placeholder="Judul Berita Kampanye"
                      required
                    />
                  </div>
                  <div>
                    <textarea 
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                      rows="6"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-gold-500 outline-none resize-none"
                      placeholder="Tulis detail kampanye atau program kerja..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Upload Gambar Berita */}
                  <div>
                    <label className="block text-xs font-bold text-navy-900 mb-2">Gambar / Dokumen Pendukung</label>
                    
                    {(newsForm.existingImage || newsForm.file) && (
                      <div className="mb-3 h-32 w-full bg-slate-100 rounded-lg overflow-hidden">
                        <img 
                          src={newsForm.file ? URL.createObjectURL(newsForm.file) : newsForm.existingImage} 
                          className="w-full h-full object-cover" 
                          alt="Preview"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={(e) => setNewsForm({...newsForm, file: e.target.files[0]})}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100"
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition-colors"
                  >
                    {isSaving ? 'Mengunggah...' : (newsForm.id ? 'UPDATE BERITA' : 'UNGGAH BERITA')}
                  </button>
                </form>
              </div>
            )}

            {/* List Berita */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-700 text-sm pl-2 border-l-4 border-navy-900">Riwayat Berita ({myNews.length})</h3>
              
              {isLoadingNews ? (
                <p className="text-center text-slate-400 text-sm py-4">Memuat...</p>
              ) : myNews.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Belum ada berita kampanye.</p>
                </div>
              ) : (
                myNews.map(news => (
                  <div key={news.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                      {news.image ? (
                        <LazyImage src={news.image} alt={news.title} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                          <FileText size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-navy-900 text-sm line-clamp-1">{news.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{news.content}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-col gap-2 justify-center border-l border-slate-100 pl-4">
                      <button onClick={() => openEditNews(news)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteNews(news.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TOMBOL LOGOUT --- */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => {
              if(confirm('Keluar dari sesi kandidat?')) logout();
            }}
            className="text-red-500 text-sm font-bold hover:bg-red-50 px-6 py-2 rounded-full transition-colors"
          >
            Keluar Aplikasi
          </button>
        </div>

      </div>
    </div>
  );
}