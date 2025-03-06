import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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
  );
};

export default Footer;


