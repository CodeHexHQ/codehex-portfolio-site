import { useEffect, useState } from "react"
import { AdminLayout } from "../../../components/admin/admin-layout"
import { AuthGuard } from "../../../components/admin/auth-guard"
import { supabase } from "../../../lib/supabase"
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Trash2 } from "lucide-react"
import { useNavigate, useParams, Link } from "react-router-dom"

export function BlogEditorPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEditing = !!id

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(isEditing)

    interface BlogFormData {
        title: string
        slug: string
        excerpt: string
        content: string
        cover_image: string
        published: boolean
    }

    const [formData, setFormData] = useState<BlogFormData>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image: "",
        published: false
    })

    useEffect(() => {
        if (isEditing) {
            fetchPost()
        }
    }, [id])

    async function fetchPost() {
        if (!id) return

        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("id", id)
                .single()

            if (error) throw error
            if (data) {
                const post = data as any
                setFormData({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || "",
                    content: post.content || "",
                    cover_image: post.cover_image || "",
                    published: post.published
                })
            }
        } catch (error) {
            console.error("Error fetching post:", error)
        } finally {
            setIsFetching(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "title" && !isEditing) {
            // Auto-generate slug from title
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            setFormData(prev => ({ ...prev, title: value, slug }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const uploadImage = async (file: File) => {
        try {
            setIsLoading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `blog-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Reusing testimonial logic for now, or use 'blog-images' if created
            // Using 'testimonial-images' as it's definitely public per previous steps
            const { error: uploadError } = await supabase.storage
                .from('testimonial-images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('testimonial-images')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, cover_image: data.publicUrl }))
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Error uploading image")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const postData = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                cover_image: formData.cover_image,
                published: formData.published,
                updated_at: new Date().toISOString()
            }

            if (isEditing) {
                const { error } = await (supabase.from("blog_posts") as any)
                    .update(postData)
                    .eq("id", id)
                if (error) throw error
            } else {
                const { error } = await (supabase.from("blog_posts") as any)
                    .insert([postData])
                if (error) throw error
            }

            navigate("/admin/blog")
        } catch (error) {
            console.error("Error saving post:", error)
            alert("Failed to save post")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="mb-8">
                    <Link to="/admin/blog" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Posts
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEditing ? "Edit Post" : "Create New Post"}
                        </h1>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Post
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content (Markdown)</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                                placeholder="Write your post content here..."
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <h3 className="font-semibold">Publishing</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    placeholder="url-slug"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Excerpt</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-none"
                                    placeholder="Short summary for cards..."
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-4 border-t">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="published" className="text-sm font-medium">
                                    Publish immediately
                                </label>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
                            <h3 className="font-semibold">Cover Image</h3>

                            {formData.cover_image ? (
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                    <img
                                        src={formData.cover_image}
                                        alt="Cover"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, cover_image: "" }))}
                                        className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-xs text-muted-foreground mb-4">No image selected</p>
                                    <label className="cursor-pointer rounded-md bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
                                        Upload Image
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Or Image URL</label>
                                <input
                                    name="cover_image"
                                    value={formData.cover_image}
                                    onChange={handleChange}
                                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </AuthGuard>
    )
}
