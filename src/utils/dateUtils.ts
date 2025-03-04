export const getCurrentDay = (): number => {
  // Untuk testing, uncomment baris di bawah ini
  return 2; // Set ke hari ke-2 untuk testing
  
  const startDate = new Date('2024-03-11'); // Tanggal mulai Ramadhan 2024
  const today = new Date();
  
  // Reset jam ke midnight untuk perbandingan yang akurat
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  // Hitung selisih hari
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Hari pertama adalah 1
  const currentDay = diffDays + 1;
  
  // Batasi antara hari 1-30
  return Math.min(Math.max(1, currentDay), 30);
};

