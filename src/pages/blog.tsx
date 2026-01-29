import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PageTransition } from "../components/layout/page-transition"
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react"
import { supabase } from "../lib/supabase"

export function Blog() {
    return (
        <PageTransition>
            <div className="pt-24 min-h-screen">
                <div className="container px-4 text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                        Our Blog
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Insights, thoughts, and trends from the world of software development and design.
                    </p>
                </div>
                <BlogGrid />
            </div>
        </PageTransition>
    )
}

function BlogGrid() {
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
                .eq("published", true)
                .order("created_at", { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center pb-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center pb-20 text-muted-foreground">
                <p>No posts published yet. Check back soon!</p>
            </div>
        )
    }

    return (
        <div className="container px-4 pb-20">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link to={`/blog/${post.slug}`} key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:shadow-xl hover:-translate-y-1 block">
                        <article className="flex flex-col h-full">
                            <div className="aspect-video w-full overflow-hidden bg-muted">
                                {post.cover_image ? (
                                    <img
                                        src={post.cover_image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-secondary/30">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                                        Blog
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            5 min read
                                        </div>
                                    </div>
                                </div>
                                <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="mb-4 flex-1 text-muted-foreground text-sm line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto flex items-center text-sm font-medium text-primary group-hover:underline">
                                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    )
}
