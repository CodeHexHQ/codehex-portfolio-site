
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Plus, Trash2, Loader2, Edit, ArrowLeft, Linkedin, Twitter, Github } from "lucide-react"
import { AdminLayout } from "../../components/admin/admin-layout"
import { AuthGuard } from "../../components/admin/auth-guard"
import { TeamForm } from "../../components/admin/team-form"
import type { Database } from "../../types/database"

type TeamMember = Database['public']['Tables']['team_members']['Row']

export function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Editor View State
    const [isEditing, setIsEditing] = useState(false)
    const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined)

    useEffect(() => {
        fetchMembers()
    }, [])

    async function fetchMembers() {
        try {
            const { data, error } = await supabase
                .from("team_members")
                .select("*")
                .order("display_order", { ascending: true })
                .order("created_at", { ascending: true })

            if (error) throw error
            setMembers(data || [])
        } catch (err: any) {
            console.error("Error fetching team:", err)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Are you sure you want to delete this member?")) return

        try {
            const { error } = await supabase
                .from("team_members")
                .delete()
                .eq("id", id)

            if (error) throw error
            fetchMembers()
        } catch (err: any) {
            console.error("Error deleting member:", err)
            alert("Failed to delete member")
        }
    }

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member)
        setIsEditing(true)
    }

    const handleAddNew = () => {
        setEditingMember(undefined)
        setIsEditing(true)
    }

    const handleSuccess = () => {
        setIsEditing(false)
        setEditingMember(undefined)
        fetchMembers()
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
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Team
                        </button>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                        </h1>
                    </div>
                    <TeamForm
                        initialData={editingMember}
                        onSuccess={handleSuccess}
                        onCancel={() => setIsEditing(false)}
                    />
                </AdminLayout>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <AdminLayout>
                <div className="space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
                            <p className="text-muted-foreground">Manage your team profiles displayed on the About page.</p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-10"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Member
                        </button>
                    </div>

                    {/* Team List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-full p-8 flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : members.length === 0 ? (
                            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-xl bg-card">
                                No team members found. Add one above.
                            </div>
                        ) : (
                            members.map((member) => (
                                <div key={member.id} className="relative group overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img src={member.image_url} alt={member.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{member.name}</h3>
                                            <p className="text-sm text-primary">{member.role}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
                                        <div className="flex gap-2 pt-2">
                                            {member.linkedin_url && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                                            {member.twitter_url && <Twitter className="w-4 h-4 text-muted-foreground" />}
                                            {member.github_url && <Github className="w-4 h-4 text-muted-foreground" />}
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                                            <button
                                                onClick={() => handleEdit(member)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground h-8 w-8 text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AuthGuard>
    )
}
