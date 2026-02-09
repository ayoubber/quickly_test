'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createLink, updateLink, deleteLink, toggleLink, reorderLinks } from '@/actions/links';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { SocialIcon } from '@/components/ui/social-icon';

export default function LinksPage({ initialLinks = [] }: { initialLinks: any[] }) {
    const [links, setLinks] = useState(initialLinks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: any) {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = links.findIndex((l) => l.id === active.id);
            const newIndex = links.findIndex((l) => l.id === over.id);
            const newLinks = arrayMove(links, oldIndex, newIndex);
            setLinks(newLinks);

            await reorderLinks(newLinks.map(l => l.id));
            toast.success('Links reordered');
        }
    }

    async function handleToggle(id: string) {
        // Optimistic update
        const newLinks = links.map(l =>
            l.id === id ? { ...l, is_active: !l.is_active } : l
        );
        setLinks(newLinks);

        await toggleLink(id);
        toast.success('Link updated');
    }

    async function handleDelete(id: string) {
        if (confirm('Delete this link?')) {
            setLinks(links.filter(l => l.id !== id));
            await deleteLink(id);
            toast.success('Link deleted');
        }
    }

    function openEditModal(link: any) {
        setEditingLink(link);
        setIsModalOpen(true);
    }

    function openAddModal() {
        setEditingLink(null);
        setIsModalOpen(true);
    }

    return (
        <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Links</h1>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                </Button>
            </div>

            {/* Add/Edit Form Modal */}
            {isModalOpen && (
                <LinkFormModal
                    initialData={editingLink}
                    onClose={() => setIsModalOpen(false)}
                    onSave={async (linkData: any) => {
                        const formData = new FormData();
                        Object.entries(linkData).forEach(([key, value]) => {
                            formData.append(key, String(value));
                        });

                        try {
                            if (editingLink) {
                                const result = await updateLink(editingLink.id, formData);
                                if (result?.error) {
                                    toast.error(result.error);
                                    return;
                                }
                                toast.success('Link updated!');
                                // Update local state for immediate feedback
                                setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...linkData } : l));
                            } else {
                                const result = await createLink(formData);
                                if (result?.error) {
                                    toast.error(result.error);
                                    return;
                                }
                                toast.success('Link added!');
                                window.location.reload();
                            }
                            setIsModalOpen(false);
                            setEditingLink(null);
                        } catch (e) {
                            toast.error('Something went wrong');
                        }
                    }}
                />
            )}

            {/* Links List - Sortable */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {links.map((link) => (
                            <SortableLink
                                key={link.id}
                                link={link}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                onEdit={() => openEditModal(link)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {links.length === 0 && (
                <Card className="p-12 text-center text-gray-400">
                    <p>No links yet. Click "Add Link" to get started!</p>
                </Card>
            )}
        </div>
    );
}

function SortableLink({ link, onToggle, onDelete, onEdit }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="glass rounded-lg p-4 flex items-center gap-4">
            <div {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-white">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {link.icon && <SocialIcon icon={link.icon} className="w-5 h-5" />}
                    <span className="font-semibold">{link.title}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{link.url}</p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onToggle(link.id)}
                    className={`p-2 rounded-lg transition ${link.is_active ? 'text-brand-gold hover:bg-brand-gold/10' : 'text-gray-500 hover:bg-white/5'
                        }`}
                >
                    {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={onEdit} className="p-2 rounded-lg text-blue-400 hover:bg-blue-400/10">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(link.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

import { detectSocialPlatform } from '@/components/ui/social-icon';

function LinkFormModal({ onClose, onSave, initialData }: any) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        url: initialData?.url || '',
        icon: initialData?.icon || '',
        is_active: initialData?.is_active ?? true,
    });

    // Auto-detect icon when URL changes
    useEffect(() => {
        // Only if not editing an existing link (or maybe even then if icon is empty?)
        // Let's do it if icon is empty or if it matches a previous auto-detection
        if (!formData.url) return;

        const detected = detectSocialPlatform(formData.url);
        if (detected && !formData.icon) {
            setFormData(prev => ({ ...prev, icon: detected }));
        }
    }, [formData.url]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Link' : 'Add Link'}</h2>

                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="My Instagram"
                    />

                    <Input
                        label="URL"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://instagram.com/username"
                    />

                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Input
                                label="Icon"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="instagram, tiktok, or emoji 📷"
                            />
                        </div>
                        {/* Preview Icon */}
                        {formData.icon && (
                            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <SocialIcon icon={formData.icon} className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        Type a social name (instagram, tiktok) or paste an emoji.
                        We auto-detect from URL!
                    </p>

                    <div className="flex gap-2">
                        <Button onClick={() => onSave(formData)} className="flex-1">Save</Button>
                        <Button onClick={onClose} variant="outline">Cancel</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
