"use client";

import { useState } from "react";
import ChatBot from "../../../components/ChatBot";
import { useLanguage } from "../../../contexts/LanguageContext";
import Link from "next/link";

export default function ChatPage() {
  const { t } = useLanguage();
  const [showChat, setShowChat] = useState(true);

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="app-main">
      <div style={{ marginBottom: 24 }}>
        <Link href="/home" className="btn" style={{ marginBottom: 16, display: 'inline-block' }}>
          ← {t("back")}
        </Link>
        <h1>{t("aiAssistant")}</h1>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        padding: '20px',
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        {showChat ? (
          <ChatBot showHeader={false} onClose={handleCloseChat} />
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <p>{t("chatClosed")}</p>
            <button 
              className="btn"
              onClick={() => setShowChat(true)}
              style={{ padding: '10px 20px' }}
            >
              {t("openChat")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}