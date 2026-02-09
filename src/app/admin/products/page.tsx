'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Package, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price),
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

        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '' });
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
                <Button onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({ name: '', description: '', price: '' }); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <Button type="submit">
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
                        <div className="h-32 bg-gradient-to-br from-brand-navy-dark to-brand-navy flex items-center justify-center">
                            <Package className="w-12 h-12 text-brand-gold" />
                        </div>
                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{product.name}</h3>
                                {!product.is_active && (
                                    <span className="text-xs px-2 py-1 bg-gray-500/20 rounded">Hidden</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold">{product.price.toLocaleString()} DZD</span>
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
