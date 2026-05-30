import { Router } from 'express'
import { blogService } from '../services/blog.service.js'
import { AppError } from '../utils/errors.js'

const router = Router()

/**
 * @openapi
 * /api/blog/categories:
 *   get:
 *     tags: [Blog]
 *     summary: List blog categories
 */
router.get('/categories', async (_req, res, next) => {
  try {
    const categories = await blogService.getCategories()
    res.json({ categories })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/blog/featured:
 *   get:
 *     tags: [Blog]
 *     summary: Get featured blog post
 */
router.get('/featured', async (_req, res, next) => {
  try {
    const post = await blogService.getFeaturedPost()
    res.json({ post })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/blog/posts:
 *   get:
 *     tags: [Blog]
 *     summary: List blog posts with pagination, category, and search
 */
router.get('/posts', async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const query = typeof req.query.q === 'string' ? req.query.q : undefined
    const result = await blogService.getPosts({ page, category, query })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/blog/posts/{slug}:
 *   get:
 *     tags: [Blog]
 *     summary: Get single blog post by slug
 */
router.get('/posts/:slug', async (req, res, next) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug)
    if (!post) {
      next(new AppError('Post not found', 404))
      return
    }
    res.json({ post })
  } catch (err) {
    next(err)
  }
})

/**
 * @openapi
 * /api/blog/posts/{slug}/related:
 *   get:
 *     tags: [Blog]
 *     summary: Related posts in same category
 */
router.get('/posts/:slug/related', async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 3
    const posts = await blogService.getRelatedPosts(req.params.slug, limit)
    res.json({ posts })
  } catch (err) {
    next(err)
  }
})

export default router
