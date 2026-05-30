import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { adminApi } from '../../services/adminApi'
import type { AdminBlogPost } from '../../types/admin'

const EMPTY_POST = {
  title: '',
  excerpt: '',
  content: '',
  categorySlug: 'career-tips',
  tags: 'career, tips',
  author: 'Career Toolkit',
  readMinutes: 5,
  featured: false,
}

export function AdminBlogsPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([])
  const [form, setForm] = useState(EMPTY_POST)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPosts(await adminApi.getPosts())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPosts()
  }, [loadPosts])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    try {
      await adminApi.createPost({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        categorySlug: form.categorySlug,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        author: form.author,
        readMinutes: form.readMinutes,
        featured: form.featured,
      })
      setForm(EMPTY_POST)
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    }
  }

  async function handleDelete(postId: string) {
    if (!window.confirm('Delete this blog post?')) return
    try {
      await adminApi.deletePost(postId)
      await loadPosts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Blogs</h2>
      </div>
      {error ? <div className="form-error">{error}</div> : null}

      <form className="resume-card admin-form" onSubmit={handleCreate}>
        <h3>Add blog post</h3>
        <div className="admin-form-grid">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder="Category slug" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} required />
          <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required />
          <input placeholder="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} required />
          <input type="number" min={1} placeholder="Read minutes" value={form.readMinutes} onChange={(e) => setForm({ ...form, readMinutes: Number(e.target.value) })} required />
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
        </div>
        <input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
        <textarea className="job-description-input" rows={6} placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <button type="submit" className="btn-primary">Create post</button>
      </form>

      {loading ? <p className="loading-text">Loading posts…</p> : null}

      {!loading ? (
        <div className="admin-table-wrap resume-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Featured</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td>{post.author}</td>
                  <td>{post.featured ? 'Yes' : 'No'}</td>
                  <td>{new Date(post.publishedAt).toLocaleDateString()}</td>
                  <td>
                    <button type="button" className="btn-danger btn-sm" onClick={() => void handleDelete(post.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
