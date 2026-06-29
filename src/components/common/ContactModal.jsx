// frontend/src/components/ContactModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

function ContactModal({ onClose, triggerAlert }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Calls our secure backend proxy mail sender!
      await axios.post('http://localhost:5001/api/contact', {
        name,
        email,
        subject,
        message
      });

      setSending(false);
      triggerAlert(
        'Message Sent!',
        `Thank you ${name}, your email has been successfully delivered. Our team will get back to you shortly!`,
        'alert',
        () => onClose()
      );

    } catch (err) {
      console.error('Mail sending error:', err);
      setSending(false);
      triggerAlert(
        'Sending Failed',
        'Unable to send your message. Please verify your email server configuration or try again later.',
        'alert'
      );
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-md w-full shadow-2xl relative cursor-default"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSend} className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-center border-b border-[#232549] pb-3">
            Contact Us
          </h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-300">Name :</span>
              <input 
                type="text" 
                placeholder="Your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-300">Email :</span>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-slate-300">Subject :</span>
              <input 
                type="text" 
                placeholder="Topic of discussion" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-lg px-3 py-1 text-xs w-48 outline-none font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <span className="font-bold text-slate-300 text-left">Message :</span>
              <textarea 
                placeholder="Write your message here..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="bg-[#c0c2d6] text-[#090a15] placeholder-slate-500 rounded-xl px-3 py-2 text-xs w-full outline-none font-semibold resize-none"
                required
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={sending}
            className={`w-full bg-[#27ae60] hover:bg-[#2ecc71] text-white py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 mt-1 cursor-pointer ${
              sending ? 'opacity-50 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            {sending ? 'Sending Message...' : 'Send Message'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default ContactModal;