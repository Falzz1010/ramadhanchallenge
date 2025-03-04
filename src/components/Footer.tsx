import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4">Program Ramadhan</h3>
            <ul className="space-y-2">
              <li><Link to="/jadwal" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Jadwal Kajian</Link></li>
              <li><Link to="/materi" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Materi</Link></li>
              <li><Link to="/challenge" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Challenge</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4">Tentang Kami</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Tentang</Link></li>
              <li><Link to="/team" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Tim</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Karir</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li><Link to="/challenges" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Tantangan</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Kursus</Link></li>
              <li><Link to="/mentoring" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Mentoring</Link></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-white font-semibold mb-3 sm:mb-4">Bantuan</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Kontak</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-green-400 text-sm sm:text-base">Dukungan</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm sm:text-base">&copy; 2024 Ramadhan Challenge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
