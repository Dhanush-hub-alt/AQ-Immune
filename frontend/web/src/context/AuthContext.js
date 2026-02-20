import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@services/firebase';
const AuthContext = createContext({ user: null, role: null, loading: true });
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            setLoading(false);
            if (u) {
                try {
                    const ref = doc(db, 'users', u.uid);
                    const snap = await getDoc(ref);
                    if (snap.exists())
                        setRole(snap.data().role || 'user');
                    else
                        setRole('user');
                }
                catch (err) {
                    setRole('user');
                }
            }
            else {
                setRole(null);
            }
        });
        return () => unsub();
    }, []);
    return (_jsx(AuthContext.Provider, { value: { user, role, loading }, children: children }));
};
export const useAuth = () => useContext(AuthContext);
