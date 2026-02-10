import { ProfileEditTabs } from './ProfileEditTabs';
import type { User } from '../../../types/user';

interface ProfileEditFormProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onSave, onCancel }: ProfileEditFormProps) {
  return (
    <div className="relative min-h-screen pb-20">
      <ProfileEditTabs
        user={user}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
}