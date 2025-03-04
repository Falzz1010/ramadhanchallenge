import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'tutorial' | 'about' | 'regular';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Tutorial steps
  const tutorialMessages: Message[] = [
    {
      id: 1,
      text: "Assalamu'alaikum! Selamat datang di Asisten Virtual Ramadhan Challenge! 🌙",
      isBot: true,
      timestamp: new Date(),
      type: 'about'
    },
    {
      id: 2,
      text: "Saya adalah AI yang dirancang untuk membantu Anda mengetahui lebih banyak tentang program Ramadhan Challenge.",
      isBot: true,
      timestamp: new Date(),
      type: 'about'
    },
    {
      id: 3,
      text: "✨ Berikut beberapa hal yang bisa saya bantu:",
      isBot: true,
      timestamp: new Date(),
      type: 'tutorial'
    },
    {
      id: 4,
      text: "1️⃣ Informasi tentang program dan kelas\n2️⃣ Cara pendaftaran\n3️⃣ Biaya dan paket program\n4️⃣ Jadwal kegiatan\n5️⃣ FAQ seputar Ramadhan Challenge",
      isBot: true,
      timestamp: new Date(),
      type: 'tutorial'
    },
    {
      id: 5,
      text: "💡 Tips: Anda bisa mengetikkan pertanyaan dengan bahasa natural, contoh:\n- \"Bagaimana cara mendaftar?\"\n- \"Berapa biaya programnya?\"\n- \"Ada program apa saja?\"",
      isBot: true,
      timestamp: new Date(),
      type: 'tutorial'
    }
  ];

  // Initialize tutorial when chatbot is first opened
  useEffect(() => {
    if (isOpen && !hasSeenTutorial) {
      const delay = 500;
      tutorialMessages.forEach((message, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, message]);
        }, delay * (index + 1));
      });
      setHasSeenTutorial(true);
    }
  }, [isOpen, hasSeenTutorial]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
      type: 'regular'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Show typing indicator
    const typingMessage: Message = {
      id: messages.length + 2,
      text: "Sedang mengetik...",
      isBot: true,
      timestamp: new Date(),
      type: 'regular'
    };

    setMessages(prev => [...prev, typingMessage]);

    // Simulate bot response with delay
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.text !== "Sedang mengetik..."));
      
      const botResponse: Message = {
        id: messages.length + 3,
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
        type: 'regular'
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('assalamu') || lowerMessage.includes('salam')) {
      return "Wa'alaikumsalam warahmatullah! Ada yang bisa saya bantu?";
    }
    if (lowerMessage.includes('daftar') || lowerMessage.includes('join')) {
      return "Untuk mendaftar program Ramadhan Challenge, silakan ikuti langkah berikut:\n\n1. Klik tombol 'Daftar Sekarang' di halaman utama\n2. Isi formulir pendaftaran\n3. Pilih paket program yang diinginkan\n4. Lakukan pembayaran\n5. Tunggu konfirmasi dari tim kami\n\nJika ada kesulitan, silakan tanyakan kepada saya 😊";
    }
    if (lowerMessage.includes('harga') || lowerMessage.includes('biaya')) {
      return "Program Ramadhan Challenge memiliki beberapa paket:\n\n🌟 Paket Basic: Rp 299.000\n- Akses materi dasar\n- Grup komunitas\n\n💫 Paket Premium: Rp 599.000\n- Semua fitur Basic\n- Mentoring personal\n- Sertifikat\n\n👑 Paket VIP: Rp 999.000\n- Semua fitur Premium\n- Konsultasi pribadi\n- Merchandise eksklusif\n\nSilakan pilih paket yang sesuai dengan kebutuhan Anda.";
    }
    if (lowerMessage.includes('program') || lowerMessage.includes('kelas')) {
      return "Kami memiliki 3 program unggulan:\n\n📖 Tahfizh Ramadhan\n- Target 1 Juz per pekan\n- Bimbingan online harian\n- Tracking progress digital\n\n🕌 Kajian Tematik\n- 30 tema kajian\n- Sesi tanya jawab\n- Materi digital\n\n⭐ Produktif Ramadhan\n- 30 challenge harian\n- Mentoring group\n- Reward menarik";
    }
    if (lowerMessage.includes('bantuan') || lowerMessage.includes('help') || lowerMessage.includes('tutorial')) {
      return "Berikut panduan penggunaan chatbot:\n\n1️⃣ Ketik pertanyaan Anda dengan bahasa natural\n2️⃣ Tunggu respon dari saya\n3️⃣ Anda bisa bertanya tentang:\n- Program dan kelas\n- Pendaftaran\n- Biaya\n- Jadwal\n- Dan lainnya\n\nAda yang bisa saya bantu?";
    }
    return "Mohon maaf, saya belum bisa memahami pertanyaan Anda. Silakan coba pertanyaan lain atau hubungi customer service kami di nomor +62812-3456-7890 untuk bantuan lebih lanjut.";
  };

  return (
    <>
      {/* Chatbot Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl"
          >
            {/* Chat Header */}
            <div className="p-4 bg-green-500 text-white rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-500 text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">Asisten Ramadhan</h3>
                  <p className="text-sm opacity-90">Online</p>
                </div>
              </div>
              <button
                onClick={() => setMessages(tutorialMessages)}
                className="text-white hover:bg-green-600 p-2 rounded-full transition-colors"
                title="Lihat Tutorial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? message.type === 'tutorial' || message.type === 'about'
                          ? 'bg-green-50 dark:bg-green-900/30 text-gray-800 dark:text-gray-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
