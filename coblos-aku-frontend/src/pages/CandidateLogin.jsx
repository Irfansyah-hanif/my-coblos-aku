import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function CandidateLogin({ setPage }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { loginCandidate } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username dan Password wajib diisi');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.login(formData);
      if (res.success) {
        loginCandidate(res.user);
        // Halaman akan otomatis pindah ke Dashboard karena state user berubah
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Koneksi gagal. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Kartu Login */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Biru */}
        <div className="bg-navy-900 p-8 text-center relative overflow-hidden">
          {/* Efek Glow Emas */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500 rounded-full blur-[60px] opacity-20"></div>
          
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Sistem Pemilihan Kandidat
          </h1>
          <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest">
            Masuk untuk melanjutkan
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Username */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-navy-900 focus:bg-white transition-all text-navy-900 placeholder:text-slate-400" 
                  placeholder="Masukkan username" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input 
                  type={showPass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-navy-900 focus:bg-white transition-all text-navy-900 placeholder:text-slate-400" 
                  placeholder="Masukkan password" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400 hover:text-navy-900">
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button type="submit" disabled={loading} className="w-full bg-navy-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-navy-800 active:scale-95 transition-all text-sm flex justify-center items-center gap-2">
              {loading ? 'Memproses...' : 'LOGIN KANDIDAT'}
            </button>
          </form>

          {/* Divider Atau */}
          <div className="mt-8 relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] uppercase tracking-wide font-semibold">Atau</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Tombol Tamu */}
          <button 
            onClick={() => setPage('home')}
            className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:border-gold-500 hover:text-gold-600 hover:bg-gold-50 transition-all flex justify-center items-center gap-2 text-sm group"
          >
            Masuk sebagai Tamu <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
          </button>

          {/* Link Daftar */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun?{' '}
              <button onClick={() => setPage('register')} className="text-navy-900 font-bold hover:underline">
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 mt-8 font-medium">© 2025 Coblos-Aku E-Voting System</p>
    </div>
  );
}