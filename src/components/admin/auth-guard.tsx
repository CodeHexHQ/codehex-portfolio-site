import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                navigate("/admin/login")
                return
            }

            // Check if user is admin
            const { data: profile, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", session.user.id)
                .single() as any

            if (error || profile?.role !== "admin") {
                console.error("Access denied:", error || "Not an admin")
                navigate("/") // Redirect unauthorized users home
                return
            }

            setIsAuthorized(true)
        } catch (error) {
            console.error("Auth check failed:", error)
            navigate("/admin/login")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}
