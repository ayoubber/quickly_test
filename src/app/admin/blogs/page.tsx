'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Blog {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    views?: number;
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadBlogs();
    }, []);

    async function loadBlogs() {
        const { data } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        setBlogs(data || []);
        setIsLoading(false);
    }

    async function deleteBlog(id: string) {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete blog');
        } else {
            toast.success('Blog deleted');
            loadBlogs();
        }
    }

    if (isLoading) {
        return <div className="animate-pulse">Loading blogs...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Blogs</h1>
                    <p className="text-gray-400">Manage your SEO articles</p>
                </div>
                <Link href="/admin/blogs/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Write New Article
                    </Button>
                </Link>
            </div>

            {/* Blogs List */}
            <div className="space-y-4">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="border-white/5 hover:border-brand-gold/20 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-brand-navy-light rounded-lg">
                                    <FileText className="w-6 h-6 text-brand-gold" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{blog.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className={`px-2 py-0.5 rounded text-xs ${blog.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="font-mono text-xs">/{blog.slug}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/blog/${blog.slug}`} target="_blank">
                                    <Button size="sm" variant="ghost">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/admin/blogs/${blog.id}`}>
                                    <Button size="sm" variant="ghost">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button size="sm" variant="ghost" className="text-red-400" onClick={() => deleteBlog(blog.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {blogs.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">No blogs yet.</p>
                            <Link href="/admin/blogs/new">
                                <Button variant="outline">Create your first article</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
