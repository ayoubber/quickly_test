import BlogEditor from '@/components/admin/blog-editor';

export default function EditBlogPage({ params }: { params: { id: string } }) {
    return <BlogEditor blogId={params.id} />;
}
