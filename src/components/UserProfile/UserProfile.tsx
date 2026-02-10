import type { User } from '../../types/user';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockStore } from '../../data/mockData';
import { toast } from 'react-hot-toast';
import { ProfileOverview } from './sections/ProfileOverview';
import { CareerSection } from './sections/CareerSection';
import { AdditionalInfoSection } from './sections/AdditionalInfoSection';
import { References } from './sections/References';
import { ProfileEditForm } from './ProfileEditForm/ProfileEditForm';

export function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userId) {
          throw new Error('User ID is required');
        }

        const userData = mockStore.getUser(userId);
        if (!userData) {
          throw new Error('User not found');
        }

        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const isOwner = currentUser?.id === user?.id;

  const handleSave = async (updates: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      mockStore.updateUser(user.id, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.success('Changes discarded');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {error || 'Profile not found'}
        </h1>
      </div>
    );
  }

  if (isEditing && isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <ProfileEditForm 
            user={user}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:sticky lg:top-[80px] lg:self-start space-y-6">
            <ProfileOverview
              user={user}
              isOwner={isOwner}
              onEditProfile={() => setIsEditing(true)}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CareerSection user={user} />
            <AdditionalInfoSection user={user} />
            <References 
              references={mockStore.getUserRecommendations(user.id, 'approved')}
              pendingReferences={mockStore.getUserRecommendations(user.id, 'pending')}
              isOwner={isOwner}
            />
          </div>
        </div>
      </main>
    </div>
  );
}