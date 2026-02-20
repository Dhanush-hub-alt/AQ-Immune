import { collection, onSnapshot, query, orderBy, limit, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@services/firebase';
import { requestPrediction } from './api';

const ALERT_THROTTLE_MS = 1000 * 60 * 10; // 10 minutes per device
const pm25Threshold = 100;
const co2Threshold = 800;

const lastAlertTime: Map<string, number> = new Map();

function shouldThrottle(deviceId: string) {
  const last = lastAlertTime.get(deviceId) || 0;
  const now = Date.now();
  if (now - last < ALERT_THROTTLE_MS) return true;
  lastAlertTime.set(deviceId, now);
  return false;
}

export function startAlertsMonitor() {
  const q = query(collection(db, 'sensorData'), orderBy('ts', 'desc'), limit(200));
  const unsub = onSnapshot(q, async (snap) => {
    try {
      const seen = new Set<string>();
      for (const d of snap.docs) {
        const data = d.data() as any;
        const deviceId = data.deviceId || d.id;
        if (seen.has(deviceId)) continue; // only latest per device
        seen.add(deviceId);

        if (shouldThrottle(deviceId)) continue;

        if ((data.pm25 || 0) > pm25Threshold) {
          await addDoc(collection(db, 'alerts'), { deviceId, title: 'High PM2.5', message: `PM2.5 ${data.pm25}`, createdAt: new Date(), read: false });
        }

        if ((data.co2 || 0) > co2Threshold) {
          await addDoc(collection(db, 'alerts'), { deviceId, title: 'High CO2', message: `CO2 ${data.co2}`, createdAt: new Date(), read: false });
        }

        // predictive: gather history for device and call prediction endpoint
        try {
          const hisQ = query(collection(db, 'sensorData'), orderBy('ts', 'desc'), limit(48));
          const docs = await getDocs(hisQ);
          const history: number[] = [];
          docs.forEach(doc => {
            const d = doc.data() as any;
            if ((d.deviceId || doc.id) === deviceId) {
              history.push(d.pm25 || 0);
            }
          });

          if (history.length > 6) {
            const res = await requestPrediction({ deviceId, history: history.reverse() });
            if (res && res.data) {
              const preds = res.data.predictions24 || res.data.predictions6 || [];
              const maxPred = Math.max(...preds.slice(0, 24));
              if (maxPred > pm25Threshold) {
                await addDoc(collection(db, 'alerts'), { deviceId, title: 'Predictive Hazard', message: `Model predicts PM2.5 up to ${maxPred.toFixed(1)} in next 24h`, createdAt: new Date(), read: false });
              }
            }
          }
        } catch (e) {
          // ignore prediction errors
        }
      }
    } catch (err) {
      console.warn('alerts monitor error', err);
    }
  });

  return unsub;
}

export default startAlertsMonitor;
