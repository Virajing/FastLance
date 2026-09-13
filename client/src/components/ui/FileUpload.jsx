import { useData, useAction } from '../../hooks/useData';
import { marketplace, files } from '../../services';
import { ErrorNotice } from './DataState';
import Button from './Button';
export default function FileUpload({ scope, contextId, value = [], onChange }) {
  const capabilities = useData(marketplace.capabilities());
  const action = useAction(file => files.upload(file, scope, contextId));
  const configured = capabilities.data?.data.storage;
  return <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-600">
      Attachments (PNG, JPEG, WebP, PDF, ZIP or TXT; maximum 10 MB)
      <input aria-label="Upload attachment" className="block w-full text-sm mt-2" type="file"
        accept=".png,.jpg,.jpeg,.webp,.pdf,.zip,.txt" disabled={!configured || action.isPending || value.length >= 10}
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) action.mutate(file, { onSuccess: result => onChange([...value, result.data.attachment]) });
          event.target.value = '';
        }} />
    </label>
    {!configured && <p className="text-xs text-slate-500">{capabilities.isPending ? 'Checking upload configuration…' : 'Attachments not configured. Ask the administrator to configure storage.'}</p>}
    {action.isPending && <p role="status" className="text-sm">Uploading…</p>}
    <ErrorNotice error={action.error || capabilities.error} retry={capabilities.isError ? () => capabilities.refetch() : undefined} />
    {value.map(item => <div key={item.id} className="flex items-center justify-between neu-sm rounded-xl p-2 text-sm">
      <span>{item.name || 'Attachment'}</span><Button onClick={() => onChange(value.filter(row => row.id !== item.id))}>Remove</Button>
    </div>)}
  </div>;
}
