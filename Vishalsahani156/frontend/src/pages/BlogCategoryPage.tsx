import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BlogCard } from '../components/blog/BlogCard'
import { CategoryFilter } from '../components/blog/CategoryFilter'
import { Pagination } from '../components/blog/Pagination'
import { blogApi } from '../services/blogApi'
import type { BlogPost } from '../types/blog'

export function BlogCategoryPage() {
  const { slug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const categoryName = blogApi.getCategoryName(slug)

  useEffect(() => {
    setLoading(true)
    blogApi
      .getPosts({ page, category: slug })
      .then((result) => {
        setPosts(result.posts)
        setTotalPages(result.totalPages)
      })
      .finally(() => setLoading(false))
  }, [slug, page])

  return (
    <main className="manager-main">
      <div className="page-header">
        <div>
          <Link to="/blog" className="back-link">← All articles</Link>
          <h2>{categoryName}</h2>
        </div>
      </div>

      <CategoryFilter activeCategory={slug} />

      {loading ? <p className="loading-text">Loading…</p> : null}

      {!loading ? (
        <>
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          {posts.length === 0 ? <p className="empty-note">No posts in this category yet.</p> : null}
          <Pagination page={page} totalPages={totalPages} basePath={`/blog/category/${slug}`} />
        </>
      ) : null}
    </main>
  )
}
