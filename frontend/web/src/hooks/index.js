// Custom Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
// Typed hooks for dispatch and selector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
// Custom hook for async operations
export const useAsync = (asyncFunction, immediate = true) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            setStatus('error');
            return null;
        }
    }, [asyncFunction]);
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    return { execute, status, data, error };
};
// Custom hook for debounced value
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};
// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};
// Custom hook for previous value
export const usePrevious = (value) => {
    const [prev, setPrev] = useState();
    useEffect(() => {
        setPrev(value);
    }, [value]);
    return prev;
};
// Custom hook for outside click detection
export const useOutsideClick = (ref) => {
    const [isOutside, setIsOutside] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOutside(true);
            }
            else {
                setIsOutside(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);
    return isOutside;
};
// Custom hook for media query
export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    return matches;
};
// Custom hook for window size
export const useWindowSize = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return size;
};
// Custom hook for previous effect
export const usePreviousEffect = (callback, condition) => {
    const [prevCondition, setPrevCondition] = useState(condition);
    useEffect(() => {
        if (prevCondition !== condition) {
            callback();
            setPrevCondition(condition);
        }
    }, [condition, prevCondition, callback]);
};
// Custom hook for mounted state
export const useIsMounted = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return isMounted;
};
// Custom hook for toggle
export const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback((newValue) => {
        setValue((current) => newValue !== undefined ? newValue : !current);
    }, []);
    return [value, toggle];
};
