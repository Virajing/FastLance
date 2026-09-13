import { useAction } from '../../hooks/useData';
import { files } from '../../services';
import Button from './Button';
import { ErrorNotice } from './DataState';
export default function AttachmentLinks({ ids = [] }) {
  const action = useAction(id => files.download(typeof id === 'string' ? id : id.id || id._id, id.name));
  return <div className="space-y-2">
    {ids.map((id, index) => <Button key={typeof id === 'string' ? id : id.id || id._id} size="sm" isLoading={action.isPending} onClick={() => action.mutate(id)}>Download attachment {index + 1}</Button>)}
    <ErrorNotice error={action.error} />
  </div>;
}
