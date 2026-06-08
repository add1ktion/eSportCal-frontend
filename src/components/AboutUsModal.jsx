// frontend/src/components/AboutUsModal.jsx
import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATABASE = [
  {
    question: "What is eSportCal?",
    answer: "eSportCal is a centralized, desktop-first web application designed for e-sport enthusiasts. It aggregates professional match schedules from top titles like CS2, League of Legends, Valorant, and Dota 2 into a single, elegant interface."
  },
  {
    question: "Is the match data accurate?",
    answer: "Yes, 100%! We fetch real-time, official scheduling data directly from the industry-standard PandaScore API. Match times are automatically converted to your browser's local timezone so you never miss a game."
  },
  {
    question: "How do I save my favorite teams?",
    answer: "Simply create a free account by clicking the 'Login' button. Once logged in, click your profile icon in the header to access your settings, where you can customize your favorite teams and leagues to Highlight them on your dashboard."
  },
  {
    question: "Is eSportCal free to use?",
    answer: "Yes, eSportCal is completely free and made for educational purposes as a final portfolio project for Holberton School."
  }
];

function AboutUsModal({ onClose }) {
  // Local state to manage which FAQ accordions are expanded
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111226] border border-[#232549] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative my-8 cursor-default"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          {/* ==================== ABOUT US SECTION ==================== */}
          <div className="flex flex-col gap-3 border-b border-[#232549] pb-6">
            <h2 className="text-3xl font-bold text-center">About Us</h2>
            <p className="text-sm text-slate-300 text-center leading-relaxed">
              We are Antoine & Ilan, two aspiring DevOps and Full-Stack engineers at **Holberton School**. 
              We created **eSportCal** to solve the problem of fragmented match data in the esports scene, providing gamers with a clean "second-screen" dashboard.
            </p>
          </div>

          {/* ==================== FAQ SECTION (Interactive Accordion) ==================== */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
            
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {FAQ_DATABASE.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border border-[#232549] rounded-2xl bg-[#151733]/50 overflow-hidden transition-all duration-300"
                  >
                    {/* Accordion Header */}
                    <div 
                      onClick={() => toggleFaq(index)}
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1f2142]/50 transition"
                    >
                      <span className="font-bold text-xs text-slate-200">{faq.question}</span>
                      {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>

                    {/* Accordion Content */}
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-[#232549]/50 pt-2 bg-[#111226]/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutUsModal;