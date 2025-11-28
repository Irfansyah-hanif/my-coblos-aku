import { useEffect, useState } from 'react';
import { api } from '../api';

export default function GuestResults() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Polling setiap 5 detik agar update
    const fetch = () => {
      api.getResults().then(res => {
        setResults(res.data);
        setTotal(res.total);
      });
    };
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 pb-20">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Hasil Sementara</h2>
      <div className="bg-white p-4 rounded-xl shadow mb-6 text-center">
        <p className="text-sm text-slate-500">Total Suara Masuk</p>
        <p className="text-4xl font-bold text-gold-500">{total}</p>
      </div>

      <div className="space-y-4">
        {results.map(r => (
          <div key={r.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-navy-900">{r.name}</span>
              <span className="font-bold text-gold-500">{r.percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-navy-900 h-3 rounded-full transition-all duration-1000" style={{ width: `${r.percentage}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">{r.count} Suara</p>
          </div>
        ))}
      </div>
    </div>
  );
}