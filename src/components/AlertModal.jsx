// frontend/src/components/AlertModal.jsx
import React from 'react';

/**
 * Reusable premium Alert and Confirm modal matching the Figma theme.
 * Replaces native browser alert() and confirm() dialogs.
 */
function AlertModal({ isOpen, title, message, type, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const isDangerAction = title.toLowerCase().includes('delete');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      {/* Modal Box */}
      <div className="bg-[#111226] border border-[#232549] rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-6 text-center animate-fade-in">
        
        {/* Title */}
        <h3 className="text-xl font-bold tracking-wide text-white border-b border-[#232549] pb-3 select-none">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-slate-300 leading-relaxed px-2">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-2 w-full">
          {type === 'confirm' ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#1c1d33] border border-[#232549] text-slate-300 hover:bg-[#232549] transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition active:scale-95 cursor-pointer ${
                  isDangerAction
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Confirm
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="w-full bg-[#5c3be0] hover:bg-[#4d2db7] text-white py-2.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              OK
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default AlertModal;