import { Link, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, MessageSquare, FileText, LogOut, Users, Sun, Moon, Menu, X, Layers, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabase"
import { cn } from "../../lib/utils"
import { useTheme } from "../../context/theme-provider"

export function AdminLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, setTheme } = useTheme()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate("/admin/login")
    }

    const navItems = [
        { name: "Leads", href: "/admin/leads", icon: Users },
        { name: "Services", href: "/admin/services", icon: Layers },
        { name: "Featured Work", href: "/admin/featured-work", icon: Briefcase },
        { name: "Team Members", href: "/admin/team", icon: Users },
        { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
        { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    ]


    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isAvailable, setIsAvailable] = useState(false)
    const [isLoadingSettings, setIsLoadingSettings] = useState(true)

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'project_availability')
                .single()

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching settings:', error)
                }
                return
            }

            if (data && (data as any).value) {
                setIsAvailable((data as any).value.is_available)
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err)
        } finally {
            setIsLoadingSettings(false)
        }
    }

    async function toggleAvailability() {
        if (isLoadingSettings) return

        const newValue = !isAvailable
        setIsAvailable(newValue) // Optimistic update

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'project_availability',
                    value: { is_available: newValue },
                    updated_at: new Date().toISOString()
                } as any)

            if (error) {
                throw error
            }
        } catch (err) {
            console.error('Error updating availability:', err)
            setIsAvailable(!newValue) // Revert on error
        }
    }

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans">
            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 sm:hidden justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open sidebar</span>
                    </button>
                    <span className="font-bold text-lg">CodeHex Admin</span>
                </div>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </header>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out sm:flex sm:translate-x-0",
                sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full"
            )}>
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>
                    {/* Desktop Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="hidden sm:inline-flex rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="sm:hidden rounded-full p-1 text-muted-foreground hover:bg-muted"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex flex-1 flex-col gap-2 p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                                location.pathname === item.href || location.pathname.startsWith(item.href + "/")
                                    ? "bg-muted text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t mt-auto">
                    <div className="flex flex-col gap-4">
                        {/* Project Availability Toggle */}
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm font-medium">Available for work</span>
                            <button
                                onClick={toggleAvailability}
                                disabled={isLoadingSettings}
                                className={cn(
                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                                    isAvailable ? "bg-primary" : "bg-input"
                                )}
                            >
                                <span
                                    className={cn(
                                        "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                        isAvailable ? "translate-x-6" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 sm:ml-64">
                <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
