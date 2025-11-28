import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth'; // Cek Auth
import { Newspaper, ChevronRight, Edit3, Calendar, Vote, X } from 'lucide-react';

export default function GuestHome({ setPage }) {
  const { user } = useAuth(); // Ambil status login
  const [timeLeft, setTimeLeft] = useState('');
  const [news, setNews] = useState([]);
  
  // State untuk Edit Timer
  const [targetDate, setTargetDate] = useState(() => localStorage.getItem('election_date') || '2025-12-30T00:00');
  const [showEditTimer, setShowEditTimer] = useState(false);
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    // 1. Fetch Berita
    api.getNews(1, 3).then(res => setNews(res.data || []));

    // 2. Countdown Logic
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const dist = target - now;

      if (dist < 0) {
        setTimeLeft("WAKTU HABIS");
      } else {
        const days = Math.floor(dist / (1000 * 60 * 60 * 24));
        const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days} Hari ${hours} Jam ${minutes} Menit`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // Re-run jika targetDate berubah

  // Handler Simpan Tanggal Baru
  const handleSaveTimer = () => {
    if (tempDate) {
      setTargetDate(tempDate);
      localStorage.setItem('election_date', tempDate); // Simpan ke browser
      setShowEditTimer(false);
      alert('Waktu pemilihan berhasil diubah!');
    }
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-navy-900 p-8 pt-16 rounded-b-[3rem] text-center text-white shadow-xl relative overflow-hidden">
        {/* Dekorasi */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-[80px] opacity-20"></div>
        
        <h1 className="text-3xl font-serif font-bold text-white mb-2 relative z-10">
          COBLOS <span className="text-gold-500 italic">AKU</span>
        </h1>
        <p className="text-slate-300 text-xs tracking-widest uppercase mb-6 relative z-10">Batas Waktu Pemilihan</p>
        
        {/* TIMER BOX */}
        <div className="relative inline-block group z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-xl md:text-3xl font-mono font-bold text-gold-500 tracking-wider">
              {timeLeft || 'Loading...'}
            </div>
          </div>
          
          {/* Tombol Edit (Hanya Muncul Jika User = Kandidat/Admin) */}
          {user && (
            <button 
              onClick={() => {
                setTempDate(targetDate);
                setShowEditTimer(true);
              }}
              className="absolute -top-3 -right-3 bg-white text-navy-900 p-2 rounded-full shadow-lg hover:bg-gold-500 transition-all transform hover:scale-110"
              title="Ubah Waktu"
            >
              <Edit3 size={16} />
            </button>
          )}
        </div>

        {/* TOMBOL MULAI MEMILIH (PINTASAN) */}
        <div className="mt-8 relative z-10">
          <button 
            onClick={() => setPage('kandidat')}
            className="bg-gold-500 text-navy-900 font-bold px-8 py-3 rounded-full shadow-lg shadow-gold-500/20 hover:bg-white hover:scale-105 transition-all flex items-center gap-2 mx-auto"
          >
            <Vote size={20} />
            MULAI MEMILIH SEKARANG
          </button>
        </div>
      </div>

      {/* --- MODAL EDIT TIMER --- */}
      {showEditTimer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative animate-slide-up shadow-2xl">
            <button onClick={() => setShowEditTimer(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
              <X size={20} />
            </button>
            
            <h3 className="font-bold text-lg text-navy-900 mb-4 flex items-center gap-2">
              <Calendar className="text-gold-500" size={20}/> Atur Waktu Pemilihan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Pilih Tanggal & Jam Berakhir</label>
                <input 
                  type="datetime-local" 
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold text-navy-900 focus:border-gold-500 outline-none"
                />
              </div>
              <button 
                onClick={handleSaveTimer}
                className="w-full bg-navy-900 text-white py-3 rounded-xl font-bold hover:bg-gold-500 hover:text-navy-900 transition-all"
              >
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION BERITA --- */}
      <div className="p-6 relative z-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900 text-lg border-l-4 border-gold-500 pl-3">Kabar Terkini</h2>
          <button onClick={() => setPage('berita')} className="text-xs text-slate-500 flex items-center gap-1 hover:text-navy-900">
            Lihat Semua <ChevronRight size={14}/>
          </button>
        </div>

        <div className="space-y-4">
          {news.map(n => (
            <div key={n.id} className="bg-white p-4 rounded-xl shadow-soft border border-slate-100 flex gap-4 items-start hover:shadow-md transition-all cursor-pointer" onClick={() => setPage('berita')}>
              <div className="bg-navy-50 p-3 rounded-lg text-navy-900 shrink-0">
                <Newspaper size={20} />
              </div>
              <div>
                <h3 className="font-bold text-navy-900 text-sm leading-snug line-clamp-2">{n.title}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-2">
                  {new Date(n.date || Date.now()).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}