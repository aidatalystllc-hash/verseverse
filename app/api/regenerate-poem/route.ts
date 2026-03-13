import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface RegeneratePoemRequest {
  originalPoem: string
  originalTitle: string
  feedbackRequest: string
  originalInputs: {
    theme: string
    tone: string
    length: string
    beatStyle: string
    rhymeScheme: string
    specialRequests: string
    whimsical: boolean
    userName: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegeneratePoemRequest
    const { originalPoem, originalTitle, feedbackRequest, originalInputs } = body

    if (!originalPoem || !feedbackRequest) {
      return NextResponse.json(
        { error: 'Missing required fields: originalPoem, feedbackRequest' },
        { status: 400 }
      )
    }

    const userPrompt = buildRevisionPrompt({
      originalPoem,
      originalTitle,
      feedbackRequest,
      originalInputs,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are VerseVerse, a poetic genius with a gift for crafting emotionally resonant, beautifully structured poems. You write with heart, imagination, and skill. You are revising a poem based on feedback. Keep what works, improve what doesn't, and honor the user's creative vision.

Your response must be a valid JSON object with exactly two keys:
- "title": a short, evocative title for the revised poem (3–7 words)
- "poem": the revised poem text only — no title, no explanations, no quotes

Respond with ONLY the JSON object, no markdown code blocks, no extra text.`,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    let title = originalTitle
    let poem = ''

    try {
      const parsed = JSON.parse(raw.trim())
      title = parsed.title ?? originalTitle
      poem = parsed.poem ?? raw
    } catch {
      poem = raw.trim()
    }

    return NextResponse.json({ title, poem })
  } catch (err) {
    console.error('Error regenerating poem:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to regenerate poem: ${message}` },
      { status: 500 }
    )
  }
}

function buildRevisionPrompt(params: {
  originalPoem: string
  originalTitle: string
  feedbackRequest: string
  originalInputs: RegeneratePoemRequest['originalInputs']
}): string {
  const { originalPoem, originalTitle, feedbackRequest, originalInputs } = params
  const { theme, tone, length, beatStyle, rhymeScheme, specialRequests, whimsical } = originalInputs

  return `Here is a poem I wrote earlier:

Title: "${originalTitle}"

---
${originalPoem}
---

Original specifications:
- Theme: ${theme}
- Tone: ${tone}
- Length: ${length}
- Rhythm/beat style: ${beatStyle}
- Rhyme scheme: ${rhymeScheme}
- Special requests: ${specialRequests || 'none'}
${whimsical ? '- Extra whimsical imagery was requested' : ''}

The user would like this change:
"${feedbackRequest}"

Please revise the poem accordingly. Keep the spirit and original specs in mind, but honor the feedback. The revision should feel like a natural evolution of the original.

Return ONLY a JSON object with keys "title" and "poem".`
}
