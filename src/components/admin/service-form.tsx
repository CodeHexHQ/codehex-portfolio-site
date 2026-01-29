
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Database } from '../../types/database';

type ServiceDetails = Database['public']['Tables']['service_details']['Row'];
type Service = Database['public']['Tables']['services']['Row'];

interface ServiceFormProps {
    initialData?: ServiceDetails;
    serviceId?: string; // If creating new detail for a service
    onSuccess?: () => void;
}

export function ServiceForm({ initialData, serviceId, onSuccess }: ServiceFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState<Service[]>([]);

    // Form State
    const [selectedServiceId, setSelectedServiceId] = useState(initialData?.service_id || serviceId || '');
    const [formData, setFormData] = useState<Partial<ServiceDetails>>({
        slug: initialData?.slug || '',
        icon_name: initialData?.icon_name || 'Globe',
        card_title: initialData?.card_title || '',
        card_description: initialData?.card_description || '',
        header_title: initialData?.header_title || '',
        header_description: initialData?.header_description || '',
        benefits: initialData?.benefits || [],
        tech_stack: initialData?.tech_stack || [],
        success_stories: initialData?.success_stories || [],
    });

    useEffect(() => {
        // Fetch services for dropdown if not provided
        const fetchServices = async () => {
            const { data } = await supabase.from('services').select('*');
            if (data) setServices(data);
        };
        fetchServices();
    }, []);

    const handleChange = (field: keyof ServiceDetails, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Helper for array fields
    const addBenefit = () => {
        const benefits = [...(formData.benefits || []), ''];
        handleChange('benefits', benefits);
    };

    const updateBenefit = (index: number, value: string) => {
        const benefits = [...(formData.benefits || [])];
        benefits[index] = value;
        handleChange('benefits', benefits);
    };

    const removeBenefit = (index: number) => {
        const benefits = [...(formData.benefits || [])];
        benefits.splice(index, 1);
        handleChange('benefits', benefits);
    };

    // Tech Stack Helpers
    // @ts-ignore
    const addTech = () => handleChange('tech_stack', [...(formData.tech_stack as any[] || []), { name: '', icon: '', description: '' }]);
    // @ts-ignore
    const updateTech = (index: number, field: string, value: string) => {
        // @ts-ignore
        const newStack = [...(formData.tech_stack as any[] || [])];
        newStack[index] = { ...newStack[index], [field]: value };
        handleChange('tech_stack', newStack);
    };
    // @ts-ignore
    const removeTech = (index: number) => {
        // @ts-ignore
        const newStack = [...(formData.tech_stack as any[] || [])];
        newStack.splice(index, 1);
        handleChange('tech_stack', newStack);
    };

    // Success Stories Helpers
    // @ts-ignore
    const addStory = () => handleChange('success_stories', [...(formData.success_stories as any[] || []), { title: '', client: '', image_url: '', link: '' }]);
    // @ts-ignore
    const updateStory = (index: number, field: string, value: string) => {
        // @ts-ignore
        const newStories = [...(formData.success_stories as any[] || [])];
        newStories[index] = { ...newStories[index], [field]: value };
        handleChange('success_stories', newStories);
    };
    // @ts-ignore
    const removeStory = (index: number) => {
        // @ts-ignore
        const newStories = [...(formData.success_stories as any[] || [])];
        newStories.splice(index, 1);
        handleChange('success_stories', newStories);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                service_id: selectedServiceId,
            };

            if (initialData?.id) {
                const { error } = await (supabase
                    .from('service_details') as any)
                    .update(payload)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await (supabase
                    .from('service_details') as any)
                    .insert(payload);
                if (error) throw error;
            }

            if (onSuccess) onSuccess();
            else navigate('/admin/services');
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Service Category</Label>
                    <select
                        className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedServiceId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedServiceId(e.target.value)}
                        disabled={!!initialData || !!serviceId}
                        required
                    >
                        <option value="">Select a Service...</option>
                        {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input value={formData.slug} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('slug', e.target.value)} required />
                </div>

                <div className="space-y-2">
                    <Label>Icon Name</Label>
                    <Input value={formData.icon_name} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('icon_name', e.target.value)} required placeholder="e.g. Globe, Smartphone" />
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Home Page Card</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label>Card Title</Label>
                        <Input value={formData.card_title} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('card_title', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Card Description</Label>
                        <Textarea value={formData.card_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('card_description', e.target.value)} required />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Service Page Details</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label>Header Title</Label>
                        <Input value={formData.header_title} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('header_title', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Header Description</Label>
                        <Textarea value={formData.header_description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('header_description', e.target.value)} required />
                    </div>
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Benefits</h3>
                    <Button type="button" onClick={addBenefit} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Benefit</Button>
                </div>
                <div className="space-y-2">
                    {formData.benefits?.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <Input value={benefit} onChange={(e: ChangeEvent<HTMLInputElement>) => updateBenefit(index, e.target.value)} placeholder="Benefit description" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Tech Stack</h3>
                    <Button type="button" onClick={addTech} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Tech</Button>
                </div>
                <div className="space-y-4">
                    {(formData.tech_stack as any[])?.map((tech: any, index: number) => (
                        <div key={index} className="flex flex-col md:flex-row gap-2 border-b pb-4">
                            <Input className="flex-1" value={tech.name} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTech(index, 'name', e.target.value)} placeholder="Name (e.g. React)" />
                            <Input className="flex-1" value={tech.icon} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTech(index, 'icon', e.target.value)} placeholder="Icon key or URL" />
                            <Input className="flex-[2]" value={tech.description} onChange={(e: ChangeEvent<HTMLInputElement>) => updateTech(index, 'description', e.target.value)} placeholder="Description" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTech(index)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Success Stories</h3>
                    <Button type="button" onClick={addStory} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Story</Button>
                </div>
                <div className="space-y-4">
                    {(formData.success_stories as any[])?.map((story: any, index: number) => (
                        <div key={index} className="flex flex-col gap-2 border-b pb-4 bg-muted/20 p-2 rounded">
                            <div className="flex gap-2">
                                <Input className="flex-1" value={story.title} onChange={(e: ChangeEvent<HTMLInputElement>) => updateStory(index, 'title', e.target.value)} placeholder="Project Title" />
                                <Input className="flex-1" value={story.client} onChange={(e: ChangeEvent<HTMLInputElement>) => updateStory(index, 'client', e.target.value)} placeholder="Client Name" />
                            </div>
                            <div className="flex gap-2">
                                <Input className="flex-1" value={story.image_url} onChange={(e: ChangeEvent<HTMLInputElement>) => updateStory(index, 'image_url', e.target.value)} placeholder="Image URL (Unsplash etc)" />
                                <Input className="flex-1" value={story.link} onChange={(e: ChangeEvent<HTMLInputElement>) => updateStory(index, 'link', e.target.value)} placeholder="Project Link / Blog Post URL" />
                            </div>
                            <div className="flex justify-end">
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeStory(index)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/services')}>Cancel</Button>
                <Button type="submit" disabled={loading} className="w-32">
                    {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Service</>}
                </Button>
            </div>
        </form>
    );
}
