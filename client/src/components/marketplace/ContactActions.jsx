import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useAction, useData } from '../../hooks/useData';
import { favorites, messaging } from '../../services';
import Button from '../ui/Button';
import { ErrorNotice } from '../ui/DataState';
export default function ContactActions({ kind, target, participantId }) {
 const { user } = useAuth(), navigate = useNavigate();
 const saved = useData('/favorites?' + (kind === 'service' ? 'serviceId=' : 'freelancerId=') + target, { enabled: user?.activeRole === 'client' });
 const favorite = saved.data?.data[0];
 const save = useAction(() => favorite ? favorites.remove(favorite.id) : favorites.save(kind, target));
 const contact = useAction(async () => { const result = await messaging.create(participantId); navigate('/dashboard/messages?conversation=' + result.data.conversation.id); });
 return <div className="space-y-3">
  {!user ? <Button onClick={() => navigate('/login', { state: { from: window.location.pathname } })}>Sign in to contact or save</Button> : <>
   {user.id !== participantId && <Button isLoading={contact.isPending} onClick={() => contact.mutate()}>Message</Button>}
   {user.activeRole === 'client' && <Button disabled={saved.isPending || saved.isError} isLoading={save.isPending} onClick={() => save.mutate()}>{favorite ? 'Remove saved item' : 'Save item'}</Button>}
  </>}
  <ErrorNotice error={saved.error} retry={() => saved.refetch()} /><ErrorNotice error={save.error || contact.error} />
 </div>;
}
