import { PrismaClient } from '@prisma/client'
import { SEED_DATA, computeTotal } from './lib/data'

const prisma = new PrismaClient()

async function main() {
  await prisma.salary.deleteMany()

  for (const salary of SEED_DATA) {
    await prisma.salary.create({
      data: {
        company: salary.company.trim().toLowerCase(),
        role: salary.role,
        level: salary.level,
        location: salary.location,
        experience_years: salary.experience_years,
        base_salary: salary.base_salary,
        bonus: salary.bonus || 0,
        stock: salary.stock || 0,
        total_compensation: computeTotal(salary),
        confidence_score: 0.9,
      },
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })