import { useEffect, useState } from 'react';
import { getNewsDetail } from '../api';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';
import LazyImage from '../components/LazyImage';

export default function BeritaDetailPage({ id, onBack }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(id) {
      setLoading(true);
      getNewsDetail(id).then(res => {
        setNews(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-navy-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <p className="mb-4">Berita tidak ditemukan.</p>
        <button onClick={onBack} className="text-navy-900 font-bold hover:underline">Kembali</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* --- HEADER --- */}
      {/* Menggunakan gambar berita sebagai background header jika ada */}
      <div className="relative h-[40vh] md:h-[50vh] bg-navy-900 overflow-hidden">
        {news.image ? (
          <LazyImage src={news.image} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-900 to-slate-800 opacity-90 flex items-center justify-center">
            <FileText size={64} className="text-white/20" />
          </div>
        )}
        
        {/* Gradient Overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent"></div>

        {/* Tombol Kembali */}
        <button 
          onClick={onBack} 
          className="absolute top-safe-top left-4 mt-4 md:mt-6 md:left-6 bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/20 transition-all z-20 border border-white/20"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Judul & Meta Data di Header */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 max-w-4xl mx-auto left-0 right-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gold-500 text-navy-900 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              {news.category || 'Info'}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight mb-4 shadow-sm">
            {news.title}
          </h1>

          <div className="flex items-center gap-6 text-slate-300 text-xs md:text-sm font-medium border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gold-500"/>
              <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gold-500"/>
              <span>{news.author || 'Admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- KONTEN ARTIKEL --- */}
      <div className="px-4 md:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-t-3xl shadow-xl max-w-3xl mx-auto p-6 md:p-10 min-h-[500px]">
          
          {/* Isi Berita */}
          <article className="prose prose-slate max-w-none">
            {/* Mengubah line breaks menjadi paragraf agar lebih rapi */}
            {news.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-700 leading-loose text-justify mb-4 text-sm md:text-base">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Penutup / Footer Konten */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 italic">
              Informasi ini dipublikasikan untuk kepentingan Pemilihan Umum.
            </p>
            <div className="mt-4">
              <button 
                onClick={onBack}
                className="text-navy-900 font-bold text-sm hover:text-gold-600 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft size={16}/> Kembali ke Daftar Berita
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}