import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';

// Data testimonial
const testimonials = [
  {
    id: 1,
    name: "Ustadz Ahmad",
    role: "Peserta Angkatan 1444H",
    image: "https://img.freepik.com/free-photo/young-muslim-man-wearing-traditional-dress_23-2149405173.jpg",
    text: "Alhamdulillah, program ini sangat membantu saya untuk konsisten dalam ibadah dan pengembangan diri selama Ramadhan. Terasa lebih bermakna."
  },
  {
    id: 2,
    name: "Fatimah Azzahra",
    role: "Professional & Ummahat",
    image: "https://img.freepik.com/free-photo/young-muslim-woman-hijab-portrait_23-2149305595.jpg",
    text: "Program ini membantu saya menyeimbangkan antara pekerjaan dan ibadah di bulan Ramadhan. Materinya sangat bermanfaat."
  },
  {
    id: 3,
    name: "Muhammad Rizki",
    role: "Mahasiswa",
    image: "https://img.freepik.com/free-photo/young-muslim-man-traditional-dress_23-2149405197.jpg",
    text: "Sebagai mahasiswa, program ini membantu saya tetap produktif dalam kuliah sambil memaksimalkan ibadah di bulan Ramadhan."
  },
  {
    id: 4,
    name: "Aisyah Putri",
    role: "Guru",
    image: "https://img.freepik.com/free-photo/young-muslim-woman-hijab_23-2149305594.jpg",
    text: "Materi yang diberikan sangat terstruktur dan mudah diikuti. Saya bisa menerapkannya dalam mengajar juga."
  },
  {
    id: 5,
    name: "Umar Faruq",
    role: "Pengusaha",
    image: "https://img.freepik.com/free-photo/young-muslim-man-wearing-traditional-dress_23-2149405174.jpg",
    text: "Challenge harian membantu saya tetap istiqomah dalam beribadah di tengah kesibukan bisnis."
  },
  {
    id: 6,
    name: "Khadijah Amira",
    role: "Ibu Rumah Tangga",
    image: "https://img.freepik.com/free-photo/young-muslim-woman-hijab_23-2149305583.jpg",
    text: "Program ini memberikan panduan praktis untuk memaksimalkan Ramadhan sambil mengurus keluarga."
  },
  {
    id: 7,
    name: "Zaid Abdullah",
    role: "Profesional IT",
    image: "https://img.freepik.com/free-photo/young-muslim-man-traditional-dress_23-2149405198.jpg",
    text: "Saya bisa tetap produktif kerja sambil menjalankan amalan Ramadhan dengan lebih baik."
  },
  {
    id: 8,
    name: "Safiya Rahman",
    role: "Content Creator",
    image: "https://img.freepik.com/free-photo/young-muslim-woman-hijab_23-2149305584.jpg",
    text: "Komunitas yang luar biasa dan supportif. Banyak inspirasi konten positif yang bisa dibagikan."
  },
  {
    id: 9,
    name: "Hamzah Yusuf",
    role: "Dokter",
    image: "https://img.freepik.com/free-photo/young-muslim-man-traditional-dress_23-2149405199.jpg",
    text: "Program ini membantu saya mengelola waktu dengan baik antara tugas di rumah sakit dan ibadah Ramadhan."
  },
  {
    id: 10,
    name: "Ruqayya Hasan",
    role: "Mahasiswi",
    image: "https://img.freepik.com/free-photo/young-muslim-woman-hijab_23-2149305585.jpg",
    text: "Alhamdulillah bisa bergabung dengan komunitas yang positif dan mendukung dalam peningkatan ibadah."
  }
];

// Animations variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const slideIn = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 }
};

