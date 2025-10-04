// components/HelpModal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { helpContent } from "../data/helpContent";
import type { Language, HelpPage } from "./HelpButton";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: HelpPage;
  language: Language;
}

const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  page,
  language,
}) => {
  const pageContent = helpContent[page];
  const title =
    pageContent?.[`title_${language}` as "title_en" | "title_he"] ?? "";
  const content =
    pageContent?.[`content_${language}` as "content_en" | "content_he"] ?? "";

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.addEventListener("keydown", onEsc);
      // מניעת גלילה ברקע
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onEsc);
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const node = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[1000] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel – fixed centered with translate (לא תלוי בפלקס) */}
      <div
        className={`fixed z-[1001] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[min(92vw,42rem)] max-h-[80vh] overflow-hidden
                    bg-white rounded-lg shadow-xl ${
                      language === "he" ? "rtl" : "ltr"
                    }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="help-modal-title"
            className="text-2xl font-bold text-gray-800"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={language === "he" ? "סגור" : "Close"}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] leading-relaxed overscroll-contain">
          <div
            className="prose md:prose-base max-w-none
                       prose-headings:mt-4 prose-p:mb-3
                       prose-ul:my-3 prose-ol:my-3 prose-li:mb-1"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* Footer (sticky בתוך הפאנל) */}
        <div className="sticky bottom-0 flex justify-end px-6 py-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {language === "he" ? "סגור" : "Close"}
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(node, document.body);
};

export default HelpModal;
