import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@services/firebase';
import { postSensorData } from '@services/api';
import toast from 'react-hot-toast';

export const ManualEntryForm: React.FC = () => {
  const [form, setForm] = useState<any>({ deviceId: '', temp: '', hum: '', pm25: '', pm10: '', co2: '', lat: '', lng: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      deviceId: form.deviceId || `manual-${Date.now()}`,
      temp: parseFloat(form.temp) || null,
      hum: parseFloat(form.hum) || null,
      pm25: parseFloat(form.pm25) || null,
      pm10: parseFloat(form.pm10) || null,
      co2: parseFloat(form.co2) || null,
      lat: parseFloat(form.lat) || null,
      lng: parseFloat(form.lng) || null,
      ts: serverTimestamp(),
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, 'sensorData'), payload as any);
      // Post to backend if configured
      try { await postSensorData(payload); } catch (err) { /* ignore */ }
      toast.success('Sensor data submitted');
      setForm({ deviceId: '', temp: '', hum: '', pm25: '', pm10: '', co2: '', lat: '', lng: '' });
    } catch (err) {
      toast.error('Failed to submit');
    } finally { setLoading(false); }
  };

  return (
    <form className="glass-card p-6 space-y-4" onSubmit={submit}>
      <h3 className="text-lg font-semibold">Manual Sensor Entry</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={form.deviceId} onChange={e => handleChange('deviceId', e.target.value)} placeholder="Device ID" className="input" />
        <input value={form.temp} onChange={e => handleChange('temp', e.target.value)} placeholder="Temperature (°C)" className="input" />
        <input value={form.hum} onChange={e => handleChange('hum', e.target.value)} placeholder="Humidity (%)" className="input" />
        <input value={form.pm25} onChange={e => handleChange('pm25', e.target.value)} placeholder="PM2.5 (µg/m³)" className="input" />
        <input value={form.pm10} onChange={e => handleChange('pm10', e.target.value)} placeholder="PM10 (µg/m³)" className="input" />
        <input value={form.co2} onChange={e => handleChange('co2', e.target.value)} placeholder="CO2 (ppm)" className="input" />
        <input value={form.lat} onChange={e => handleChange('lat', e.target.value)} placeholder="Latitude" className="input" />
        <input value={form.lng} onChange={e => handleChange('lng', e.target.value)} placeholder="Longitude" className="input" />
      </div>
      <div className="flex items-center space-x-3">
        <button disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit'}</button>
        <button type="button" className="btn-neon" onClick={() => {
          // simulate random pollution
          setForm({ deviceId: `sim-${Date.now()}`, temp: (20 + Math.random()*10).toFixed(1), hum: (40 + Math.random()*30).toFixed(0), pm25: (Math.random()*200).toFixed(1), pm10: (Math.random()*300).toFixed(1), co2: (400 + Math.random()*1000).toFixed(0), lat: (21 + Math.random()).toFixed(6), lng: (105 + Math.random()).toFixed(6) });
        }}>Simulate</button>
      </div>
    </form>
  );
};

export default ManualEntryForm;
