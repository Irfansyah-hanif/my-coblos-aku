import { Vote, ChevronRight } from 'lucide-react';

export default function HomePage({ setPage }) {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Hero Section yang Elegan */}
      <div className="bg-navy-900 px-8 pt-16 pb-20 rounded-b-[3rem] shadow-xl text-center relative overflow-hidden">
        {/* Dekorasi Latar Belakang Abstrak (Opsional) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-24 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide">
              COBLOS <span className="text-gold-500 font-serif italic">AKU</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-light tracking-wider uppercase mt-3">
              Suara Masa Depan Bangsa
            </p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="px-6 -mt-10 relative z-20 space-y-6 max-w-lg mx-auto">
        
        {/* Card Utama: Mulai Memilih */}
        <div 
          onClick={() => setPage('kandidat')} 
          className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-5">
            <div className="bg-navy-50 p-4 rounded-xl text-navy-900 group-hover:bg-navy-900 group-hover:text-gold-500 transition-colors duration-300">
                <Vote size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-navy-900 mb-1">Mulai Memilih</h3>
              <p className="text-sm text-slate-500 font-light">Lihat kandidat & berikan suara</p>
            </div>
          </div>
          <div className="text-slate-300 group-hover:text-gold-500 transition-colors">
              <ChevronRight size={24} />
          </div>
        </div>
        
        {/* Card Info: Selamat Datang */}
        <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 text-center">
          <h3 className="font-bold text-lg text-navy-900 mb-3">Selamat Datang!</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Platform pemilihan elektronik yang menjunjung tinggi integritas. Gunakan hak suara Anda secara bijak, jujur, dan adil untuk masa depan yang lebih baik.
          </p>
          <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-gold-500 rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
}