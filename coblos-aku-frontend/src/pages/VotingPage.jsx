import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Vote, CheckCircle, AlertCircle } from 'lucide-react';
import LazyImage from '../components/LazyImage';

export default function VotingPage({ setPage }) {
  const { user } = useAuth(); // Cek status login
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Ambil data kandidat
    api.getCandidates().then(res => setCandidates(res.data || []));
    
    // Cek apakah user tamu sudah pernah vote (simpan status di localStorage sederhana)
    const votedStatus = localStorage.getItem('has_voted');
    if (votedStatus) setHasVoted(true);
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    if (confirm(`Anda yakin ingin mencoblos Paslon No. ${selectedCandidate.number} - ${selectedCandidate.name}?`)) {
      try {
        const guestId = localStorage.getItem('voter_session') || 'guest-' + Date.now();
        const res = await api.submitVote({ candidateId: selectedCandidate.id, userId: guestId });
        
        if (res.success) {
          localStorage.setItem('has_voted', 'true');
          setHasVoted(true);
          alert('Suara Anda berhasil masuk! Terima kasih telah memilih.');
          setPage('hasil'); // Arahkan ke hasil setelah memilih
        } else {
          alert('Gagal memilih: ' + res.message);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat mengirim suara.');
      }
    }
  };

  // Jika User adalah Kandidat (Admin), tidak boleh vote
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <AlertCircle size={64} className="text-gold-500 mb-4" />
        <h2 className="text-xl font-bold text-navy-900">Akses Voting Dibatasi</h2>
        <p className="text-slate-500 text-sm mt-2">Akun Kandidat tidak dapat melakukan voting di bilik suara.</p>
        <button onClick={() => setPage('home')} className="mt-6 text-navy-900 font-bold underline">Kembali ke Beranda</button>
      </div>
    );
  }

  // Jika Tamu sudah vote
  if (hasVoted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-navy-900">Anda Sudah Memilih!</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Terima kasih telah berpartisipasi. Satu suara sangat berarti untuk masa depan.</p>
        <button onClick={() => setPage('hasil')} className="mt-8 bg-navy-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gold-500 transition-colors">
          LIHAT HASIL SEMENTARA
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {/* Header Bilik Suara */}
      <div className="bg-navy-900 pt-10 pb-16 px-6 rounded-b-[3rem] text-center shadow-xl">
        <h1 className="text-2xl font-serif font-bold text-white flex items-center justify-center gap-2">
          <Vote className="text-gold-500" /> Bilik Suara
        </h1>
        <p className="text-slate-300 text-xs mt-1">Pilih satu kandidat terbaik pilihanmu</p>
      </div>

      {/* Surat Suara (Grid Kandidat) */}
      <div className="px-6 -mt-10 relative z-10 space-y-4">
        {candidates.map(k => {
          const isSelected = selectedCandidate?.id === k.id;
          return (
            <div 
              key={k.id}
              onClick={() => setSelectedCandidate(k)}
              className={`relative bg-white rounded-2xl p-4 shadow-sm border-2 transition-all cursor-pointer flex items-center gap-4 ${
                isSelected ? 'border-gold-500 shadow-lg bg-gold-50/50 scale-[1.02]' : 'border-transparent hover:border-slate-200'
              }`}
            >
              {/* Radio Indicator */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'border-gold-500 bg-gold-500 text-white' : 'border-slate-300'
              }`}>
                {isSelected && <CheckCircle size={16} />}
              </div>

              {/* Foto */}
              <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden shrink-0">
                {k.image ? <LazyImage src={k.image} className="w-full h-full"/> : <div className="w-full h-full bg-navy-50"></div>}
              </div>

              {/* Info */}
              <div className="flex-1">
                <span className="text-[10px] font-bold bg-navy-900 text-white px-2 py-0.5 rounded">No. {k.number}</span>
                <h3 className="font-bold text-navy-900 text-lg leading-tight mt-1">{k.name}</h3>
                <p className="text-xs text-slate-500">{k.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Coblos Fixed di Bawah */}
      <div className="fixed bottom-20 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none">
        <button 
          onClick={handleVote}
          disabled={!selectedCandidate}
          className={`w-full py-4 rounded-xl font-bold shadow-xl transition-all pointer-events-auto flex items-center justify-center gap-2 ${
            selectedCandidate 
              ? 'bg-gold-500 text-navy-900 hover:bg-gold-400 transform translate-y-0' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed translate-y-20 opacity-0'
          }`}
        >
          <Vote size={20} /> COBLOS SEKARANG
        </button>
      </div>
    </div>
  );
}