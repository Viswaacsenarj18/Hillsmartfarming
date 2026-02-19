import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chatbot from "./Chatbot";

const FloatingChat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-600 text-white p-3 rounded-t-2xl">
            <span>🌾 Smart Farm AI</span>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
