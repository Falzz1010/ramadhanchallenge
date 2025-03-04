import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProgramPage = () => {
  const programs = [
    {
      id: 1,
      title: "Tahfizh Ramadhan",
      description: "Program hafalan Al-Quran intensif dengan metode modern",
      image: "https://img.freepik.com/free-vector/arabic-holy-quran-book-illustration_53876-8077.jpg",
      category: "Ibadah"
    },
    {
      id: 2,
      title: "Kajian Tematik",
      description: "Kajian intensif seputar fiqih Ramadhan",
      image: "https://img.freepik.com/free-vector/mosque-illustration_53876-8149.jpg",
      category: "Ilmu"
    },
    {
      id: 3,
      title: "Produktif Ramadhan",
      description: "Program peningkatan produktivitas selama Ramadhan",
      image: "https://img.freepik.com/free-vector/hand-drawn-ramadan-kareem-illustration_23-2149307028.jpg",
      category: "Lifestyle"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
    >
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Program Ramadhan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Pilih program yang sesuai dengan target ibadah dan pengembangan dirimu
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-56 object-cover transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 bg-opacity-90 text-white text-sm font-medium rounded-full">
                    {program.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {program.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-3 min-h-[60px]">
                  {program.description}
                </p>
                <Link
                  to={`/program/${program.id}`}
                  className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 transform hover:translate-y-[-2px]"
                >
                  Pelajari Lebih Lanjut
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default ProgramPage;
