import { useState, memo } from 'react';
import { CheckCircle, Circle, MessageSquare, X } from 'lucide-react';
import { Challenge, UserChallenge as UserChallengeType } from '../types/types';
import { useChallengeStore } from '../store/challengeStore';
import { useAuthStore } from '../store/authStore';
import { useBadgeStore } from '../store/badgeStore';

interface ChallengeCardProps {
  challenge: Challenge;
  day: number;
  isLocked: boolean;
  userChallenge?: UserChallengeType | null;
  currentDay: number;
  onShare?: (challenge: Challenge) => void;
}

const ChallengeCard = memo(({
  challenge,
  day,
  isLocked,
  userChallenge,
  currentDay,
  onShare
}: ChallengeCardProps) => {
  const { user } = useAuthStore();
  const { completeChallenge, userChallenges, uncompleteChallenge } = useChallengeStore();
  const { checkAndAwardBadges } = useBadgeStore();
  
  const [notes, setNotes] = useState(userChallenge?.notes || '');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isCompleted = userChallenge?.completed || false;
  const isPastChallenge = challenge.day < currentDay;
  const isFutureChallenge = challenge.day > currentDay;
  
  const handleComplete = async () => {
    if (!user || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await completeChallenge(user.id, challenge.id, notes);
      
      // Get updated completion count
      const completedCount = userChallenges.filter(uc => uc.completed).length;
      
      // Check for new badges
      await checkAndAwardBadges(user.id, completedCount);
      
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUncomplete = async () => {
    if (!user) return;
    try {
      await uncompleteChallenge(user.id, challenge.id);
    } catch (error) {
      console.error('Error uncompleting challenge:', error);
    }
  };

  return (
    <div className={`
      relative overflow-hidden
      bg-white dark:bg-gray-800 
      rounded-xl border border-gray-100 dark:border-gray-700
      shadow-soft hover:shadow-md
      transition-all duration-300
      ${isLocked ? 'opacity-50 pointer-events-none' : 'hover:scale-[1.02]'}
      ${isCompleted ? 'border-primary-500 dark:border-primary-600' : 
        isPastChallenge ? 'border-gray-300 dark:border-gray-700 opacity-50' :
        'border-gray-300 dark:border-gray-700'}
    `}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {isCompleted ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Selesai
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700/30 rounded-full">
            <Circle className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Belum Selesai
            </span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="relative p-6">
        {/* Day Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
          Hari {day}
        </div>

        {/* Challenge Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {challenge.title}
        </h3>

        {/* Challenge Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {challenge.description}
        </p>

        {isLocked ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            <p>Tantangan ini akan terbuka pada hari ke-{challenge.day}</p>
          </div>
        ) : (
          <>
            {/* Notes Section */}
            {!isCompleted && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    {showNotes ? 'Tutup Catatan' : 'Tambah Catatan'}
                  </button>
                </div>

                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tulis catatan Anda di sini..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 
                             dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 
                             focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    rows={3}
                  />
                )}
              </div>
            )}

            {/* Complete Button - Only show if not completed */}
            {!isCompleted && (
              <div className="mt-4">
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
                           text-white rounded-lg transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Selesaikan Misi</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Share Button */}
            {onShare && (
              <button
                onClick={() => onShare(challenge)}
                className="mt-2 w-full px-4 py-2 text-emerald-600 bg-emerald-50 
                         hover:bg-emerald-100 dark:bg-emerald-900/20 
                         dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
              >
                Bagikan
              </button>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                {isPastChallenge && !isCompleted ? (
                  <span className="text-sm text-red-500 dark:text-red-400">
                    Tantangan sudah berakhir
                  </span>
                ) : isFutureChallenge ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Belum waktunya
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={handleUncomplete}
                    className="flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    <span>Batal</span>
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="flex items-center px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Selesai</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default ChallengeCard;




