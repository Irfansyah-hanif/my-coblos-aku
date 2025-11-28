import { Vote, Home, Users, Newspaper, User, PieChart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function DesktopNavbar({ page, setPage }) {
  const { user } = useAuth();

  const menus = user 
    ? [
        { id: 'home', label: 'Beranda', icon: Home },
        { id: 'kandidat', label: 'Kandidat', icon: Users },
        { id: 'berita', label: 'Berita', icon: Newspaper },
        { id: 'profile', label: 'Profil', icon: User },
      ]
    : [
        { id: 'home', label: 'Beranda', icon: Home },
        { id: 'kandidat', label: 'Kandidat', icon: Users },
        { id: 'voting', label: 'Bilik Suara', icon: Vote }, // Tambahan
        { id: 'berita', label: 'Berita', icon: Newspaper },
        { id: 'hasil', label: 'Hasil', icon: PieChart },
      ];

  return (
    <nav className="hidden md:block sticky top-0 z-50 bg-navy-900 shadow-lg border-b border-gold-500/30 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
            <div className="bg-white/10 p-2 rounded-xl border border-gold-500/30">
              <Vote className="text-gold-500" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide">
                COBLOS <span className="text-gold-500">AKU</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-4">
            {menus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setPage(menu.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-5 py-2.5 rounded-full ${
                  page === menu.id
                    ? 'bg-gold-500 text-navy-900 shadow-lg font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <menu.icon size={18} />
                {menu.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}