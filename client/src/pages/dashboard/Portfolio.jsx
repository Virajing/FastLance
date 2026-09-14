import { useState } from 'react';
import { useData, useAction } from '../../hooks/useData';
import { profile } from '../../services';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Field from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import AttachmentLinks from '../../components/ui/AttachmentLinks';
function Editor({ item, close }) {
 const [attachments, setAttachments] = useState((item.attachments || []).map(id => ({ id: typeof id === 'string' ? id : id.id, name: 'Saved attachment' })));
 const action = useAction(async form => { const data = { ...Object.fromEntries(form), attachments: attachments.map(x => x.id) }; await (item.id ? profile.updatePortfolio(item.id, data) : profile.portfolio(data)); close(); });
 return <form className="space-y-3" onSubmit={event => { event.preventDefault(); action.mutate(new FormData(event.currentTarget)); }}>
  <Field label="Portfolio title" name="title" defaultValue={item.title} minLength={2} maxLength={150} required /><Field label="Description" name="description" multiline defaultValue={item.description} />
  <Field label="Project URL" name="url" type="url" defaultValue={item.url} /><Field label="Image URL" name="image" type="url" defaultValue={item.image} />
  <FileUpload scope="portfolio" value={attachments} onChange={setAttachments} /><ErrorNotice error={action.error} /><Button type="submit" isLoading={action.isPending}>Save portfolio item</Button><Button onClick={close}>Close editor</Button>
 </form>;
}
export default function Portfolio() {
 const query = useData('/auth/me'), [editing, setEditing] = useState(null), action = useAction(profile.deletePortfolio);
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Portfolio</h1><Button onClick={() => setEditing({})}>Add portfolio item</Button>
  {editing && <Editor key={editing.id || 'new'} item={editing} close={() => setEditing(null)} />}<ErrorNotice error={action.error} />
  <DataState query={query}>{({ user }) => user.portfolio.length ? user.portfolio.map(item => <article key={item.id || item._id} className="neu-flat p-5 rounded-xl space-y-3"><h2>{item.title}</h2><p>{item.description}</p><AttachmentLinks ids={item.attachments} /><Button onClick={() => setEditing({ ...item, id: item.id || item._id })}>Edit item</Button><Button disabled={action.isPending} onClick={() => action.mutate(item.id || item._id)}>Delete item</Button></article>) : <p>No portfolio items yet.</p>}</DataState>
 </section>;
}
