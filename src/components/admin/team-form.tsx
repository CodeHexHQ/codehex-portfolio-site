
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Save, Upload, Loader2, X } from 'lucide-react';
import type { Database } from '../../types/database';

type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface TeamFormProps {
    initialData?: TeamMember;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function TeamForm({ initialData, onSuccess, onCancel }: TeamFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<TeamMember>>({
        name: initialData?.name || '',
        role: initialData?.role || '',
        bio: initialData?.bio || '',
        image_url: initialData?.image_url || '',
        linkedin_url: initialData?.linkedin_url || '',
        twitter_url: initialData?.twitter_url || '',
        github_url: initialData?.github_url || '',
        display_order: initialData?.display_order || 0,
    });

    const handleChange = (field: keyof TeamMember, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('team_photos')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('team_photos')
                .getPublicUrl(filePath);

            handleChange('image_url', data.publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData?.id) {
                const { error } = await (supabase
                    .from('team_members') as any)
                    .update(formData)
                    .eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { error } = await (supabase
                    .from('team_members') as any)
                    .insert(formData);
                if (error) throw error;
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving team member:', error);
            alert('Failed to save team member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)} required placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={formData.role} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('role', e.target.value)} required placeholder="e.g. CEO & Founder" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex flex-col gap-4">
                    {formData.image_url && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleChange('image_url', '')}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="image-upload"
                        />
                        <Label
                            htmlFor="image-upload"
                            className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {uploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4" />
                            )}
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </Label>
                        {!formData.image_url && <span className="text-sm text-muted-foreground">Or</span>}
                        {!formData.image_url && (
                            <Input
                                value={formData.image_url}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('image_url', e.target.value)}
                                placeholder="Enter Image URL directly"
                                className="flex-1"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={formData.bio} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('bio', e.target.value)} required placeholder="Short bio..." className="h-32" />
            </div>

            <div className="space-y-4 border p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        <Input value={formData.linkedin_url || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('linkedin_url', e.target.value)} placeholder="URL" />
                    </div>
                    <div className="space-y-2">
                        <Label>Twitter</Label>
                        <Input value={formData.twitter_url || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('twitter_url', e.target.value)} placeholder="URL" />
                    </div>
                    <div className="space-y-2">
                        <Label>GitHub</Label>
                        <Input value={formData.github_url || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('github_url', e.target.value)} placeholder="URL" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading || uploading} className="w-32">
                    {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Member</>}
                </Button>
            </div>
        </form>
    );
}
