import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { entryA, entryB } = await req.json()
    if (!entryA || !entryB) {
      return NextResponse.json({ error: 'Two entries required' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are a compensation analyst for India tech. Compare these two salary entries in exactly 3 sentences: (1) which is better overall and why, (2) the TC breakdown difference with specific numbers, (3) one career/growth consideration. Be direct and use ₹ amounts.

Entry A: ${JSON.stringify(entryA)}
Entry B: ${JSON.stringify(entryB)}`
      }]
    })

    const text = message.content.filter(c => c.type === 'text').map(c => (c as any).text).join('')
    return NextResponse.json({ insight: text })
  } catch (err: any) {
    console.error('AI insight error:', err)
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 })
  }
}
