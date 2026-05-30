import type { AdminBlogPost, AdminJob, AdminMessage, AdminStats, AdminUser } from '../types/admin'
import { apiRequest } from './httpClient'

export const adminApi = {
  getStats(): Promise<AdminStats> {
    return apiRequest<{ stats: AdminStats }>('/admin/stats').then((data) => data.stats)
  },

  getUsers(): Promise<AdminUser[]> {
    return apiRequest<{ users: AdminUser[] }>('/admin/users').then((data) => data.users)
  },

  updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<AdminUser> {
    return apiRequest<{ user: AdminUser }>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }).then((data) => data.user)
  },

  deleteUser(userId: string): Promise<void> {
    return apiRequest<{ message: string }>(`/admin/users/${userId}`, { method: 'DELETE' }).then(() => undefined)
  },

  getJobs(): Promise<AdminJob[]> {
    return apiRequest<{ jobs: AdminJob[] }>('/admin/jobs').then((data) => data.jobs)
  },

  createJob(job: Omit<AdminJob, 'id' | 'postedAt'>): Promise<AdminJob> {
    return apiRequest<{ job: AdminJob }>('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    }).then((data) => data.job)
  },

  deleteJob(jobId: string): Promise<void> {
    return apiRequest<{ message: string }>(`/admin/jobs/${jobId}`, { method: 'DELETE' }).then(() => undefined)
  },

  getPosts(): Promise<AdminBlogPost[]> {
    return apiRequest<{ posts: AdminBlogPost[] }>('/admin/blogs').then((data) => data.posts)
  },

  createPost(post: {
    title: string
    excerpt: string
    content: string
    categorySlug: string
    tags: string[]
    author: string
    readMinutes: number
    featured?: boolean
  }): Promise<AdminBlogPost> {
    return apiRequest<{ post: AdminBlogPost }>('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(post),
    }).then((data) => data.post)
  },

  deletePost(postId: string): Promise<void> {
    return apiRequest<{ message: string }>(`/admin/blogs/${postId}`, { method: 'DELETE' }).then(() => undefined)
  },

  getMessages(): Promise<AdminMessage[]> {
    return apiRequest<{ messages: AdminMessage[] }>('/admin/messages').then((data) => data.messages)
  },

  deleteMessage(messageId: string): Promise<void> {
    return apiRequest<{ message: string }>(`/admin/messages/${messageId}`, {
      method: 'DELETE',
    }).then(() => undefined)
  },
}
