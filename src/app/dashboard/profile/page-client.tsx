'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProfile, updateTheme, updateTemplate, checkUsernameAvailability, uploadAvatar } from '@/actions/profile';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'sonner';
import { Check, X, Loader2, Upload, Camera, Lock } from 'lucide-react';
import { ThemeConfig, TemplateId, DEFAULT_THEME, FONT_OPTIONS, RADIUS_OPTIONS } from '@/types/theme';
import Image from 'next/image';

export default function ProfileEditPageClient({
  initialProfile
}: {
  initialProfile: any
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [theme, setTheme] = useState<ThemeConfig>(initialProfile.theme_json || DEFAULT_THEME);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(initialProfile.template_id || 'classic');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (!profile.username || profile.username === initialProfile.username) {
      setUsernameStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const result = await checkUsernameAvailability(profile.username);
      setUsernameStatus(result.available ? 'available' : 'taken');
      setIsCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [profile.username, initialProfile.username]);

  async function handleSaveProfile() {
    setIsSaving(true);

    const formData = new FormData();
    formData.append('full_name', profile.full_name || '');
    formData.append('username', profile.username || '');
    formData.append('bio', profile.bio || '');
    formData.append('contact_email', profile.contact_email || '');
    formData.append('contact_phone', profile.contact_phone || '');
    formData.append('location', profile.location || '');

    const result = await updateProfile(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated!');
    }

    setIsSaving(false);
  }

  async function handleSaveTheme() {
    setIsSaving(true);
    const result = await updateTheme(theme);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Theme updated!');
    }

    setIsSaving(false);
  }

  async function handleSelectTemplate(template: TemplateId) {
    setSelectedTemplate(template);
    const result = await updateTemplate(template);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Template updated!');
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadAvatar(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Avatar uploaded!');
      setProfile({ ...profile, avatar_url: result.url });
    }
    setIsUploading(false);
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Settings */}
        <div className="space-y-6">
          {/* Avatar & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-brand-navy-light border-2 border-white/10">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">Profile Photo</h3>
                  <p className="text-sm text-gray-400">
                    Recommended: Square JPG or PNG, max 5MB.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />

                <div>
                  <Input
                    label="Username"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    placeholder="johndoe"
                    helper={initialProfile.username ? undefined : "Your public profile URL: quickly.website/u/yourname"}
                    disabled={!!initialProfile.username}
                  />
                  {initialProfile.username && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-amber-400">
                      <Lock className="w-4 h-4" />
                      <span>Username is permanent and cannot be changed (used for QR codes & printed cards)</span>
                    </div>
                  )}
                  {isCheckingUsername && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking availability...</span>
                    </div>
                  )}
                  {usernameStatus === 'available' && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-500">
                      <Check className="w-4 h-4" />
                      <span>Username available!</span>
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
                      <X className="w-4 h-4" />
                      <span>Username taken</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-brand-navy-light border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-200"
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell people about yourself..."
                    maxLength={500}
                  />
                  <p className="mt-1 text-xs text-gray-400">{(profile.bio || '').length}/500</p>
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={profile.contact_email || ''}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  placeholder="your@email.com"
                />

                <Input
                  label="Phone"
                  value={profile.contact_phone || ''}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />

                <Input
                  label="Location"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />

                <Button onClick={handleSaveProfile} isLoading={isSaving}>
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {(['classic', 'card', 'split', 'bento', 'glitch', 'minimal', 'influence', 'wave'] as TemplateId[]).map((template) => (
                  <button
                    key={template}
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-4 rounded-lg border-2 transition hover:scale-105 ${selectedTemplate === template
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-white/10 bg-brand-navy-light'
                      }`}
                  >
                    <div className="text-sm font-semibold capitalize">{template}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card>
            <CardHeader>
              <CardTitle>Customize Theme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Background</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme({ ...theme, bgType: 'solid' })}
                    className={`flex-1 py-2 px-4 rounded-lg border transition ${theme.bgType === 'solid'
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-white/10 bg-brand-navy-light'
                      }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => setTheme({ ...theme, bgType: 'gradient' })}
                    className={`flex-1 py-2 px-4 rounded-lg border transition ${theme.bgType === 'gradient'
                      ? 'border-brand-gold bg-brand-gold/10'
                      : 'border-white/10 bg-brand-navy-light'
                      }`}
                  >
                    Gradient
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {theme.bgType === 'gradient' ? 'Color 1' : 'Background'}
                  </label>
                  <HexColorPicker color={theme.bg1} onChange={(color) => setTheme({ ...theme, bg1: color })} />
                  <input
                    type="text"
                    value={theme.bg1}
                    onChange={(e) => setTheme({ ...theme, bg1: e.target.value })}
                    className="mt-2 w-full px-3 py-2 rounded-lg bg-brand-navy-light border border-white/10 text-white text-sm"
                  />
                </div>

                {theme.bgType === 'gradient' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Color 2</label>
                    <HexColorPicker color={theme.bg2 || '#000'} onChange={(color) => setTheme({ ...theme, bg2: color })} />
                    <input
                      type="text"
                      value={theme.bg2 || ''}
                      onChange={(e) => setTheme({ ...theme, bg2: e.target.value })}
                      className="mt-2 w-full px-3 py-2 rounded-lg bg-brand-navy-light border border-white/10 text-white text-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Button Color</label>
                <HexColorPicker color={theme.primary} onChange={(color) => setTheme({ ...theme, primary: color })} />
                <input
                  type="text"
                  value={theme.primary}
                  onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                  className="mt-2 w-full px-3 py-2 rounded-lg bg-brand-navy-light border border-white/10 text-white text-sm"
                />
              </div>

              {/* Font */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Font</label>
                <select
                  value={theme.font}
                  onChange={(e) => setTheme({ ...theme, font: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg bg-brand-navy-light border border-white/10 text-white"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Button Style</label>
                <div className="flex gap-2">
                  {RADIUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme({ ...theme, radius: option.value as any })}
                      className={`flex-1 py-2 px-4 rounded-lg border transition ${theme.radius === option.value
                        ? 'border-brand-gold bg-brand-gold/10'
                        : 'border-white/10 bg-brand-navy-light'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveTheme} isLoading={isSaving}>
                Save Theme
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] bg-brand-navy-dark rounded-lg overflow-hidden border border-white/10 relative">
                <div
                  className="w-full h-full p-8 flex flex-col items-center justify-center"
                  style={{
                    background: theme.bgType === 'gradient'
                      ? `linear-gradient(${theme.bgGradientAngle || 135}deg, ${theme.bg1}, ${theme.bg2})`
                      : theme.bg1,
                  }}
                >
                  <div className="w-20 h-20 rounded-full mb-4 overflow-hidden bg-white/10">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>
                    {profile.full_name || 'Your Name'}
                  </h2>
                  <p className="text-sm text-center mb-6 opacity-80" style={{ color: theme.text }}>
                    {profile.bio || 'Your bio here...'}
                  </p>
                  <div className="w-full space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-full py-3 px-4 text-center font-semibold text-sm"
                        style={{
                          backgroundColor: theme.primary,
                          color: '#0B0F1A',
                          borderRadius: theme.radius === 'sm' ? '4px' : theme.radius === 'md' ? '8px' : '12px',
                        }}
                      >
                        Link {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
