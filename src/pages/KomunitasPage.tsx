import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const KomunitasPage = () => {
  const communities = [
    {
      id: 1,
      name: "Grup Tahfizh",
      members: 250,
      description: "Komunitas untuk para penghafal Al-Quran",
      image: "https://img.freepik.com/free-vector/arabic-holy-quran-book-illustration_53876-8077.jpg"
    },
    {
      id: 2,
      name: "Kajian Rutin",
      members: 500,
      description: "Diskusi dan kajian Islam bersama",
      image: "https://img.freepik.com/free-vector/mosque-illustration_53876-8149.jpg"
    },
    {
      id: 3,
      name: "Produktif Ramadhan",
      members: 300,
      description: "Sharing tips produktivitas di bulan Ramadhan",
      image: "https://img.freepik.com/free-vector/hand-drawn-ramadan-kareem-illustration_23-2149307028.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
    >
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
            Komunitas Ramadhan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Bergabung dengan komunitas yang sesuai dengan minatmu
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {communities.map((community) => (
            <motion.div
              key={community.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative">
                <img 
                  src={community.image} 
                  alt={community.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {community.name}
                </h3>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {community.members} Anggota
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-4">
                  {community.description}
                </p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transform transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Gabung Komunitas
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default KomunitasPage;
