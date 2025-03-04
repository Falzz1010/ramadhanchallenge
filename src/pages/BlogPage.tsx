import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "Tips Menjaga Stamina Selama Puasa",
      excerpt: "Bagaimana tetap energik dan produktif selama menjalankan ibadah puasa",
      author: "Dr. Ahmad",
      date: "10 Maret 2024",
      category: "Kesehatan",
      image: "https://img.freepik.com/free-photo/healthy-food-ramadan_23-2149225146.jpg"
    },
    {
      id: 2,
      title: "Keutamaan Lailatul Qadar",
      excerpt: "Memahami dan memaksimalkan ibadah di malam-malam terakhir Ramadhan",
      author: "Ustadz Mahmud",
      date: "12 Maret 2024",
      category: "Ibadah",
      image: "https://img.freepik.com/free-vector/mosque-illustration_53876-8149.jpg"
    },
    {
      id: 3,
      title: "Resep Menu Sahur Sehat",
      excerpt: "Ide menu sahur yang sehat dan mengenyangkan untuk puasa",
      author: "Fatimah Az-Zahra",
      date: "15 Maret 2024",
      category: "Kuliner",
      image: "https://img.freepik.com/free-photo/healthy-food-ramadan_23-2149225147.jpg"
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
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
    >
      <Navbar />
      <motion.div 
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.h1 
            className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Blog Ramadhan
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Artikel dan tips seputar ibadah dan kehidupan di bulan Ramadhan
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {post.author}
                  </p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
      <Footer />
    </motion.div>
  );
};

export default BlogPage;
