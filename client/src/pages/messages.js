import { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/messages/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(setMessages)
      .catch(() => setError("Couldn't load messages"));
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4">
        <header className="flex items-center mb-8">
                        <HamburgerMenu />
                        <h1 className="text-2xl font-bold mb-4">View Messages</h1>
            </header>
      {messages.length === 0 && <p>No messages</p>}
      <ul className="space-y-4">
        {messages.map(m => (
          <li key={m._id} className="border rounded-md p-4 shadow">
            <div className="text-sm text-gray-500">
              From: {m.sender?.firstName} {m.sender?.lastName || '(unknown)'}
            </div>
            <div className="text-sm text-gray-500">
              Sent: {new Date(m.sentAt).toLocaleString()}
            </div>
            <p className="mt-2">{m.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}