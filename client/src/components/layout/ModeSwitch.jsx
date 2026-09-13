import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useAction } from '../../hooks/useData';
import Button from '../ui/Button';
import { ErrorNotice } from '../ui/DataState';
export default function ModeSwitch() {
  const { user, switchRole } = useAuth(), navigate = useNavigate();
  const action = useAction(role => switchRole(role));
  if (!user) return null;
  const target = user.activeRole === 'client' ? 'freelancer' : 'client';
  const owned = user.roles.includes(target);
  return <div className="space-y-2">
    <Button size="sm" isLoading={action.isPending} disabled={!owned && target === 'client'} onClick={() => {
      if (!owned) navigate('/dashboard/onboarding');
      else action.mutate(target, { onSuccess: () => navigate('/dashboard') });
    }}>{owned ? 'Switch to ' + target : target === 'freelancer' ? 'Become a freelancer' : 'Client mode unavailable'}</Button>
    <ErrorNotice error={action.error} />
  </div>;
}
