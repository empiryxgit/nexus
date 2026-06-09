import { useState, useRef, useEffect } from 'react';
import { nexiResponses } from '../../data/mockData';
import { Bot, X, Send } from 'lucide-react';

const matchResponse = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('investor') || lower.includes('fund') || lower.includes('raise')) return nexiResponses.find_investors;
  if (lower.includes('opportunity') || lower.includes('create')) return nexiResponses.create_opportunity;
  if (lower.includes('credit') || lower.includes('balance') || lower.includes('wallet')) return nexiResponses.check_credits;
  if (lower.includes('partner') || lower.includes('agency') || lower.includes('legal')) return nexiResponses.find_partners;
  if (lower.includes('boost') || lower.includes('profile')) return nexiResponses.boost_profile;
  return nexiResponses.fallback;
};

const quickActions = [
  { label: 'Find Investors', key: 'find_investors' },
  { label: 'Create Opportunity', key: 'create_opportunity' },
  { label: 'Check Credits', key: 'check_credits' },
  { label: 'Find Partners', key: 'find_partners' },
  { label: 'Boost Profile', key: 'boost_profile' },
];

export default function NexiDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: '0', type: 'ai', text: nexiResponses.greeting }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const addAIResponse = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: 'ai', text }]);
    }, 800 + Math.random() * 500);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
    setInput('');
    addAIResponse(matchResponse(text));
  };

  const handleQuickAction = (key) => {
    const label = quickActions.find(a => a.key === key)?.label || key;
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: label }]);
    addAIResponse(nexiResponses[key] || nexiResponses.fallback);
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button className="nexi-fab" onClick={() => setIsOpen(true)} id="nexi-fab" aria-label="Open Nexi">
          <Bot size={20} />
        </button>
      )}

      {/* Backdrop */}
      {isOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 599 }} onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      {isOpen && (
        <div className="nexi-drawer" id="nexi-drawer" style={{ transform: 'translateX(0)' }}>
          <div className="nexi-header">
            <div className="nexi-avatar"><Bot size={14} color="white" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>Nexi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)', color: 'var(--green)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} /> Online
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }} id="nexi-close">
              <X size={16} />
            </button>
          </div>

          <div className="nexi-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`nexi-message ${msg.type === 'user' ? 'nexi-message-user' : ''}`}>
                {msg.type === 'ai' && <div style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={12} color="white" /></div>}
                <div className={`nexi-bubble ${msg.type === 'ai' ? 'nexi-bubble-ai' : 'nexi-bubble-user'}`} style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="nexi-message">
                <div style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={12} color="white" /></div>
                <div className="nexi-bubble nexi-bubble-ai"><div className="nexi-typing"><div className="nexi-typing-dot" /><div className="nexi-typing-dot" /><div className="nexi-typing-dot" /></div></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="nexi-chips">
            {quickActions.map(a => <button key={a.key} className="nexi-chip" onClick={() => handleQuickAction(a.key)} id={`nexi-chip-${a.key}`}>{a.label}</button>)}
          </div>

          <div className="nexi-input-area">
            <input ref={inputRef} className="input" placeholder="Ask Nexi anything..." value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(input); }}
              style={{ flex: 1, borderRadius: 'var(--radius-full)', height: 34 }} id="nexi-input" />
            <button className="btn btn-primary btn-icon" onClick={() => sendMessage(input)} disabled={!input.trim()}
              style={{ borderRadius: 'var(--radius-full)', width: 34, height: 34 }} id="nexi-send"><Send size={14} /></button>
          </div>
        </div>
      )}
    </>
  );
}
