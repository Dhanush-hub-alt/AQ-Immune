import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@services/firebase';
export const AlertsBell = () => {
    const [count, setCount] = useState(0);
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const items = [];
            snap.forEach(d => items.push({ id: d.id, ...d.data() }));
            setAlerts(items);
            setCount(items.filter(a => !a.read).length);
            // show newest as toast
            if (items[0]) {
                const a = items[0];
                if (!a.read)
                    toast.custom(() => _jsxs("div", { className: "p-3 glass-card", children: [a.title || 'Alert', " \u2014 ", a.message] }));
            }
        });
        return () => unsub();
    }, []);
    return (_jsxs("div", { className: "relative", children: [_jsx("button", { className: "p-2 rounded-md hover:bg-slate-800/40", "aria-label": "Alerts", children: _jsx(Bell, { className: "text-cyan-300" }) }), count > 0 && _jsx("span", { className: "absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full", children: count })] }));
};
export default AlertsBell;
