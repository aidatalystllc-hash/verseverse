// Client-side PDF generation using jsPDF
// Produces a beautiful keepsake-quality poem PDF

export async function generatePoemPDF(params: {
  title: string
  poem: string
  userName: string
}): Promise<void> {
  const { title, poem, userName } = params

  // Dynamically import jsPDF (client-side only)
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageW = 210
  const pageH = 297
  const margin = 20
  const innerMargin = 25

  // ── BACKGROUND ─────────────────────────────────────────────
  // Soft lavender blush gradient simulation with two rectangles
  doc.setFillColor(237, 231, 246) // lavender #EDE7F6
  doc.rect(0, 0, pageW, pageH, 'F')

  // Subtle lower blush overlay
  doc.setFillColor(252, 228, 236) // blush #FCE4EC
  doc.setGState(doc.GState({ opacity: 0.4 }))
  doc.rect(0, pageH * 0.55, pageW, pageH * 0.45, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  // ── OUTER BORDER ───────────────────────────────────────────
  const bx = margin
  const by = margin
  const bw = pageW - margin * 2
  const bh = pageH - margin * 2

  // Outer border line — muted rose gold
  doc.setDrawColor(188, 143, 143)
  doc.setLineWidth(0.8)
  doc.rect(bx, by, bw, bh)

  // Inner border line (double line effect)
  doc.setDrawColor(210, 170, 170)
  doc.setLineWidth(0.3)
  doc.rect(bx + 3, by + 3, bw - 6, bh - 6)

  // ── CORNER ACCENTS ─────────────────────────────────────────
  drawCornerAccents(doc, bx, by, bw, bh)

  // ── HEADER FLOURISH ────────────────────────────────────────
  const headerY = by + 14

  // Decorative flourish line
  doc.setDrawColor(188, 143, 143)
  doc.setLineWidth(0.4)
  drawFlourish(doc, pageW / 2, headerY)

  // "VerseVerse" title
  doc.setTextColor(90, 60, 120) // deep purple
  doc.setFont('times', 'bold')
  doc.setFontSize(28)
  doc.text('VerseVerse', pageW / 2, headerY + 12, { align: 'center' })

  // Thin dividing line
  doc.setDrawColor(188, 143, 143)
  doc.setLineWidth(0.5)
  doc.line(innerMargin + 10, headerY + 16, pageW - innerMargin - 10, headerY + 16)

  // ── TITLE ──────────────────────────────────────────────────
  doc.setTextColor(70, 40, 100)
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(18)

  const titleLines = doc.splitTextToSize(title, bw - 20)
  const titleY = headerY + 26
  doc.text(titleLines, pageW / 2, titleY, { align: 'center' })

  // ── AUTHOR LINE ────────────────────────────────────────────
  doc.setFont('times', 'italic')
  doc.setFontSize(11)
  doc.setTextColor(130, 100, 160)
  const authorY = titleY + titleLines.length * 8 + 4
  doc.text(`A poem by ${userName}`, pageW / 2, authorY, { align: 'center' })

  // Decorative separator
  doc.setDrawColor(210, 170, 200)
  doc.setLineWidth(0.3)
  const sepY = authorY + 6
  doc.line(innerMargin + 20, sepY, pageW - innerMargin - 20, sepY)

  // ── POEM BODY ──────────────────────────────────────────────
  doc.setFont('times', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(55, 35, 80)

  const lineHeight = 7.5
  let curY = sepY + 12

  const poemLines = poem.split('\n')
  const maxBodyY = pageH - margin - 28 // leave footer room

  for (const rawLine of poemLines) {
    if (curY > maxBodyY) break

    if (rawLine.trim() === '') {
      curY += lineHeight * 0.6 // blank line = smaller gap
      continue
    }

    const wrapped = doc.splitTextToSize(rawLine, bw - 20)
    for (const wl of wrapped) {
      if (curY > maxBodyY) break
      doc.text(wl, pageW / 2, curY, { align: 'center' })
      curY += lineHeight
    }
  }

  // ── FOOTER ─────────────────────────────────────────────────
  const footerY = pageH - margin - 18

  // Footer divider
  doc.setDrawColor(210, 170, 200)
  doc.setLineWidth(0.3)
  doc.line(innerMargin + 10, footerY, pageW - innerMargin - 10, footerY)

  // Date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.setFont('times', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(150, 120, 170)
  doc.text(today, pageW / 2, footerY + 6, { align: 'center' })

  // "Created with VerseVerse" tag
  doc.setFontSize(8)
  doc.setTextColor(170, 140, 190)
  doc.text('Created with VerseVerse ✨', pageW / 2, footerY + 12, { align: 'center' })

  // Footer decorative star
  doc.setFontSize(12)
  doc.setTextColor(200, 160, 220)
  doc.text('✦', pageW / 2, footerY + 18, { align: 'center' })

  // ── SAVE ───────────────────────────────────────────────────
  const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
  const dateStr = new Date().toISOString().slice(0, 10)
  const fileName = `verseverse-poem-${safeUserName}-${dateStr}.pdf`
  doc.save(fileName)
}

// ── HELPERS ────────────────────────────────────────────────────

function drawCornerAccents(
  doc: InstanceType<typeof import('jspdf').jsPDF>,
  bx: number,
  by: number,
  bw: number,
  bh: number
) {
  const accentColor: [number, number, number] = [188, 143, 143]
  const size = 6

  doc.setFillColor(...accentColor)
  doc.setDrawColor(...accentColor)
  doc.setLineWidth(0.4)

  // Helper: draw small diamond at (x,y)
  const diamond = (cx: number, cy: number) => {
    doc.line(cx - size / 2, cy, cx, cy - size / 2)
    doc.line(cx, cy - size / 2, cx + size / 2, cy)
    doc.line(cx + size / 2, cy, cx, cy + size / 2)
    doc.line(cx, cy + size / 2, cx - size / 2, cy)
    // center dot
    doc.circle(cx, cy, 0.8, 'F')
  }

  diamond(bx, by)                    // top-left
  diamond(bx + bw, by)               // top-right
  diamond(bx, by + bh)               // bottom-left
  diamond(bx + bw, by + bh)          // bottom-right
}

function drawFlourish(
  doc: InstanceType<typeof import('jspdf').jsPDF>,
  cx: number,
  y: number
) {
  doc.setDrawColor(188, 143, 143)
  doc.setLineWidth(0.4)

  // Simple S-curve flourishes on either side
  const spread = 30
  // Left side
  doc.line(cx - spread, y + 2, cx - 8, y + 2)
  doc.circle(cx - 5, y + 2, 1.5)
  // Right side
  doc.line(cx + 8, y + 2, cx + spread, y + 2)
  doc.circle(cx + 5, y + 2, 1.5)
  // Center dot
  doc.setFillColor(188, 143, 143)
  doc.circle(cx, y + 2, 1.2, 'F')
}
