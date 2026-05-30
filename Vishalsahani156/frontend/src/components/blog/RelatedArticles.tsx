import type { BlogPost } from '../../types/blog'
import { BlogCard } from './BlogCard'

interface RelatedArticlesProps {
  posts: BlogPost[]
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts.length) return null

  return (
    <section className="resume-card related-articles">
      <h2>Related Articles</h2>
      <p className="resume-card-subtitle">More from the same category.</p>
      <div className="blog-grid blog-grid--compact">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
