import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'vendas.json')

function readVendas() {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeVendas(data: unknown[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendas = readVendas()
  const venda = vendas.find((v: { id: string }) => v.id === id)
  if (!venda) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(venda)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const vendas = readVendas()
    const idx = vendas.findIndex((v: { id: string }) => v.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    vendas[idx] = { ...vendas[idx], ...body }
    writeVendas(vendas)
    return NextResponse.json(vendas[idx])
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vendas = readVendas()
  const filtered = vendas.filter((v: { id: string }) => v.id !== id)
  if (filtered.length === vendas.length) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeVendas(filtered)
  return NextResponse.json({ success: true })
}
