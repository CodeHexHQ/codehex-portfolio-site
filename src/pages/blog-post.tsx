import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { PageTransition } from "../components/layout/page-transition"
import { Calendar, Clock, ArrowLeft, Loader2 } from "lucide-react"

export function BlogPost() {
    const { slug } = useParams()
    const [post, setPost] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchPost()
        }
    }, [slug])

    async function fetchPost() {
        if (!slug) return

        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .single()

            if (error) throw error
            setPost(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!post) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link to="/blog" className="text-primary hover:underline">
                    Back to Blog
                </Link>
            </div>
        )
    }

    return (
        <PageTransition>
            <article className="min-h-screen pt-24 pb-20">
                {/* Hero / Header */}
                <div className="container px-4 max-w-4xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                                Blog
                            </span>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                5 min read
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.1]">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="container px-4 max-w-5xl mx-auto mb-12">
                        <div className="aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-sm">
                            <img
                                src={post.cover_image}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="container px-4 max-w-3xl mx-auto">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {/* We're using whitespace-pre-wrap as a fallback for markdown for now */}
                        <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-sans">
                            {post.content}
                        </div>
                    </div>
                </div>
            </article>
        </PageTransition>
    )
}
