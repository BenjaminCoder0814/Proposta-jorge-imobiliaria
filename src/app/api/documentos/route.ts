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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imovelId = searchParams.get('imovelId')
    const docs = readDocs()
    const filtered = imovelId ? docs.filter((d: { imovelId: string }) => d.imovelId === imovelId) : docs
    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json({ error: 'Erro ao ler documentos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const docs = readDocs()
    const newDoc = {
      id: `doc-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    docs.push(newDoc)
    writeDocs(docs)
    return NextResponse.json(newDoc, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar documento' }, { status: 500 })
  }
}
