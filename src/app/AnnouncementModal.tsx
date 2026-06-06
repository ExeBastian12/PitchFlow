import { useState, useEffect } from 'react';
import { X, Mail, Loader2, Send, Wand2 } from 'lucide-react';
import { getAccessToken, googleSignIn, auth } from '../lib/firebase';

export default function AnnouncementModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const existingToken = await getAccessToken();
      setToken(existingToken);
    };
    if (isOpen) {
      fetchToken();
    }
  }, [isOpen]);

  const handleAuth = async () => {
    try {
      setError('');
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
    }
  };

  const sendEmail = async () => {
    if (!token) return;
    setIsSending(true);
    setError('');
    
    try {
      const emailLines = [];
      emailLines.push(`To: ${to}`);
      emailLines.push('Content-type: text/html;charset=UTF-8');
      emailLines.push('MIME-Version: 1.0');
      emailLines.push(`Subject: ${subject}`);
      emailLines.push('');
      emailLines.push(body.replace(/\n/g, '<br/>'));
      
      const email = emailLines.join('\r\n');
      const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: base64EncodedEmail,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Failed to send email');
      }

      alert('Announcement sent successfully!');
      onClose();
      setTo('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      setError(err.message || 'Error sending email');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-pitch-dark dark:text-white">Send Announcement</h2>
              <p className="text-sm text-gray-500">Dispatch emails directly to players and parents.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800/30">
              {error}
            </div>
          )}

          {!token ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-bold mb-2 dark:text-white">Connect Gmail</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                PitchFlow needs your permission to send emails on your behalf to players and parents.
              </p>
              <button onClick={handleAuth} className="inline-flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">To</label>
                <input 
                  value={to} 
                  onChange={e=>setTo(e.target.value)} 
                  disabled={isSending}
                  type="email" 
                  placeholder="parent@example.com, roster@club.com" 
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 dark:text-white transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Subject</label>
                <input 
                  value={subject} 
                  onChange={e=>setSubject(e.target.value)} 
                  disabled={isSending}
                  type="text" 
                  placeholder="e.g. Schedule Update for U15" 
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 dark:text-white transition-colors" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 dark:text-gray-300">Message</label>
                <textarea 
                  value={body} 
                  onChange={e=>setBody(e.target.value)} 
                  disabled={isSending}
                  placeholder="Type your announcement here..." 
                  rows={6}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500 custom-scrollbar dark:text-white resize-none transition-colors" 
                />
              </div>
            </div>
          )}
        </div>
        
        {token && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
            <button 
              disabled={isSending || !to || !subject || !body} 
              onClick={() => {
                const confirmed = window.confirm('Are you sure you want to send this email announcement?');
                if(confirmed) sendEmail();
              }} 
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSending ? (
                <>
                   <Loader2 className="animate-spin" size={20} />
                   Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Announcement
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
