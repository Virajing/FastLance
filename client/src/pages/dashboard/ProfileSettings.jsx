import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
  User,
  Mail,
  Building,
  MapPin,
  Globe,
  Bell,
  Shield,
  KeyRound,
  Check,
  X,
  Plus,
  Save,
  Camera,
  CheckCircle2
} from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [formData, setFormData] = useState({
    name: user?.name || 'Julian Thorne',
    email: user?.email || 'julian@hyperscale.ai',
    headline: user?.headline || 'Founder & CEO at HyperScale AI',
    company: user?.company || 'HyperScale AI',
    location: user?.location || 'San Francisco, CA',
    bio:
      user?.bio ||
      'Building enterprise autonomous agent infrastructure. Looking for senior fullstack engineers and product designers.',
    website: user?.website || 'https://hyperscale.ai',
    skills: user?.skills || ['Product Strategy', 'AI Agents', 'Venture Capital', 'Fullstack Hiring'],
    notifications: {
      emailOnMilestone: true,
      emailOnMessage: true,
      weeklySummary: true,
      marketingAlerts: false
    }
  });

  const [newSkillInput, setNewSkillInput] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleNotification = (key) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!newSkillInput.trim()) return;
    if (formData.skills.includes(newSkillInput.trim())) {
      addToast('Skill is already added.', 'warning');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()]
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        email: formData.email,
        headline: formData.headline,
        company: formData.company,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        skills: formData.skills
      });
      setIsSaving(false);
      addToast('Profile settings saved successfully!', 'success');
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Update your public profile, management details, notifications, and escrow security preferences.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="neu-flat rounded-2xl p-2 border border-white/80 flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'profile', label: 'Public Profile', icon: User },
          { key: 'skills', label: 'Skills & Expertise', icon: Building },
          { key: 'notifications', label: 'Escrow & Alerts', icon: Bell },
          { key: 'security', label: 'Security & 2FA', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'neu-pressed bg-[#e4e9f2] text-indigo-600 border border-indigo-200/60 shadow-inner'
                  : 'neu-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile Information */}
      {activeTab === 'profile' && (
        <Card variant="raised" padding="lg" className="border border-white/80 space-y-6">
          {/* Avatar & Cover Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200/70">
            <div className="relative group">
              <Avatar
                src={user?.avatar}
                name={formData.name}
                size="2xl"
                className="ring-4 ring-[#f0f3f8] shadow-md"
              />
              <button
                type="button"
                onClick={() => addToast('Avatar upload modal opened.', 'info')}
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-base font-bold text-slate-900">{formData.name}</h3>
              <p className="text-xs text-slate-500">{formData.headline}</p>
              <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                <Badge variant="primary" size="sm">
                  {user?.role === 'client' ? 'Verified Client' : 'Top Rated Freelancer'}
                </Badge>
                <Badge variant="success" size="sm">
                  Identity Confirmed
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                required={true}
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required={true}
              />
            </div>

            <Input
              label="Professional Headline"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="e.g. Senior Fullstack Engineer or Founder @ Acme"
              required={true}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Organization"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                leftIcon={<Building className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <Input
              label="Website or Portfolio Link"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              leftIcon={<Globe className="w-4 h-4 text-slate-400" />}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio / Summary
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full neu-inset rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200/70">
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSaving}
                className="gap-2 shadow-indigo-500/20"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Skills & Expertise */}
      {activeTab === 'skills' && (
        <Card variant="raised" padding="lg" className="border border-white/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Skills & Tech Stack Tags</h3>
            <p className="text-xs text-slate-500 mt-1">
              These tags enhance matchmaking algorithms and help clients or collaborators locate your contracts.
            </p>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Add a new skill (e.g. Next.js, Solana, AI Fine-Tuning)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="gap-1.5 shrink-0">
              <Plus className="w-4 h-4" />
              Add Tag
            </Button>
          </form>

          {/* Chips list */}
          <div className="neu-inset rounded-2xl p-4 min-h-[120px] flex flex-wrap gap-2 content-start">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="neu-flat px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 border border-white/90 group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200/70">
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isSaving}
              onClick={handleSave}
              className="gap-2 shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              Save Skills
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 3: Notifications & Escrow Alerts */}
      {activeTab === 'notifications' && (
        <Card variant="raised" padding="lg" className="border border-white/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Escrow & Notification Preferences</h3>
            <p className="text-xs text-slate-500 mt-1">
              Control when FastLance notifies you regarding funds, milestone submissions, and messages.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-200/70">
            {[
              {
                key: 'emailOnMilestone',
                title: 'Milestone Submissions & Approvals',
                desc: 'Get notified instantly when a freelancer submits work or escrow is unlocked.'
              },
              {
                key: 'emailOnMessage',
                title: 'Direct Chat Messages',
                desc: 'Receive immediate email notifications for unread messages.'
              },
              {
                key: 'weeklySummary',
                title: 'Weekly Escrow & Financial Velocity Report',
                desc: 'A Monday digest of spending, upcoming deadlines, and active talent.'
              },
              {
                key: 'marketingAlerts',
                title: 'Platform Perks & Product Announcements',
                desc: 'Updates on new features, reduced fee tiers, and startup grants.'
              }
            ].map((item) => (
              <div
                key={item.key}
                className="pt-4 first:pt-0 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification(item.key)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer shrink-0 p-0.5 ${
                    formData.notifications[item.key]
                      ? 'bg-indigo-600'
                      : 'neu-inset bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      formData.notifications[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200/70">
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isSaving}
              onClick={handleSave}
              className="gap-2 shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              Save Notification Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <Card variant="raised" padding="lg" className="border border-white/80 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
            <p className="text-xs text-slate-500 mt-1">
              Manage your password, two-factor authentication, and authorized devices.
            </p>
          </div>

          <div className="neu-inset rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-slate-500">
                  Secured with Authenticator App (TOTP)
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => addToast('2FA settings configured.', 'info')}>
              Configure
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addToast('Password successfully updated!', 'success');
            }}
            className="space-y-4 pt-2"
          >
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm password"
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="md">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ProfileSettings;
