import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

async function getBlog(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('blogs')
        .select('*, profiles(full_name, avatar_url)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
    return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const blog = await getBlog(params.slug);
    if (!blog) return { title: 'Not Found' };

    return {
        title: `${blog.title} | Quickly`,
        description: blog.excerpt,
        openGraph: {
            title: blog.title,
            description: blog.excerpt || undefined,
            images: blog.cover_image ? [blog.cover_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const blog = await getBlog(params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-[#050510] text-white pt-24 pb-20">
            {/* Hero */}
            <div className="relative h-[400px] w-full mb-12">
                {blog.cover_image ? (
                    <Image
                        src={blog.cover_image}
                        alt={blog.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-light to-brand-navy opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050510] to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white pl-0">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 text-brand-gold mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl">{blog.title}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="prose prose-invert prose-lg max-w-none">
                    {/* Safe rendering for MVP */}
                    <div className="whitespace-pre-wrap">{blog.content}</div>
                </div>

                <hr className="border-white/10 my-12" />

                <div className="flex justify-between items-center">
                    <p className="text-gray-400">Share this article</p>
                    {/* Social Share buttons could go here */}
                </div>
            </div>
        </article>
    );
}
