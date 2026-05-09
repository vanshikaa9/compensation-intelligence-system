import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const salaries = await prisma.salary.findMany({
      orderBy: {
        total_compensation: 'desc',
      },
    })

    return NextResponse.json(salaries)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
}