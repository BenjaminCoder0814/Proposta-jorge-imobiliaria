import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'documentos.json')

function readDocs() {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeDocs(data: unknown[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const docs = readDocs()
  const filtered = docs.filter((d: { id: string }) => d.id !== id)
  if (filtered.length === docs.length) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeDocs(filtered)
  return NextResponse.json({ success: true })
}
