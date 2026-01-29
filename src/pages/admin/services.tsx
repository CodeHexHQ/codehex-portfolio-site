
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Trash2, Loader2, AlertCircle, Edit, ArrowLeft, CheckCircle } from "lucide-react"
import { AdminLayout } from "../../components/admin/admin-layout"
import { AuthGuard } from "../../components/admin/auth-guard"
import { ServiceForm } from "../../components/admin/service-form"
import type { Database } from "../../types/database"

type Service = Database['public']['Tables']['services']['Row']
type ServiceDetail = Database['public']['Tables']['service_details']['Row']

export function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newName, setNewName] = useState("")
    const [error, setError] = useState("")

    // Editor View State
    const [isEditing, setIsEditing] = useState(false)
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
    const [editingDetail, setEditingDetail] = useState<ServiceDetail | undefined>(undefined)

    useEffect(() => {
        fetchServices()
    }, [])

    async function fetchServices() {
        try {
            const { data: servicesData, error: servicesError } = await supabase
                .from("services")
                .select("*")
                .order("created_at", { ascending: false })

            if (servicesError) throw servicesError

            const { data: detailsData, error: detailsError } = await supabase
                .from("service_details")
                .select("*")

            if (detailsError) throw detailsError

            setServices(servicesData || [])
            setServiceDetails(detailsData || [])
        } catch (err: any) {
            console.error("Error fetching services:", err)
            setError("Failed to load services")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleAddService(e: React.FormEvent) {
        e.preventDefault()
        if (!newName.trim()) return

        setIsSubmitting(true)
        setError("")

        try {
            const { error } = await supabase
                .from("services")
                .insert([{ name: newName.trim() }] as any)

            if (error) throw error

            setNewName("")
            fetchServices()
        } catch (err: any) {
            console.error("Error adding service:", err)
            setError(err.message || "Failed to add service")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteService(id: string) {
        if (!window.confirm("Are you sure you want to delete this service? This will also delete all associated details.")) return

        try {
            const { error } = await supabase
                .from("services")
                .delete()
                .eq("id", id)

            if (error) throw error
            fetchServices()
        } catch (err: any) {
            console.error("Error deleting service:", err)
            alert("Failed to delete service")
        }
    }

    const handleEditDetails = (service: Service) => {
        const detail = serviceDetails.find(d => d.service_id === service.id)
        setEditingServiceId(service.id)
        setEditingDetail(detail)
        setIsEditing(true)
    }

    const handleSuccess = () => {
        setIsEditing(false)
        setEditingServiceId(null)
        setEditingDetail(undefined)
        fetchServices()
    }

    if (isEditing) {
        return (
            <AuthGuard>
                <AdminLayout>
                    <div className="mb-6">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Services
                        </button>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {editingDetail ? 'Edit Service Details' : 'Add Service Details'}
                        </h1>
                        <p className="text-muted-foreground">
                            Editing details for service ID: {editingServiceId}
                        </p>
                    </div>
                    <ServiceForm
                        initialData={editingDetail}
                        serviceId={editingServiceId || undefined}
                        onSuccess={handleSuccess}
                    />
                </AdminLayout>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                        <p className="text-muted-foreground">Manage service categories and their detailed content.</p>
                    </div>

                    {/* Add Service Form */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                        <form onSubmit={handleAddService} className="flex gap-4 items-end">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <label htmlFor="service-name" className="text-sm font-medium">
                                    New Service Category
                                </label>
                                <input
                                    id="service-name"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Web Development"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !newName.trim()}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                Add Category
                            </button>
                        </form>
                        {error && (
                            <div className="mt-4 flex items-center text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Services List */}
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold">Existing Services</h3>
                        </div>
                        {isLoading ? (
                            <div className="p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : services.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No services found. Add one above.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {services.map((service) => {
                                    const hasDetails = serviceDetails.some(d => d.service_id === service.id);
                                    return (
                                        <div key={service.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium text-lg">{service.name}</span>
                                                {hasDetails && (
                                                    <span className="flex items-center text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Configured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditDetails(service)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {hasDetails ? 'Edit Details' : 'Add Details'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3"
                                                    title="Delete Service"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AuthGuard>
    )
}
