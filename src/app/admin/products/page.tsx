'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Package, Plus, Edit2, Trash2, Eye, EyeOff, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[] | null;
    is_active: boolean;
    created_at: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>([]);

    const supabase = createClient();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        setProducts(data || []);
        setIsLoading(false);
    }

    async function handleImageUpload(file: File): Promise<string | null> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) {
            toast.error('Error uploading image');
            return null;
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsUploading(true);

        let imageUrls = [...currentImages];

        if (imageFile) {
            const url = await handleImageUpload(imageFile);
            if (url) {
                imageUrls = [url]; // For now, simple single image. Use [...imageUrls, url] for multiple.
            }
        }

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price),
            images: imageUrls,
            is_active: true,
        };

        if (editingProduct) {
            const { error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', editingProduct.id);

            if (error) {
                toast.error('Failed to update product');
            } else {
                toast.success('Product updated');
            }
        } else {
            const { error } = await supabase
                .from('products')
                .insert(productData);

            if (error) {
                toast.error('Failed to create product');
            } else {
                toast.success('Product created');
            }
        }

        setIsUploading(false);
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '' });
        setImageFile(null);
        setCurrentImages([]);
        loadProducts();
    }

    async function toggleProductStatus(product: Product) {
        const { error } = await supabase
            .from('products')
            .update({ is_active: !product.is_active })
            .eq('id', product.id);

        if (error) {
            toast.error('Failed to update product');
        } else {
            loadProducts();
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm('Delete this product?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete product');
        } else {
            toast.success('Product deleted');
            loadProducts();
        }
    }

    function openEditForm(product: Product) {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
        });
        setCurrentImages(product.images || []);
        setShowForm(true);
    }

    if (isLoading) {
        return <div className="animate-pulse">Loading products...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Products</h1>
                    <p className="text-gray-400">Manage your card products</p>
                </div>
                <Button onClick={() => {
                    setShowForm(true);
                    setEditingProduct(null);
                    setFormData({ name: '', description: '', price: '' });
                    setCurrentImages([]);
                    setImageFile(null);
                }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="mb-6 border-brand-gold/20">
                    <CardHeader>
                        <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Image Upload */}
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-2">Product Image</label>
                                <div className="flex items-center gap-4">
                                    {/* Preview */}
                                    <div className="relative w-24 h-24 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                                        {imageFile ? (
                                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : currentImages.length > 0 ? (
                                            <div className="relative w-full h-full group">
                                                <img src={currentImages[0]} alt="Current" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer" onClick={() => setCurrentImages([])}>
                                                    <X className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setImageFile(e.target.files[0]);
                                                }
                                            }}
                                            className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-brand-gold/10 file:text-brand-gold
                                                hover:file:bg-brand-gold/20
                                            "
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Recommended: 500x500px </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Price (DZD)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50 resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={isUploading}>
                                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingProduct(null); }}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className={!product.is_active ? 'opacity-60' : ''}>
                        <div className="h-48 bg-gradient-to-br from-brand-navy-dark to-brand-navy flex items-center justify-center relative overflow-hidden group">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <Package className="w-12 h-12 text-brand-gold opacity-50" />
                            )}
                        </div>
                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                                {!product.is_active && (
                                    <span className="text-xs px-2 py-1 bg-gray-500/20 rounded">Hidden</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mb-4 h-10 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-brand-gold">{product.price.toLocaleString()} DZD</span>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="ghost" onClick={() => toggleProductStatus(product)}>
                                        {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => openEditForm(product)}>
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-400" onClick={() => deleteProduct(product.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {products.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No products yet. Create your first product!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
