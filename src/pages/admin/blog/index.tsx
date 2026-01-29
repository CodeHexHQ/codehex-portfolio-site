import { useEffect, useState } from "react"
import { AdminLayout } from "../../../components/admin/admin-layout"
import { AuthGuard } from "../../../components/admin/auth-guard"
import { supabase } from "../../../lib/supabase"
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, FileText, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

export function BlogListPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        try {
            await (supabase.from("blog_posts") as any).update({ published: !currentStatus }).eq("id", id)
            fetchPosts()
        } catch (error) {
            console.error("Error updating post:", error)
        }
    }

    async function deletePost(id: string) {
        if (!window.confirm("Are you sure you want to delete this post?")) return

        try {
            await (supabase.from("blog_posts") as any).delete().eq("id", id)
            fetchPosts()
        } catch (error) {
            console.error("Error deleting post:", error)
        }
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                        <p className="text-muted-foreground">Manage your articles and content</p>
                    </div>
                    <Link
                        to="/admin/blog/new"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="grid gap-4 sm:hidden">
                            {posts.map((post) => (
                                <div key={post.id} className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div className="font-semibold">{post.title}</div>
                                        </div>
                                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${post.published
                                            ? "border-transparent bg-green-500/15 text-green-600"
                                            : "border-transparent bg-yellow-500/15 text-yellow-600"
                                            }`}>
                                            {post.published ? "Pub" : "Draft"}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                        <div>
                                            Views: {post.views || 0}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t pt-2">
                                        <button
                                            onClick={() => togglePublish(post.id, post.published)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <Link
                                            to={`/admin/blog/edit/${post.id}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-red-500/10 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {posts.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
                                    No posts found.
                                </div>
                            )}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden rounded-xl border bg-card text-card-foreground shadow sm:block">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Views</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                    No posts found. Create your first one!
                                                </td>
                                            </tr>
                                        ) : (
                                            posts.map((post) => (
                                                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                                            {post.title}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-muted-foreground">
                                                        {post.views || 0}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${post.published
                                                            ? "border-transparent bg-green-500/15 text-green-600"
                                                            : "border-transparent bg-yellow-500/15 text-yellow-600"
                                                            }`}>
                                                            {post.published ? "Published" : "Draft"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => togglePublish(post.id, post.published)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                title={post.published ? "Unpublish" : "Publish"}
                                                            >
                                                                {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                            <Link
                                                                to={`/admin/blog/edit/${post.id}`}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => deletePost(post.id)}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </AdminLayout>
        </AuthGuard>
    )
}
