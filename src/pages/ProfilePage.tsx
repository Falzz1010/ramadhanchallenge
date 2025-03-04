import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useChallengeStore } from '../store/challengeStore';
import { Camera, Trophy, Target } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { supabase } from '../lib/supabase';
import { format, isYesterday, isSameDay, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyProgress {
  week: number;
  completed: number;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { userChallenges } = useChallengeStore();
  
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatar_url || ''
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatar_url || ''
      });
    }
  }, [user]);

  // Calculate stats
  const completedChallenges = userChallenges.filter(uc => uc.completed).length;
  const totalPoints = completedChallenges * 10;
  const completionRate = (completedChallenges / 30) * 100; // Assuming 30 total challenges

  // Calculate streak
  const calculateStreak = () => {
    if (!userChallenges.length) return 0;

    // Sort completed challenges by completion date
    const completedChallenges = userChallenges
      .filter(uc => uc.completed && uc.completed_at)
      .sort((a, b) => {
        const dateA = new Date(a.completed_at!);
        const dateB = new Date(b.completed_at!);
        return dateB.getTime() - dateA.getTime();
      });

    if (completedChallenges.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    let lastDate = parseISO(completedChallenges[0].completed_at!);

    // Check if the last completion was today or yesterday
    if (!isSameDay(lastDate, today) && !isYesterday(lastDate)) {
      return 0;
    }

    // Count consecutive days
    for (let i = 1; i < completedChallenges.length; i++) {
      const currentDate = parseISO(completedChallenges[i].completed_at!);
      const dayDifference = Math.floor(
        (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDifference === 1) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const streakCount = calculateStreak();

  // Calculate weekly progress
  const weeklyProgress: WeeklyProgress[] = Array.from({ length: 4 }, (_, i) => {
    const weekNumber = i + 1;
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = weekNumber * 7;
    
    const completedInWeek = userChallenges.filter(uc => {
      if (!uc.completed || !uc.completed_at) return false;
      const challengeDay = uc.challenge_id;
      return challengeDay >= startDay && challengeDay <= endDay;
    }).length;

    return {
      week: weekNumber,
      completed: completedInWeek
    };
  });

  // Prepare chart data
  const progressData = {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    datasets: [
      {
        label: 'Tantangan Selesai',
        data: weeklyProgress.map(w => w.completed),
        fill: true,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} tantangan selesai`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(10, Math.ceil(Math.max(...weeklyProgress.map(w => w.completed)) / 5) * 5),
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      await updateProfile({
        id: user.id,
        name: formData.name,
        avatar_url: formData.avatarUrl,
        bio: formData.bio
      });
      
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      setLoading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update form data
      setFormData(prev => ({
        ...prev,
        avatarUrl: publicUrl
      }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-teal-500">
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white">
                {formData.avatarUrl ? (
                  <img 
                    src={formData.avatarUrl} 
                    alt={formData.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-6 px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData.name || 'Pengguna'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Bio Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bio
              </h3>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                {showEditForm ? 'Batal' : 'Edit'}
              </button>
            </div>
            
            {showEditForm ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </form>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {formData.bio || 'Belum ada bio'}
                </p>
              </div>
            )}
          </div>
          
          {/* Achievement Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pencapaian
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {streakCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hari Beruntun
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Poin
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {completedChallenges}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tantangan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="h-6 w-6 text-emerald-500" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Poin</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPoints}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="h-6 w-6 text-emerald-500" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tantangan</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedChallenges}</p>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Progres Mingguan
            </h3>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : (
              <div className="h-64">
                <Line data={progressData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;




