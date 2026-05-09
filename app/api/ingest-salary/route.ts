import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeCompany, computeTotal } from '@/lib/data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.company?.trim()) {
      return NextResponse.json(
        { error: 'company is required' },
        { status: 400 }
      )
    }

    if (!body.role?.trim()) {
      return NextResponse.json(
        { error: 'role is required' },
        { status: 400 }
      )
    }

    if (!body.level?.trim()) {
      return NextResponse.json(
        { error: 'level is required' },
        { status: 400 }
      )
    }

    if (
      !body.base_salary ||
      isNaN(Number(body.base_salary)) ||
      Number(body.base_salary) <= 0
    ) {
      return NextResponse.json(
        { error: 'base_salary must be positive' },
        { status: 400 }
      )
    }

    const company = normalizeCompany(body.company)

    const data = {
      company,
      role: body.role.trim(),
      level: body.level.trim(),
      location: body.location?.trim() || 'Remote',
      experience_years: Math.max(
        0,
        Number(body.experience_years) || 0
      ),
      base_salary: Number(body.base_salary),
      bonus: Math.max(0, Number(body.bonus) || 0),
      stock: Math.max(0, Number(body.stock) || 0),
    }

    const duplicate = await prisma.salary.findFirst({
      where: {
        company: data.company,
        role: data.role,
        level: data.level,
        location: data.location,
        experience_years: data.experience_years,
        base_salary: data.base_salary,
      },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: 'Duplicate entry detected' },
        { status: 400 }
      )
    }

    const created = await prisma.salary.create({
      data: {
        ...data,
        total_compensation: computeTotal(data),
        confidence_score: 0.9,
      },
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to ingest salary' },
      { status: 500 }
    )
  }
}