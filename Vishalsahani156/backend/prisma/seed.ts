import { PrismaClient } from '@prisma/client'
import { SEED_JOBS } from '../src/data/seedJobs.js'

const prisma = new PrismaClient()

async function main() {
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

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
