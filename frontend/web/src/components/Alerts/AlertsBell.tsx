import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@services/firebase';

export const AlertsBell: React.FC = () => {
  const [count, setCount] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items: any[] = [];
      snap.forEach(d => items.push({ id: d.id, ...d.data() }));
      setAlerts(items);
      setCount(items.filter(a => !a.read).length);
      // show newest as toast
      if (items[0]) {
        const a = items[0];
        if (!a.read) toast.custom(() => <div className="p-3 glass-card">{a.title || 'Alert'} — {a.message}</div>);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="relative">
      <button className="p-2 rounded-md hover:bg-slate-800/40" aria-label="Alerts">
        <Bell className="text-cyan-300" />
      </button>
      {count > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{count}</span>}
    </div>
  );
};

export default AlertsBell;
