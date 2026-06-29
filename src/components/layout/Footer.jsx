// frontend/src/components/Footer.jsx
import React from 'react';

function Footer({ onOpenAbout, onOpenContact }) {
  return (
    <footer className="w-full bg-[#5c3be0] py-4 px-12 flex items-center justify-between text-white font-semibold text-sm shadow-md mt-auto rounded-t-3xl border-t border-[#7351f5]/30">
      <span className="select-none">eSportCal</span>
      <span onClick={onOpenAbout} className="cursor-pointer hover:underline">About Us</span>
      <span onClick={onOpenContact} className="cursor-pointer hover:underline">Contact</span>
    </footer>
  );
}

export default Footer;