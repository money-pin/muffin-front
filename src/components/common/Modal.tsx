import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end bg-transparent">
      <div 
        className="absolute inset-0 max-w-[391px] mx-auto bg-neutral-1000/45 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 w-[390px] max-h-[85vh] bg-white rounded-t-[20px] pt-4 pb-[60px] px-4 shadow-xl flex flex-col transform translate-y-0 transition-transform duration-300 ease-out">
        <div className="w-9 h-1 bg-neutral-100 rounded-full mx-auto mb-4" />

        {title && (
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-heading-18-bd text-neutral-900">{title}</h3>
          </div>
        )}

        <div className="overflow-y-auto flex-1 text-body-14-rg text-neutral-700">
          {children}
        </div>
      </div>
    </div>
  );
}