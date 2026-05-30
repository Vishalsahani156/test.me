export interface BlogCategoryDto {
  slug: string
  name: string
  description: string
}

export interface BlogPostDto {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt: string
  readMinutes: number
  featured?: boolean
}

export interface BlogListResultDto {
  posts: BlogPostDto[]
  total: number
  page: number
  totalPages: number
}
