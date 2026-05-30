import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DashboardNav } from '../components/layout/DashboardNav'
import { BlogCard } from '../components/blog/BlogCard'
import { BlogSearch } from '../components/blog/BlogSearch'
import { CategoryFilter } from '../components/blog/CategoryFilter'
import { Pagination } from '../components/blog/Pagination'
import { blogApi } from '../services/blogApi'
import type { BlogPost } from '../types/blog'

export function BlogListPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const [featured, setFeatured] = useState<BlogPost | null>(null)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      blogApi.getFeaturedPost(),
      blogApi.getPosts({ page, query: query || undefined }),
    ])
      .then(([featuredPost, result]) => {
        setFeatured(featuredPost)
        setPosts(result.posts)
        setTotalPages(result.totalPages)
      })
      .finally(() => setLoading(false))
  }, [page, query])

  return (
    <div className="app-shell">
      <DashboardNav />

      <main className="manager-main">
        <div className="page-header">
          <div>
            <h2>Blog</h2>
            <p className="resume-card-subtitle">Career tips, resume advice, interview prep, and more.</p>
          </div>
        </div>

        <BlogSearch initialQuery={query} />
        <CategoryFilter />

        {loading ? <p className="loading-text">Loading articles…</p> : null}

        {!loading && featured && !query && page === 1 ? (
          <Link to={`/blog/${featured.slug}`} className="featured-post">
            <span className="featured-label">Featured</span>
            <h3>{featured.title}</h3>
            <p>{featured.excerpt}</p>
            <span className="blog-card-meta">
              {featured.author} · {featured.readMinutes} min read
            </span>
          </Link>
        ) : null}

        {!loading ? (
          <>
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {posts.length === 0 ? (
              <p className="empty-note">No articles found. Try a different search or category.</p>
            ) : null}
            <Pagination page={page} totalPages={totalPages} basePath="/blog" query={query || undefined} />
          </>
        ) : null}
      </main>
    </div>
  )
}
