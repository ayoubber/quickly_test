import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | Quickly',
    description: 'Insights and updates from the Quickly team.',
};

async function getBlogs() {
    const supabase = createClient();
    const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    return data || [];
}

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <div className="min-h-screen bg-[#050510] text-white pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Our Blog</h1>
                    <p className="text-xl text-gray-400">Latest news, tips, and insights.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link href={`/blog/${blog.slug}`} key={blog.id} className="group">
                            <Card className="h-full bg-white/5 border-white/5 overflow-hidden hover:border-brand-gold/30 transition-all duration-300 hover:transform hover:-translate-y-1">
                                <div className="h-48 relative bg-brand-navy overflow-hidden">
                                    {blog.cover_image ? (
                                        <Image
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-navy-light to-brand-navy">
                                            <span className="text-4xl">📄</span>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-brand-gold mb-3">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-brand-gold transition-colors">{blog.title}</h2>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">{blog.excerpt || 'No description available.'}</p>

                                    <div className="flex items-center text-sm font-semibold text-white group-hover:translate-x-1 transition-transform">
                                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl">No articles published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
