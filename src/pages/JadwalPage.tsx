import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const JadwalPage = () => {
  const schedules = [
    {
      id: 1,
      time: "04:30 - 05:30",
      title: "Tahajud & Sahur",
      instructor: "Ustadz Ahmad",
      type: "Ibadah"
    },
    {
      id: 2,
      time: "09:00 - 10:30",
      title: "Kajian Fiqih Puasa",
      instructor: "Ustadz Mahmud",
      type: "Kajian"
    },
    {
      id: 3,
      time: "16:00 - 17:30",
      title: "Tadarus Al-Quran",
      instructor: "Ustadzah Fatimah",
      type: "Quran"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
    >
      <Navbar />
      <motion.div 
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
            Jadwal Kegiatan Ramadhan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Ikuti kegiatan harian untuk memaksimalkan ibadah Ramadhan
          </p>
        </motion.div>

        <motion.div 
          className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {schedules.map((schedule) => (
            <motion.div
              key={schedule.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-xl"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {schedule.type}
                </span>
                <div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 block mb-2">
                    {schedule.time}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {schedule.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {schedule.instructor}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      <Footer />
    </motion.div>
  );
};

export default JadwalPage;
