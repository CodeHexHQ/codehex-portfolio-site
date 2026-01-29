import { useEffect, useState } from "react"
import { AdminLayout } from "../../components/admin/admin-layout"
import { AuthGuard } from "../../components/admin/auth-guard"
import { supabase } from "../../lib/supabase"
import { Loader2, Mail, Calendar } from "lucide-react"

export function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    async function fetchFeedbacks() {
        try {
            const { data, error } = await supabase
                .from("feedbacks")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setFeedbacks(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function toggleStatus(id: string, currentStatus: string) {
        try {
            const newStatus = currentStatus === 'unread' ? 'read' : 'unread'
            await (supabase.from("feedbacks") as any).update({ status: newStatus }).eq("id", id)
            fetchFeedbacks()
        } catch (error) {
            console.error(error)
        }
    }

    async function toggleApproval(id: string, currentApproved: boolean) {
        try {
            const newApproved = !currentApproved
            // Update approved status
            await (supabase.from("feedbacks") as any).update({ approved: newApproved }).eq("id", id)
            fetchFeedbacks()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Feedback & Testimonials</h1>
                    <p className="text-muted-foreground">Manage user feedback and approve testimonials</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="grid gap-4 sm:hidden">
                            {feedbacks.map((item) => (
                                <div key={item.id} className={`rounded-xl border bg-card p-4 text-card-foreground shadow-sm space-y-4 ${item.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.email}</div>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={item.approved || false}
                                                onChange={() => toggleApproval(item.id, item.approved || false)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        {(item.company || item.role) && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="bg-muted px-2 py-0.5 rounded text-foreground">{item.company || "No Company"}</span>
                                                <span>•</span>
                                                <span>{item.role || "No Role"}</span>
                                            </div>
                                        )}
                                        {item.subject && (
                                            <div className="font-medium text-sm">{item.subject}</div>
                                        )}
                                        <p className="text-sm text-muted-foreground leading-snug">
                                            {item.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                        <button
                                            onClick={() => toggleStatus(item.id, item.status)}
                                            className="text-xs font-medium text-primary hover:underline"
                                        >
                                            {item.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {feedbacks.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
                                    No feedback received yet.
                                </div>
                            )}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden rounded-xl border bg-card text-card-foreground shadow sm:block">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Company</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Subject</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Message</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Testimonial</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {feedbacks.map((item) => (
                                            <tr key={item.id} className={`border-b transition-colors hover:bg-muted/50 ${item.status === 'unread' ? 'bg-primary/5' : ''}`}>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-3">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                                {item.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium whitespace-nowrap">{item.name}</div>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Mail className="h-3 w-3" />
                                                                {item.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    {item.company || "-"}
                                                </td>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    {item.role || "-"}
                                                </td>
                                                <td className="p-4 align-top">
                                                    {item.subject || "-"}
                                                </td>
                                                <td className="p-4 align-top min-w-[300px]">
                                                    <p className="text-muted-foreground text-sm line-clamp-3">{item.message}</p>
                                                </td>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    <button
                                                        onClick={() => toggleStatus(item.id, item.status)}
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.status === 'unread'
                                                            ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
                                                            : 'text-foreground hover:bg-muted'
                                                            }`}
                                                    >
                                                        {item.status === 'unread' ? 'Mark Read' : 'Read'}
                                                    </button>
                                                </td>
                                                <td className="p-4 align-top whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.approved || false}
                                                                onChange={() => toggleApproval(item.id, item.approved || false)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                                            <span className="ml-3 text-sm font-medium">
                                                                {item.approved ? "Approved" : "Hidden"}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
