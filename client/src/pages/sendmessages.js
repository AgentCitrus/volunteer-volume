import { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';

export default function SendMessagePage() {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/userdata', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u.role === 'volunteer')))
      .catch(console.error);
  }, []);

  const handleSend = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5001/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipient: recipientId || null, content }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setMessage('Message sent!');
        setContent('');
        setRecipientId('');
      })
      .catch(() => setMessage('Failed to send'));
  };

  return (
    <div className="p-4">
    <header className="flex items-center mb-8">
                <HamburgerMenu />
                <h1 className="text-2xl font-bold mb-4">Send a Message</h1>
    </header>

      {message && <p className="mb-4">{message}</p>}

      <select
        value={recipientId}
        onChange={e => setRecipientId(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="">Broadcast to all</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Type your message..."
        className="border p-2 w-full h-40 mb-4"
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}