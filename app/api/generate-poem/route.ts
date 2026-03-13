import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface GeneratePoemRequest {
  theme: string
  tone: string
  length: string
  beatStyle: string
  rhymeScheme: string
  specialRequests: string
  whimsical: boolean
  userName: string
}

const LENGTH_DESCRIPTIONS: Record<string, string> = {
  short: '4–8 lines',
  medium: '12–16 lines',
  long: '20–28 lines',
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeneratePoemRequest
    const {
      theme,
      tone,
      length,
      beatStyle,
      rhymeScheme,
      specialRequests,
      whimsical,
      userName,
    } = body

    if (!theme || !tone || !length) {
      return NextResponse.json(
        { error: 'Missing required fields: theme, tone, length' },
        { status: 400 }
      )
    }

    const lengthDesc = LENGTH_DESCRIPTIONS[length] ?? length
    const userPrompt = buildPrompt({
      theme,
      tone,
      lengthDesc,
      beatStyle,
      rhymeScheme,
      specialRequests,
      whimsical,
      userName,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are VerseVerse, a poetic genius with a gift for crafting emotionally resonant, beautifully structured poems. You write with heart, imagination, and skill. Always follow the user's specifications for tone, length, beat, and rhyme. Be creative and surprising — never generic. The poem should feel personal and alive.

Your response must be a valid JSON object with exactly two keys:
- "title": a short, evocative title for the poem (3–7 words, no quotes, no punctuation at the end)
- "poem": the poem text only — no title inside the poem, no explanations, no quotes around it

Respond with ONLY the JSON object, no markdown code blocks, no extra text.`,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response
    let title = 'Untitled'
    let poem = ''

    try {
      const parsed = JSON.parse(raw.trim())
      title = parsed.title ?? 'Untitled'
      poem = parsed.poem ?? raw
    } catch {
      // Fallback: treat entire response as poem
      poem = raw.trim()
      title = generateFallbackTitle(theme, tone)
    }

    return NextResponse.json({ title, poem })
  } catch (err) {
    console.error('Error generating poem:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to generate poem: ${message}` },
      { status: 500 }
    )
  }
}

function buildPrompt(params: {
  theme: string
  tone: string
  lengthDesc: string
  beatStyle: string
  rhymeScheme: string
  specialRequests: string
  whimsical: boolean
  userName: string
}): string {
  const { theme, tone, lengthDesc, beatStyle, rhymeScheme, specialRequests, whimsical, userName } = params

  const lines = [
    `Write a ${tone.toLowerCase()} poem about "${theme}".`,
    '',
    `Length: ${lengthDesc}`,
    `Rhythm/beat style: ${beatStyle}`,
    `Rhyme scheme: ${rhymeScheme}`,
    `Special requests: ${specialRequests?.trim() || 'none'}`,
    `The poet's name is ${userName} — the poem may subtly reflect their personal voice.`,
  ]

  if (whimsical) {
    lines.push('Include at least one unexpected, magical, whimsical image or metaphor.')
  }

  lines.push('')
  lines.push('Return ONLY a JSON object with keys "title" and "poem". No markdown, no code fences.')

  return lines.join('\n')
}

function generateFallbackTitle(theme: string, tone: string): string {
  const themeWord = theme.split(' ')[0]
  const toneMap: Record<string, string> = {
    joyful: 'Ode to',
    melancholic: 'Elegy for',
    romantic: 'Love and',
    silly: 'The Silly Tale of',
    mysterious: 'Secrets of',
    empowering: 'Rise of',
  }
  const prefix = toneMap[tone.toLowerCase()] ?? 'A Poem About'
  return `${prefix} ${themeWord}`
}
