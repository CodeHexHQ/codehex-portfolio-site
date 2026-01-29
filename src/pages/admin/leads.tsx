import { useEffect, useState } from "react"
import { AdminLayout } from "../../components/admin/admin-layout"
import { AuthGuard } from "../../components/admin/auth-guard"
import { supabase } from "../../lib/supabase"
import { Loader2, Mail, Phone, Calendar } from "lucide-react"

export function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchLeads()
    }, [])

    async function fetchLeads() {
        try {
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setLeads(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            await (supabase.from("leads") as any).update({ status }).eq("id", id)
            fetchLeads()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Project Leads</h1>
                    <p className="text-muted-foreground">Manage incoming project requests</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Mobile View: Cards */}
                        <div className="grid gap-4 sm:hidden">
                            {leads.map((lead) => (
                                <div key={lead.id} className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold">{lead.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <select
                                            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={lead.status}
                                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1 pt-2 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            {lead.email}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                {lead.phone}
                                            </div>
                                        )}
                                    </div>

                                    {(lead.business_description || lead.requirements) && (
                                        <div className="space-y-2 pt-2 border-t text-sm">
                                            {lead.business_description && (
                                                <p className="text-muted-foreground line-clamp-2">
                                                    <span className="font-medium text-foreground">Biz:</span> {lead.business_description}
                                                </p>
                                            )}
                                            {lead.requirements && (
                                                <p className="text-muted-foreground line-clamp-2">
                                                    <span className="font-medium text-foreground">Req:</span> {lead.requirements}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {leads.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground border rounded-xl bg-card">
                                    No leads found.
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
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Client</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Contact</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Project Details</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {leads.map((lead) => (
                                            <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-top">
                                                    <div className="flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="font-medium">{lead.name}</div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Mail className="h-3 w-3" />
                                                            {lead.email}
                                                        </div>
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <Phone className="h-3 w-3" />
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top max-w-md">
                                                    <div className="space-y-2">
                                                        {lead.business_description && (
                                                            <p className="text-muted-foreground text-xs line-clamp-2" title={lead.business_description}>
                                                                <span className="font-semibold text-foreground">Biz:</span> {lead.business_description}
                                                            </p>
                                                        )}
                                                        {lead.requirements && (
                                                            <p className="text-muted-foreground text-xs line-clamp-2" title={lead.requirements}>
                                                                <span className="font-semibold text-foreground">Req:</span> {lead.requirements}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top">
                                                    <select
                                                        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        value={lead.status}
                                                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
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
