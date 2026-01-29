import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Trash2, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { AdminLayout } from "../../components/admin/admin-layout"
import { AuthGuard } from "../../components/admin/auth-guard"

interface FeaturedWork {
    id: string
    title: string
    subject: string
    category: string
    image_url: string
    blog_post_url: string
    created_at: string
}

interface Service {
    id: string
    name: string
}

export function FeaturedWorkPage() {
    const [works, setWorks] = useState<FeaturedWork[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        category: "",
        image_url: "",
        blog_post_url: ""
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            // Fetch Works
            const worksReq = supabase
                .from("featured_work")
                .select("*")
                .order("created_at", { ascending: false })

            // Fetch Services for Dropdown
            const servicesReq = supabase
                .from("services")
                .select("name, id")
                .order("name", { ascending: true })

            const [worksRes, servicesRes] = await Promise.all([worksReq, servicesReq])

            if (worksRes.error) throw worksRes.error
            if (servicesRes.error) throw servicesRes.error

            setWorks(worksRes.data || [])
            setServices(servicesRes.data || [])
        } catch (err: any) {
            console.error("Error fetching data:", err)
            setError("Failed to load data")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!formData.category || !formData.title || !formData.image_url) {
            setError("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from("featured_work")
                    // @ts-ignore
                    .update({ ...formData })
                    .eq('id', editingId)

                if (error) throw error
            } else {
                // Insert new
                const { error } = await supabase
                    .from("featured_work")
                    .insert([formData] as any)

                if (error) throw error
            }

            resetForm()
            fetchData()
        } catch (err: any) {
            console.error("Error saving work:", err)
            setError(err.message || "Failed to save featured work")
        } finally {
            setIsSubmitting(false)
        }
    }

    function resetForm() {
        setFormData({
            title: "",
            subject: "",
            category: "",
            image_url: "",
            blog_post_url: ""
        })
        setEditingId(null)
        setError("")
    }

    function handleEdit(work: FeaturedWork) {
        setFormData({
            title: work.title,
            subject: work.subject || "",
            category: work.category,
            image_url: work.image_url,
            blog_post_url: work.blog_post_url || ""
        })
        setEditingId(work.id)
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this project?")) return

        try {
            const { error } = await supabase
                .from("featured_work")
                .delete()
                .eq("id", id)

            if (error) throw error

            // If deleting the currently edited item, reset form
            if (editingId === id) {
                resetForm()
            }

            fetchData()
        } catch (err: any) {
            console.error("Error deleting work:", err)
            alert("Failed to delete project")
        }
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Featured Work</h1>
                        <p className="text-muted-foreground">Add and manage case studies and projects.</p>
                    </div>

                    {/* Add/Edit Work Form */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{editingId ? "Edit Project" : "Add New Project"}</h2>
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Service / Category <span className="text-red-500">*</span></label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select a service...</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.name}>{service.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Project Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="e.g. E-Commerce Revamp"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject / Client</label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="e.g. ShopifyPlus"
                                        rows={3}
                                        value={formData.subject}
                                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Image URL <span className="text-red-500">*</span></label>
                                    <input
                                        type="url"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="https://..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Blog Post Link</label>
                                    <input
                                        type="url"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="https://..."
                                        value={formData.blog_post_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, blog_post_url: e.target.value }))}
                                    />
                                    <p className="text-xs text-muted-foreground">The "Read Case Study" button will link here.</p>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 min-w-[120px]"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                        <>
                                            {editingId ? <span className="mr-2">Save Changes</span> : <Plus className="h-4 w-4 mr-2" />}
                                            {editingId ? "" : "Add Project"}
                                        </>
                                    )}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                        {error && (
                            <div className="mt-4 flex items-center text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Works List */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold">Existing Projects</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : works.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No projects found. Add one above.
                            </div>
                        ) : (
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {works.map((work) => (
                                    <div key={work.id} className={`p-4 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center ${editingId === work.id ? "bg-muted/50 ring-1 ring-primary/20" : ""}`}>
                                        <img src={work.image_url} alt={work.title} className="w-16 h-16 rounded-md object-cover bg-muted" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold truncate">{work.title}</h4>
                                                <span className="text-xs rounded-full bg-primary/10 px-2 py-0.5 text-primary whitespace-nowrap">
                                                    {work.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{work.subject}</p>
                                            {work.blog_post_url && (
                                                <a href={work.blog_post_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline inline-flex items-center mt-1">
                                                    View Blog <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button
                                                onClick={() => handleEdit(work)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(work.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                                title="Delete Project"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AuthGuard>
    )
}
