import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Ambil data hasil vote
    const fetch = () => {
      api.getResults().then(res => {
        if(res.success) {
            setResults(res.data);
            setTotal(res.total);
        }
      });
    };
    fetch();
    const interval = setInterval(fetch, 5000); // Auto refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 py-8 pb-24 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-navy-900 mb-6 font-serif border-l-4 border-gold-500 pl-3">Hasil Sementara</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 mb-6 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Suara Masuk</p>
        <p className="text-5xl font-bold text-navy-900">{total}</p>
      </div>

      <div className="space-y-4">
        {results.map(r => (
          <div key={r.id} className="bg-white p-5 rounded-xl shadow-soft border border-slate-100">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-navy-900 text-lg">{r.name}</span>
              <span className="font-bold text-gold-600 text-xl">{r.percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-navy-900 to-blue-800 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${r.percentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">{r.count} Suara</p>
          </div>
        ))}
      </div>
    </div>
  );
}