import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';

// COMPONENTS
import MobileNavbar from './components/MobileNavbar';
import DesktopNavbar from './components/DesktopNavbar';

// PAGES (Lazy Load)
const GuestHome = lazy(() => import('./pages/GuestHome'));
const KandidatPage = lazy(() => import('./pages/KandidatPage'));
const CandidateDetailPage = lazy(() => import('./pages/CandidateDetailPage'));
const BeritaPage = lazy(() => import('./pages/BeritaPage'));
const BeritaDetailPage = lazy(() => import('./pages/BeritaDetailPage'));
const CandidateLogin = lazy(() => import('./pages/CandidateLogin'));
const GuestResults = lazy(() => import('./pages/GuestResults'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Loader
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-gold-500 border-t-navy-900 rounded-full animate-spin"></div>
      <p className="text-navy-900 text-xs font-bold mt-4 animate-pulse">MEMUAT...</p>
    </div>
  </div>
);

function App() {
  const { user } = useAuth(); // User = Kandidat (jika login)

  // --- 1. INISIALISASI STATE DARI LOCALSTORAGE (Agar Tidak Reset saat Reload) ---
  
  const [page, setPage] = useState(() => {
    // Cek apakah ada halaman tersimpan, jika tidak default ke 'login'
    return localStorage.getItem('last_page') || 'login';
  });

  const [selectedId, setSelectedId] = useState(() => {
    // Cek ID kandidat terakhir yang dibuka
    const saved = localStorage.getItem('last_selected_id');
    return saved ? JSON.parse(saved) : null;
  });

  const [newsId, setNewsId] = useState(() => {
    // Cek ID berita terakhir yang dibuka
    const saved = localStorage.getItem('last_news_id');
    return saved ? JSON.parse(saved) : null;
  });

  // --- 2. SIMPAN KE LOCALSTORAGE SETIAP KALI BERUBAH ---

  useEffect(() => {
    localStorage.setItem('last_page', page);
  }, [page]);

  useEffect(() => {
    if (selectedId) localStorage.setItem('last_selected_id', JSON.stringify(selectedId));
    else localStorage.removeItem('last_selected_id'); // Hapus jika null
  }, [selectedId]);

  useEffect(() => {
    if (newsId) localStorage.setItem('last_news_id', JSON.stringify(newsId));
    else localStorage.removeItem('last_news_id'); // Hapus jika null
  }, [newsId]);


  // --- NAVIGASI ---
  const handleNavigate = (target) => {
    setPage(target);
    window.scrollTo(0, 0);
  };

  const goToCandidateDetail = (id) => { 
    setSelectedId(id); 
    setPage('detail-kandidat'); 
  };
  
  const goToNewsDetail = (id) => { 
    setNewsId(id); 
    setPage('detail-berita'); 
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {/* LOGIN */}
        {page === 'login' && <CandidateLogin setPage={handleNavigate} />}
        
        {/* BERANDA */}
        {page === 'home' && <GuestHome setPage={handleNavigate} />}
        
        {/* KANDIDAT */}
        {page === 'kandidat' && <KandidatPage onDetail={goToCandidateDetail} />}
        {page === 'detail-kandidat' && <CandidateDetailPage id={selectedId} onBack={() => handleNavigate('kandidat')} />}
        
        {/* BERITA */}
        {page === 'berita' && <BeritaPage onDetail={goToNewsDetail} />}
        {page === 'detail-berita' && <BeritaDetailPage id={newsId} onBack={() => handleNavigate('berita')} />}
        
        {/* HASIL */}
        {page === 'hasil' && <GuestResults />}
        
        {/* PROFIL */}
        {page === 'profile' && <ProfilePage onLogout={() => handleNavigate('login')} />}
      </Suspense>
    );
  };

  // Navbar Logic
  const showNavbar = !['login', 'detail-kandidat', 'detail-berita'].includes(page);

  return (
    <div className="bg-slate-50 h-full w-full flex flex-col overflow-hidden relative">
      {showNavbar && <div className="flex-none hidden md:block"><DesktopNavbar page={page} setPage={handleNavigate} /></div>}
      
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 md:pb-0 w-full">
        {renderContent()}
      </main>

      {showNavbar && <MobileNavbar page={page} setPage={handleNavigate} />}
    </div>
  );
}

export default App;