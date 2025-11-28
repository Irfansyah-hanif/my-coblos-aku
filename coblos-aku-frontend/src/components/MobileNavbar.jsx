import { Home, Users, Newspaper, User, PieChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // PERBAIKAN: Cukup naik 1 level (..)

export default function MobileNavbar({ page, setPage }) {
  const { user } = useAuth(); // Cek siapa yang sedang login

  // MENU UNTUK KANDIDAT
  const candidateItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'kandidat', icon: Users, label: 'Kandidat' },
    { id: 'berita', icon: Newspaper, label: 'Berita' },
    { id: 'profile', icon: User, label: 'Profil' }, 
  ];

  // MENU UNTUK TAMU
  const guestItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'kandidat', icon: Users, label: 'Kandidat' },
    { id: 'berita', icon: Newspaper, label: 'Berita' },
    { id: 'hasil', icon: PieChart, label: 'Hasil' }, 
  ];

  const items = user ? candidateItems : guestItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-gold-500/30 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[70px]">
        {items.map((i) => {
          const isActive = page === i.id;
          return (
            <button
              key={i.id}
              onClick={() => setPage(i.id)}
              className="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-300 group"
            >
              {/* Indikator Aktif */}
              <span 
                className={`absolute top-0 w-8 h-1 bg-gold-500 rounded-b-full shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all duration-300 transform ${
                  isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              ></span>

              {/* Icon */}
              <div 
                className={`transition-all duration-300 ${
                  isActive 
                    ? '-translate-y-1 text-gold-500 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <i.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>

              {/* Label */}
              <span 
                className={`text-[9px] mt-1 font-medium tracking-wide transition-all duration-300 ${
                  isActive ? 'text-gold-500 font-bold opacity-100' : 'text-slate-400 opacity-80'
                }`}
              >
                {i.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}