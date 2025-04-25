// client/src/pages/dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';

export default function DashboardPage() {
  const token = localStorage.getItem('token');
  const [logs, setLogs] = useState([]);
  const [daysBack, setDaysBack] = useState(30);
  const [minMin, setMinMin] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ───────── fetch all logs on mount ───────── */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('http://localhost:5001/api/logdata', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const raw = await res.json();
        // normalize array response
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.logs)
          ? raw.logs
          : Array.isArray(raw.data)
          ? raw.data
          : [];
        // compute minutes per shift
        const withMinutes = arr.map(log => {
          const start = new Date(log.checkIn);
          const end = new Date(log.checkOut);
          return { ...log, minutes: Math.round((end - start) / 60000) };
        });
        setLogs(withMinutes);
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* ───────── apply filters & compute total ───────── */
  const filtered = useMemo(() => {
    const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
    return logs.filter(
      log =>
        new Date(log.checkIn).getTime() >= cutoff &&
        log.minutes >= minMin
    );
  }, [logs, daysBack, minMin]);

  const totalMinutes = filtered.reduce((sum, log) => sum + log.minutes, 0);

  /* ───────── render ───────── */
  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerMenu />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Activity</h1>

        {/* ───────── filters ───────── */}
        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            Show last
            <input
              type="number"
              min={1}
              value={daysBack}
              onChange={e => setDaysBack(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
            />
            days
          </label>
          <label className="flex items-center gap-2 text-sm">
            Minimum length
            <input
              type="number"
              min={0}
              value={minMin}
              onChange={e => setMinMin(Number(e.target.value))}
              className="w-24 border rounded px-2 py-1"
            />
            minutes
          </label>
        </div>

        {/* ───────── total minutes ───────── */}
        <p className="font-medium mb-4">
          Total minutes: {totalMinutes}
        </p>

        {/* ───────── table ───────── */}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border text-left">Date</th>
                  <th className="px-3 py-2 border text-left">Check In</th>
                  <th className="px-3 py-2 border text-left">Check Out</th>
                  <th className="px-3 py-2 border text-center">Minutes</th>
                  <th className="px-3 py-2 border text-left">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map(log => (
                    <tr key={log._id} className="even:bg-gray-50">
                      <td className="px-3 py-2 border">
                        {new Date(log.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 border">
                        {new Date(log.checkIn).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2 border">
                        {new Date(log.checkOut).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2 border text-center">
                        {log.minutes}
                      </td>
                      <td className="px-3 py-2 border break-words max-w-xs">
                        {log.tasksDesc}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      No entries match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
