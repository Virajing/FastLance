import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { useSocket } from '../../context/socket';
import { useData, useAction } from '../../hooks/useData';
import { api } from '../../lib/api';
import { messaging } from '../../services';
import DataState, { ErrorNotice } from '../../components/ui/DataState';
import Records from '../../components/ui/Records';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import FileUpload from '../../components/ui/FileUpload';
import AttachmentLinks from '../../components/ui/AttachmentLinks';
import { dateTime } from '../../lib/format';
import { mergeMessages } from '../../lib/messages';
function Thread({ id, back }) {
 const { user } = useAuth(), { socket, status } = useSocket(), queryClient = useQueryClient();
 const detail = useData(messaging.conversation(id));
 const key = ['messages', user.id, id];
 const history = useInfiniteQuery({ queryKey: key, initialPageParam: undefined,
  queryFn: ({ pageParam, signal }) => api.get(messaging.history(id, { before: pageParam, limit: 30 }), signal),
  getNextPageParam: last => last.pagination.hasMore ? last.pagination.nextCursor : undefined, retry: false });
 const [pending, setPending] = useState([]), [draft, setDraft] = useState(''), [attachments, setAttachments] = useState([]), [typing, setTyping] = useState(false), [receiptError, setReceiptError] = useState(null);
 const typingAt = useRef(0), typingTimer = useRef(), remoteTimer = useRef(), readThrough = useRef(0), deliveredThrough = useRef(0);
 const rows = mergeMessages(history.data?.pages.flatMap(page => page.data) || [], pending);
 const latest = history.data?.pages[0]?.data.at(-1)?.sequence || 0;
 const send = useAction(async message => {
  let result;
  if (socket?.connected) {
   try { const ack = await socket.timeout(7000).emitWithAck('message:send', { ...message, conversationId: id });
    if (!ack.success) throw Object.assign(new Error(ack.error.message), { status: ack.error.status });
    result = { data: ack.data };
   } catch (error) { if (error.status) throw error; result = await messaging.send(id, message); }
  } else result = await messaging.send(id, message);
  setPending(previous => previous.filter(row => row.clientId !== message.clientId));
  queryClient.setQueryData(['messages', user.id, id], previous => previous ? { ...previous, pages: previous.pages.map((page, index) => index ? page : { ...page, data: mergeMessages(page.data, [result.data.message]) }) } : previous);
  await queryClient.invalidateQueries({ queryKey: ['messages', user.id, id] });
 });
 function transmit(message) {
  setPending(previous => mergeMessages(previous.filter(row => row.clientId !== message.clientId), [{ ...message, senderId: user.id, pending: true }]));
  send.mutate(message, { onError: error => setPending(previous => previous.map(row => row.clientId === message.clientId ? { ...row, pending: false, error: error.message } : row)) });
 }
 useEffect(() => {
  if (!socket) return;
  socket.emit('conversation:join', { conversationId: id }, ack => { if (!ack.success) setReceiptError(new Error(ack.error.message)); });
  const invalidate = payload => { if (payload.conversationId === id) queryClient.invalidateQueries({ queryKey: ['messages', user.id, id] }); };
  const incoming = payload => { if (payload.conversationId !== id) return; invalidate(payload); };
  const typingUpdate = payload => { if (payload.conversationId !== id || payload.userId === user.id) return;
   setTyping(payload.typing); clearTimeout(remoteTimer.current);
   if (payload.typing) remoteTimer.current = setTimeout(() => setTyping(false), 5000);
  };
  socket.on('message:new', incoming); socket.on('message:read', invalidate); socket.on('message:delivered', invalidate); socket.on('typing:updated', typingUpdate);
  queryClient.invalidateQueries({ queryKey: ['messages', user.id, id] });
  return () => { socket.emit('typing:stop', { conversationId: id }); socket.emit('conversation:leave', { conversationId: id });
   socket.off('message:new', incoming); socket.off('message:read', invalidate); socket.off('message:delivered', invalidate); socket.off('typing:updated', typingUpdate);
   clearTimeout(typingTimer.current); clearTimeout(remoteTimer.current);
  };
 }, [socket, id, queryClient, user.id]);
 useEffect(() => {
  let active = true;
  async function receipts() {
   try {
    if (latest > deliveredThrough.current) { await messaging.delivered(id, latest); if (active) deliveredThrough.current = latest; }
    if (document.visibilityState === 'visible' && latest > readThrough.current) {
     await messaging.read(id, latest); if (active) readThrough.current = latest;
     queryClient.invalidateQueries({ queryKey: ['api'] });
    }
   } catch (error) { if (active) setReceiptError(error); }
  }
  receipts(); document.addEventListener('visibilitychange', receipts);
  return () => { active = false; document.removeEventListener('visibilitychange', receipts); };
 }, [latest, id, queryClient, status]);
 useEffect(() => {
  if (status === 'online') return;
  const timer = setInterval(() => queryClient.invalidateQueries({ queryKey: ['messages', user.id, id] }), 10000);
  return () => clearInterval(timer);
 }, [status, queryClient, id, user.id]);
 function draftChanged(value) {
  setDraft(value);
  if (!socket) return;
  if (value && Date.now() - typingAt.current > 1000) { socket.emit('typing:start', { conversationId: id }); typingAt.current = Date.now(); }
  clearTimeout(typingTimer.current);
  typingTimer.current = setTimeout(() => socket.emit('typing:stop', { conversationId: id }), 1800);
 }
 return <section className="space-y-4 min-w-0">
  <Button className="md:hidden" onClick={back}>Back to conversations</Button>
  <DataState query={detail}>{({ conversation }) => <header><h2 className="text-xl font-bold">{conversation.participant?.name || 'Unavailable account'}</h2><p>{conversation.participant?.online ? 'Online' : conversation.participant?.lastSeen ? 'Last seen ' + dateTime(conversation.participant.lastSeen) : 'Offline'}</p></header>}</DataState>
  {history.isPending && <p role="status">Loading messages...</p>}<ErrorNotice error={history.error} retry={() => history.refetch()} />
  {history.hasNextPage && <Button isLoading={history.isFetchingNextPage} onClick={() => history.fetchNextPage()}>Load earlier messages</Button>}
  <ol aria-label="Message history" className="space-y-3 max-h-[55vh] overflow-y-auto">{rows.map(row => <li key={row.id || row.clientId} className={'rounded-xl p-3 ' + (row.senderId === user.id ? 'bg-indigo-50 ml-6' : 'neu-inset mr-6')}>
   <p className="whitespace-pre-wrap break-words">{row.text}</p><AttachmentLinks ids={row.attachments} />
   <p className="text-xs text-slate-500">{dateTime(row.createdAt)} {row.senderId === user.id && (row.error ? 'Not confirmed' : row.pending ? 'Sending...' : row.readBy?.some(person => person !== user.id) ? 'Read' : row.deliveredTo?.some(person => person !== user.id) ? 'Delivered' : 'Saved')}</p>
   {row.error && <><ErrorNotice error={row.error} /><Button disabled={send.isPending} onClick={() => transmit({ clientId: row.clientId, text: row.text, attachments: row.attachments })}>Retry message</Button></>}
  </li>)}</ol>{!history.isPending && !history.isError && !rows.length && <p>No messages yet.</p>}
  {typing && status === 'online' && <p role="status">Typing...</p>}<ErrorNotice error={receiptError} />
  <form className="space-y-3" onSubmit={event => { event.preventDefault(); if (!draft.trim() && !attachments.length) return;
   transmit({ clientId: crypto.randomUUID(), text: draft.trim(), attachments: attachments.map(item => item.id) });
   setDraft(''); setAttachments([]); socket?.emit('typing:stop', { conversationId: id });
  }}><Field label="Message" multiline value={draft} maxLength={5000} onChange={event => draftChanged(event.target.value)} onBlur={() => socket?.emit('typing:stop', { conversationId: id })} />
   <FileUpload scope="conversation" contextId={id} value={attachments} onChange={setAttachments} />
   <Button type="submit" disabled={send.isPending || (!draft.trim() && !attachments.length)}>Send message</Button>
  </form>
 </section>;
}
export default function Messages() {
 const [params, setParams] = useSearchParams(), id = params.get('conversation'), page = Number(params.get('page') || 1);
 const query = useData(messaging.list({ page })), { status, error } = useSocket();
 const create = useAction(async form => { const result = await messaging.create(form.get('participantId')); setParams({ conversation: result.data.conversation.id }); });
 return <section className="space-y-5"><h1 className="text-2xl font-bold">Messages</h1>
  {status !== 'online' && <p role="status" className="rounded-xl p-3 bg-amber-50">{error || 'Real-time connection offline. Reconnecting; messages use the server API while it is reachable.'}</p>}
  <div className="grid md:grid-cols-[280px_1fr] gap-6"><aside className={(id ? 'hidden md:block ' : '') + 'space-y-4'}>
   <details><summary>Start a conversation</summary><form onSubmit={event => { event.preventDefault(); create.mutate(new FormData(event.currentTarget)); }}><Field label="Participant account ID" name="participantId" pattern="[a-fA-F0-9]{24}" required /><Button type="submit" isLoading={create.isPending}>Start conversation</Button><ErrorNotice error={create.error} /></form></details>
   <Records query={query} page={page} onPage={next => setParams({ ...(id ? { conversation: id } : {}), page: String(next) })}>{item => <button key={item.id} className="block text-left w-full neu-flat rounded-xl p-4" onClick={() => setParams({ conversation: item.id })}><strong>{item.participant?.name || 'Unavailable account'}</strong><p className="truncate">{item.lastMessage?.text}</p><span>{item.unreadCount} unread</span></button>}</Records>
  </aside>{id ? <Thread key={id} id={id} back={() => setParams({})} /> : <p>Select a conversation to view its history.</p>}</div>
 </section>;
}
