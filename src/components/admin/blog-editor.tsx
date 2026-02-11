'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Save, ArrowLeft, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogEditorProps {
    blogId?: string; // If present, we are editing
}

export default function BlogEditor({ blogId }: BlogEditorProps) {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(!!blogId);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        is_published: false,
    });

    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(null);

    useEffect(() => {
        if (blogId) {
            loadBlog(blogId);
        }
    }, [blogId]);

    async function loadBlog(id: string) {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            toast.error('Failed to load blog');
            router.push('/admin/blogs');
            return;
        }

        setFormData({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || '',
            content: data.content || '',
            is_published: data.is_published,
        });
        setCurrentCoverImage(data.cover_image);
        setIsLoading(false);
    }

    // Auto-generate slug from title if slug is empty
    useEffect(() => {
        if (!blogId && formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title]);

    async function handleImageUpload(file: File): Promise<string | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, file);

        if (uploadError) {
            toast.error('Error uploading image');
            return null;
        }

        const { data } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);

        let coverImageUrl = currentCoverImage;

        if (coverImageFile) {
            const url = await handleImageUpload(coverImageFile);
            if (url) {
                coverImageUrl = url;
            }
        }

        const blogData = {
            ...formData,
            cover_image: coverImageUrl,
        };

        if (blogId) {
            const { error } = await supabase
                .from('blogs')
                .update(blogData)
                .eq('id', blogId);

            if (error) {
                toast.error('Failed to update blog');
            } else {
                toast.success('Blog updated');
                router.refresh();
            }
        } else {
            const { error } = await supabase
                .from('blogs')
                .insert(blogData);

            if (error) {
                toast.error('Failed to create blog');
            } else {
                toast.success('Blog created');
                router.push('/admin/blogs');
            }
        }

        setIsSaving(false);
    }

    if (isLoading) {
        return <div className="animate-pulse">Loading editor...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-4 z-50 bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs">
                        <Button type="button" variant="ghost">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold">{blogId ? 'Edit Article' : 'New Article'}</h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, is_published: !prev.is_published }))}
                        className={formData.is_published ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}
                    >
                        {formData.is_published ? 'Published' : 'Draft'}
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Main Info */}
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Input
                            label="Article Title"
                            placeholder="e.g. 10 Tips for Better SEO"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Slug (URL)"
                                placeholder="10-tips-for-seo"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Cover Image */}
                <Card>
                    <CardContent className="p-6">
                        <label className="block text-sm font-medium mb-4">Cover Image</label>

                        <div className="relative h-64 bg-white/5 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group hover:border-brand-gold/50 transition-colors">
                            {(coverImageFile || currentCoverImage) ? (
                                <>
                                    <img
                                        src={coverImageFile ? URL.createObjectURL(coverImageFile) : currentCoverImage!}
                                        className="w-full h-full object-cover"
                                        alt="Cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                                        <Button type="button" variant="secondary" onClick={() => document.getElementById('cover-upload')?.click()}>
                                            Change
                                        </Button>
                                        <Button type="button" variant="danger" onClick={() => { setCoverImageFile(null); setCurrentCoverImage(null); }}>
                                            Remove
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 cursor-pointer" onClick={() => document.getElementById('cover-upload')?.click()}>
                                    <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-400">Click to upload cover image</p>
                                    <p className="text-xs text-gray-600 mt-1">1200x630px recommended</p>
                                </div>
                            )}
                            <input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                    if (e.target.files?.[0]) setCoverImageFile(e.target.files[0]);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Content Editor - Simple Textarea for now, can be upgraded to Tiptap later */}
                <Card className="min-h-[500px]">
                    <CardContent className="p-0">
                        <textarea
                            className="w-full h-[600px] p-8 bg-transparent border-0 focus:ring-0 resize-none font-mono text-lg leading-relaxed"
                            placeholder="# Write your article here (Markdown supported)..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </CardContent>
                </Card>

                {/* Excerpt */}
                <Card>
                    <CardContent className="p-6">
                        <label className="block text-sm font-medium mb-2">Excerpt (SEO Description)</label>
                        <textarea
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
                            rows={3}
                            placeholder="Short summary for search engines and social media..."
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
