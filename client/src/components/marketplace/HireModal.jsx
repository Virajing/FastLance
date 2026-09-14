import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useAction } from '../../hooks/useData';
import { orders } from '../../services';
import { money, toMinor } from '../../lib/format';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import { ErrorNotice } from '../ui/DataState';
export default function HireModal({ isOpen, onClose, service, tierKey, packageData, freelancerId }) {
 const { user } = useAuth(), navigate = useNavigate(), submission = useRef(null);
 const action = useAction(async form => {
  const data = service ? { serviceId: service.id, tier: tierKey, requirements: form.get('requirements') }
   : { freelancerId, title: form.get('title'), amountMinor: toMinor(form.get('amount')), deliveryDays: Number(form.get('deliveryDays')), requirements: form.get('requirements') };
  const fingerprint = JSON.stringify(data);
  if (submission.current?.fingerprint !== fingerprint) submission.current = { fingerprint, creationKey: crypto.randomUUID() };
  const result = await orders.create({ ...data, creationKey: submission.current.creationKey });
  submission.current = null; onClose(); navigate('/dashboard/projects/' + result.data.order.id);
 });
 return <Modal isOpen={isOpen} onClose={onClose} title="Send contract offer">
  {user?.activeRole !== 'client' ? <p>Sign in and switch to client mode to send an offer.</p> : <form className="space-y-4" onSubmit={event => { event.preventDefault(); action.mutate(new FormData(event.currentTarget)); }}>
   {service ? <p>{service.title} &middot; {packageData?.name} &middot; {money(packageData?.priceMinor)}</p> : <>
    <Field label="Contract title" name="title" minLength={3} maxLength={150} required />
    <Field label="Amount (INR)" name="amount" type="number" min="1" step="0.01" required />
    <Field label="Delivery days" name="deliveryDays" type="number" min="1" max="365" required />
   </>}
   <Field label="Requirements" name="requirements" multiline maxLength={5000} />
   <p className="text-sm">The freelancer must accept before payment. FastLance records a 10% commission and 90% freelancer payable.</p>
   <ErrorNotice error={action.error} /><Button type="submit" variant="primary" isLoading={action.isPending}>Send offer</Button>
  </form>}
 </Modal>;
}
