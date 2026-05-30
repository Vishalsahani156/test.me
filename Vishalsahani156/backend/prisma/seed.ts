import { PrismaClient } from '@prisma/client'
import { ABOUT_DATA } from '../src/data/aboutData.js'
import { BLOG_CATEGORIES } from '../src/data/blogCategories.js'
import { FAQ_DATA } from '../src/data/faqData.js'
import { SEED_BLOG_POSTS } from '../src/data/seedBlogPosts.js'
import { SEED_JOBS } from '../src/data/seedJobs.js'

const prisma = new PrismaClient()

async function seedJobs() {
  for (const job of SEED_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        experience: job.experience,
        skills: job.skills,
        description: job.description,
        postedAt: new Date(job.postedAt),
      },
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        experience: job.experience,
        skills: job.skills,
        description: job.description,
        postedAt: new Date(job.postedAt),
      },
    })
  }
  console.log(`Seeded ${SEED_JOBS.length} jobs`)
}

async function seedBlog() {
  for (const category of BLOG_CATEGORIES) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    })
  }

  for (const post of SEED_BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categorySlug: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: new Date(post.publishedAt),
        readMinutes: post.readMinutes,
        featured: post.featured ?? false,
      },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        categorySlug: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: new Date(post.publishedAt),
        readMinutes: post.readMinutes,
        featured: post.featured ?? false,
      },
    })
  }

  console.log(`Seeded ${BLOG_CATEGORIES.length} categories and ${SEED_BLOG_POSTS.length} blog posts`)
}

async function seedAbout() {
  await prisma.contentBlock.upsert({
    where: { key: 'about' },
    update: { payload: ABOUT_DATA },
    create: { key: 'about', payload: ABOUT_DATA },
  })
  console.log('Seeded about page content')
}

async function seedFaq() {
  for (let index = 0; index < FAQ_DATA.length; index += 1) {
    const item = FAQ_DATA[index]
    await prisma.faqItem.upsert({
      where: { id: item.id },
      update: {
        category: item.category,
        question: item.question,
        answer: item.answer,
        sortOrder: index,
      },
      create: {
        id: item.id,
        category: item.category,
        question: item.question,
        answer: item.answer,
        sortOrder: index,
      },
    })
  }
  console.log(`Seeded ${FAQ_DATA.length} FAQ items`)
}

async function main() {
  await seedJobs()
  await seedBlog()
  await seedAbout()
  await seedFaq()
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
