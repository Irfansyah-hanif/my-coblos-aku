import { useState } from 'react';
import { register } from '../api';
import { User, Lock, ArrowLeft, CheckCircle, Shield } from 'lucide-react';

export default function RegisterPage({ setPage }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi
    if (!formData.name || !formData.username || !formData.password || !formData.confirmPassword) {
      return setError('Semua kolom wajib diisi.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Konfirmasi password tidak cocok.');
    }

    setLoading(true);

    try {
      const res = await register({
        name: formData.name,
        username: formData.username,
        password: formData.password
      });

      if (res.success) {
        setSuccess('Pendaftaran berhasil! Silakan login.');
        // Redirect otomatis setelah 2 detik
        setTimeout(() => {
          setPage('login');
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 relative">
        
        <button onClick={() => setPage('login')} className="absolute top-6 left-6 text-slate-400 hover:text-navy-900 transition-colors">
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-navy-900">
            <Shield size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-navy-900">Daftar Akun</h2>
          <p className="text-sm text-slate-500">Buat akun kandidat baru</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6 text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 text-center p-6 rounded-xl border border-green-100 animate-fade-in">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-600" />
            <h3 className="font-bold text-lg mb-1">Berhasil!</h3>
            <p className="text-sm">{success}</p>
            <p className="text-xs text-slate-500 mt-4">Mengalihkan ke halaman login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-navy-900 focus:bg-white outline-none" placeholder="Nama Kandidat" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input type="text" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-navy-900 focus:bg-white outline-none" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                  <input type="password" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-navy-900 focus:bg-white outline-none" placeholder="******" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                  <input type="password" className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-navy-900 focus:bg-white outline-none" placeholder="******" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-navy-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-navy-800 transition-all text-sm mt-2">
              {loading ? 'MENDAFTAR...' : 'DAFTAR SEKARANG'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}