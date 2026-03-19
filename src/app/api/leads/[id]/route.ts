import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'leads.json')

function readLeads() {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeLeads(data: unknown[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const leads = readLeads()
  const lead = leads.find((l: { id: string }) => l.id === id)
  if (!lead) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const leads = readLeads()
    const idx = leads.findIndex((l: { id: string }) => l.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    leads[idx] = { ...leads[idx], ...body, updatedAt: new Date().toISOString() }
    writeLeads(leads)
    return NextResponse.json(leads[idx])
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const leads = readLeads()
  const filtered = leads.filter((l: { id: string }) => l.id !== id)
  if (filtered.length === leads.length) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeLeads(filtered)
  return NextResponse.json({ success: true })
}