// Add new animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Testimonial Section Component
const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
      );
    }, 5000); // Increased to 5 seconds for better readability

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-8 sm:py-16 bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.h2 
          variants={itemVariants}
          className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8 sm:mb-12 px-4"
        >
          Pengalaman Peserta Ramadhan Challenge
        </motion.h2>
        
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          {/* Gradient Overlay with Animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"
          />
          
          {/* Testimonial Container */}
          <div className="relative overflow-hidden">
            <motion.div 
              animate={{ x: `-${currentIndex * (100 / 3)}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="flex"
            >
              {testimonials.map((testimonial) => (
                <motion.div 
                  key={testimonial.id}
                  whileHover={{ scale: 1.02 }}
                  className="min-w-full sm:min-w-[50%] md:min-w-[33.333%] px-2 sm:px-4"
                >
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center mb-4"
                    >
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-green-500"
                      />
                      <div>
                        <motion.h4 
                          variants={fadeIn}
                          className="font-semibold text-gray-900 dark:text-white"
                        >
                          {testimonial.name}
                        </motion.h4>
                        <motion.p 
                          variants={fadeIn}
                          className="text-sm text-gray-500 dark:text-gray-400"
                        >
                          {testimonial.role}
                        </motion.p>
                      </div>
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 dark:text-gray-300 italic"
                    >
                      "{testimonial.text}"
                    </motion.p>
                    
                    {/* Animated Rating Stars */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center mt-4 space-x-1"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </motion.svg>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Right Gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"
          />
          
          {/* Navigation Dots with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-8 space-x-2"
          >
            {Array.from({ length: testimonials.length - 2 }, (_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  currentIndex === i 
                    ? 'bg-green-500' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Tambahkan animasi scroll indicator
const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: [0, 1, 0],
        y: [0, 10, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <div className="w-6 h-10 border-2 border-green-500 rounded-full flex justify-center">
        <motion.div
          animate={{
            y: [0, 12, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-2 h-2 bg-green-500 rounded-full mt-2"
        />
      </div>
    </motion.div>
  );
};

// Modifikasi FAQItem untuk menerima dan mengelola active item
const FAQItem = ({ 
  question, 
  answer, 
  isActive, 
  onClick,
  id 
}: { 
  question: string; 
  answer: string;
  isActive: boolean;
  onClick: (id: number) => void;
  id: number;
}) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow">
      <button 
        onClick={() => onClick(id)}
        className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
        <svg 
          className={`w-6 h-6 transform transition-transform ${isActive ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-500 dark:text-gray-300">{answer}</p>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { setLoginAllowed } = useAuthStore();
  
  // Tambahkan ini untuk debugging
  const { user, isLoginAllowed } = useAuthStore();
  console.log('Current user:', user);
  console.log('Is login allowed:', isLoginAllowed);

  const handleLoginClick = async () => {
    try {
      console.log('Login button clicked');
      
      // Set login allowed
      setLoginAllowed(true);
      
      // Navigate immediately after setting the state
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Error during login navigation:', error);
      setLoginAllowed(false); // Reset on error
    }
  };

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const handleFAQClick = (id: number) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  // Tambahkan data FAQ
  const faqData = [
    {
      id: 1,
      question: "Apa itu Ramadhan Challenge?",
      answer: "Ramadhan Challenge adalah program intensif 30 hari yang dirancang untuk memaksimalkan ibadah dan produktivitas selama bulan Ramadhan. Program ini menggabungkan kajian Islam, tantangan ibadah harian, dan sistem tracking digital untuk membantu peserta mencapai target spiritual dan personal mereka selama bulan suci."
    },
    {
      id: 2,
      question: "Bagaimana cara bergabung dengan program ini?",
      answer: "Anda dapat bergabung dengan program ini dengan mengklik tombol 'Daftar Sekarang' di halaman utama. Setelah itu, ikuti proses pendaftaran dan pilih paket program yang sesuai dengan kebutuhan Anda. Pembayaran dapat dilakukan melalui berbagai metode yang tersedia."
    },
    {
      id: 3,
      question: "Apakah program ini cocok untuk pemula?",
      answer: "Ya, program ini dirancang untuk semua tingkatan, dari pemula hingga yang sudah berpengalaman. Setiap program memiliki panduan bertahap dan mentor yang akan membantu Anda menyesuaikan target sesuai dengan kemampuan masing-masing."
    },
    {
      id: 4,
      question: "Berapa lama durasi program ini?",
      answer: "Program ini berlangsung selama bulan Ramadhan (30 hari) dengan berbagai aktivitas dan tantangan harian. Setiap peserta akan mendapatkan akses ke platform selama 40 hari, termasuk persiapan sebelum Ramadhan dan evaluasi setelah Ramadhan."
    },
    {
      id: 5,
      question: "Apa saja fasilitas yang akan saya dapatkan?",
      answer: "Peserta akan mendapatkan akses ke platform digital, materi pembelajaran, video kajian, grup komunitas eksklusif, bimbingan mentor, tracking progress digital, dan sertifikat kelulusan. Bonus tambahan termasuk e-book dan resources digital lainnya."
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      {/* Replace navbar section with component */}
      <Navbar />

      {/* Hero Section dengan Ilustrasi */}
      <main className="relative overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-12 sm:py-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div 
                variants={itemVariants}
                className="inline-block px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-4 sm:mb-6"
              >
                Ramadhan 1445H
              </motion.div>
              <motion.h2 
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
              >
                Tingkatkan Kualitas
                <span className="text-green-600 dark:text-green-400"> Ramadhanmu</span>
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300"
              >
                Maksimalkan ibadah dan produktivitasmu di bulan suci dengan program terstruktur dan komunitas yang mendukung
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/daftar"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 md:py-4 md:text-lg md:px-10"
                  >
                    Daftar Sekarang
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-green-600 dark:border-green-500 text-sm sm:text-base font-medium rounded-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 md:py-4 md:text-lg md:px-10"
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </motion.div>

              <motion.div 
                variants={containerVariants}
                className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6"
              >
                {/* Stats items with animation */}
                {[
                  { number: "1000+", label: "Peserta" },
                  { number: "50+", label: "Mentor" },
                  { number: "30+", label: "Program" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center"
                  >
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</span>
                    <span className="ml-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <motion.div
              variants={scaleVariants}
              className="relative px-4 sm:px-0"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="https://img.freepik.com/free-vector/hand-drawn-ramadan-illustration_23-2149283366.jpg"
                alt="Ramadhan Illustration"
                className="w-full h-auto rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Program Cards dengan Ilustrasi */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center max-w-3xl mx-auto px-4"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Program Unggulan Ramadhan
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Pilih program yang sesuai dengan targetmu di bulan Ramadhan
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0"
          >
            {/* Program Card 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="p-4 sm:p-8">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <img 
                    src="https://img.freepik.com/free-vector/arabic-holy-quran-book-illustration_53876-8077.jpg" 
                    alt="Quran Icon"
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tahfizh Ramadhan</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Program hafalan Al-Quran intensif dengan metode modern dan bimbingan hafizh berpengalaman
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Target 1 Juz per Pekan
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Bimbingan Online Harian
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Tracking Progress Digital
                  </li>
                </ul>
                <Link
                  to="/program/tahfizh"
                  className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Mulai Program
                </Link>
              </div>
            </motion.div>

            {/* Program Card 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="p-4 sm:p-8">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                  <img 
                    src="https://img.freepik.com/free-vector/mosque-illustration_53876-8149.jpg" 
                    alt="Mosque Icon"
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kajian Tematik</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Kajian intensif seputar fiqih Ramadhan dan tema-tema keislaman bersama ustadz terpercaya
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    30 Tema Kajian
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Sesi Tanya Jawab
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Materi Digital
                  </li>
                </ul>
                <Link
                  to="/program/kajian"
                  className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Mulai Program
                </Link>
              </div>
            </motion.div>

            {/* Program Card 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
              <div className="p-4 sm:p-8">
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
                  <img 
                    src="https://img.freepik.com/free-vector/hand-drawn-ramadan-kareem-illustration_23-2149307028.jpg" 
                    alt="Productivity Icon"
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Produktif Ramadhan</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Program peningkatan produktivitas selama Ramadhan dengan berbagai challenge harian
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    30 Challenge Harian
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Mentoring Group
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="h-5 w-5 text-green-500 mr-2">✓</span>
                    Reward Menarik
                  </li>
                </ul>
                <Link
                  to="/program/produktif"
                  className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                >
                  Mulai Program
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Program Spesial Ramadhan</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Maksimalkan ibadah dan pengembangan diri Anda di bulan yang penuh berkah</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-green-500 dark:text-green-400 mb-4">
                {/* Icon Quran */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tantangan Tilawah</h3>
              <p className="text-gray-500 dark:text-gray-300">Target hafalan dan tilawah Al-Quran harian dengan panduan dan tracking progress</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-green-500 dark:text-green-400 mb-4">
                {/* Icon Knowledge */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kajian Ramadhan</h3>
              <p className="text-gray-500 dark:text-gray-300">Ikuti kajian online dan diskusi ilmu dengan ustadz terpercaya setiap hari</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="text-green-500 dark:text-green-400 mb-4">
                {/* Icon Productivity */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Produktif di Ramadhan</h3>
              <p className="text-gray-500 dark:text-gray-300">Tips dan challenge untuk tetap produktif sambil maksimal dalam ibadah</p>
            </div>
          </div>
        </div>
      </section>

      <TestimonialSection />
      <ScrollIndicator />

      {/* FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Pertanyaan Seputar Ramadhan Challenge
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
              Temukan jawaban untuk pertanyaan yang sering diajukan seputar program Ramadhan Challenge
            </p>
          </div>
          <motion.div 
            variants={containerVariants}
            className="mt-12 max-w-3xl mx-auto space-y-4"
          >
            {/* FAQ Items with Animation */}
            {faqData.map((faq) => (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <FAQItem 
                  id={faq.id}
                  isActive={activeFAQ === faq.id}
                  onClick={handleFAQClick}
                  question={faq.question}
                  answer={faq.answer}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer with Islamic Pattern */}
      <footer className="bg-gray-800 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Program Ramadhan</h3>
              <ul className="space-y-2">
                <li><Link to="/jadwal" className="text-gray-300 hover:text-green-400">Jadwal Kajian</Link></li>
                <li><Link to="/materi" className="text-gray-300 hover:text-green-400">Materi</Link></li>
                <li><Link to="/challenge" className="text-gray-300 hover:text-green-400">Challenge</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Tentang Kami</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-green-400">Tentang</Link></li>
                <li><Link to="/team" className="text-gray-300 hover:text-green-400">Tim</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-green-400">Karir</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2">
                <li><Link to="/challenges" className="text-gray-300 hover:text-green-400">Tantangan</Link></li>
                <li><Link to="/courses" className="text-gray-300 hover:text-green-400">Kursus</Link></li>
                <li><Link to="/mentoring" className="text-gray-300 hover:text-green-400">Mentoring</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-300 hover:text-green-400">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-green-400">Kontak</Link></li>
                <li><Link to="/support" className="text-gray-300 hover:text-green-400">Dukungan</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                {/* Add social media icons/links here */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400">&copy; 2024 Challenge App. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add Chatbot component */}
      <Chatbot />
    </motion.div>
  );
};

export default LandingPage;


