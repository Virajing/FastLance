import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CONVERSATIONS } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  Send,
  Paperclip,
  Search,
  CheckCheck,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';

export const Messages = () => {
  const [searchParams] = useSearchParams();
  const toParam = searchParams.get('to');
  const { addToast } = useToast();

  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState(() => {
    if (toParam) {
      const match = CONVERSATIONS.find(
        (c) =>
          c.participant.name.toLowerCase().includes(toParam.toLowerCase()) ||
          c.participant.id === toParam
      );
      if (match) return match.id;
    }
    return CONVERSATIONS[0]?.id || 'conv-1';
  });

  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(!!toParam);

  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  // Handle URL change
  useEffect(() => {
    if (toParam) {
      const match = conversations.find(
        (c) =>
          c.participant.name.toLowerCase().includes(toParam.toLowerCase()) ||
          c.participant.id === toParam
      );
      if (match) {
        setSelectedConvId(match.id);
        setShowMobileChat(true);
      }
    }
  }, [toParam, conversations]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageText.trim()) return;

    const userMessage = {
      id: 'm-' + Date.now(),
      senderId: 'me',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    // Update conversation
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: {
              text: userMessage.text,
              timestamp: userMessage.timestamp,
              senderId: 'me'
            },
            messages: [...c.messages, userMessage]
          };
        }
        return c;
      })
    );

    setMessageText('');

    // Simulate freelancer reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "Thanks for the message! I'm inspecting the latest code build right now.",
        'Got it! That aligns perfectly with our milestone timeline.',
        'Working on this update today. Will send over the commit hash soon!',
        'Understood. I will push the requested revision to GitHub shortly.'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMsg = {
        id: 'm-reply-' + Date.now(),
        senderId: activeConv.participant.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConv.id) {
            return {
              ...c,
              lastMessage: {
                text: replyMsg.text,
                timestamp: replyMsg.timestamp,
                senderId: activeConv.participant.id
              },
              messages: [...c.messages, replyMsg]
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const handleAttachFile = () => {
    addToast('Attached mockup file: "dashboard-revision-v2.fig"', 'info');
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.participant.name.toLowerCase().includes(q) ||
      c.participant.title.toLowerCase().includes(q) ||
      c.lastMessage.text.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[550px] neu-flat rounded-3xl border border-white/80 overflow-hidden flex flex-col md:flex-row">
      {/* Left Conversations Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200/70 flex flex-col bg-[#f0f3f8] shrink-0 ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Search header */}
        <div className="p-4 border-b border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Direct Messages</h2>
            <Badge variant="primary" size="sm">
              {conversations.length} Active
            </Badge>
          </div>
          <Input
            placeholder="Search messages or talent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            clearable={true}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200/40 p-2 space-y-1">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConvId(conv.id);
                  setShowMobileChat(true);
                }}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'neu-pressed bg-[#e4e9f2] border border-indigo-200/50'
                    : 'hover:bg-slate-100/80'
                }`}
              >
                <Avatar
                  src={conv.participant.avatar}
                  name={conv.participant.name}
                  size="md"
                  status={conv.participant.online ? 'online' : 'offline'}
                  className="shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {conv.participant.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessage.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                    {conv.participant.title}
                  </p>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    {conv.lastMessage.senderId === 'me' ? 'You: ' : ''}
                    {conv.lastMessage.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div
        className={`flex-1 flex flex-col bg-[#eef2f7] ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 bg-[#f0f3f8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-1.5 rounded-xl neu-sm text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Avatar
                  src={activeConv.participant.avatar}
                  name={activeConv.participant.name}
                  size="md"
                  status={activeConv.participant.online ? 'online' : 'offline'}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeConv.participant.name}
                    </h3>
                    <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                      Escrow Active
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {activeConv.participant.online ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active now
                      </span>
                    ) : (
                      activeConv.participant.lastSeen
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/freelancers/${activeConv.participant.id}`}
                  className="neu-sm hover:neu-flat-hover px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all border border-white/60"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToast('Escrow milestones: 2 completed, 1 active.', 'info')}
                  className="text-xs hidden sm:flex"
                >
                  Contracts
                </Button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Escrow safety alert pill */}
              <div className="flex justify-center">
                <div className="neu-inset rounded-full px-4 py-1.5 text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Always keep communication and payments inside FastLance Escrow</span>
                </div>
              </div>

              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all ${
                      msg.isOwn
                        ? 'bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/20 rounded-br-none'
                        : 'neu-raised bg-white/90 text-slate-800 border border-white rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Optional attachment */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1.5">
                        {msg.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="neu-inset rounded-xl p-2 flex items-center gap-2 text-xs text-slate-800 bg-white/70"
                          >
                            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="font-semibold truncate flex-1">{att.name}</span>
                            <span className="text-[10px] text-slate-500 shrink-0">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp} {msg.isOwn && '• Sent'}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic py-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  <span>{activeConv.participant.name} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-[#f0f3f8] border-t border-slate-200/80">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAttachFile}
                  title="Attach file"
                  className="p-2.5 rounded-xl neu-sm hover:neu-flat-hover text-slate-500 hover:text-indigo-600 transition-all cursor-pointer border border-white/60 shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Message ${activeConv.participant.name}...`}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full neu-inset rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!messageText.trim()}
                  className="gap-1.5 shrink-0 px-4"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
