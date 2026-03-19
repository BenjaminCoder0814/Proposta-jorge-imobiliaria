import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import type { Imovel } from '@/lib/types'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imoveis = readData<Imovel>('imoveis')
  const imovel = imoveis.find((i) => i.id === id)
  if (!imovel) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(imovel)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const imoveis = readData<Imovel>('imoveis')
  const idx = imoveis.findIndex((i) => i.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  imoveis[idx] = { ...imoveis[idx], ...body, id, updatedAt: new Date().toISOString() }
  writeData('imoveis', imoveis)
  return NextResponse.json(imoveis[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const imoveis = readData<Imovel>('imoveis')
  const filtered = imoveis.filter((i) => i.id !== id)
  if (filtered.length === imoveis.length)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeData('imoveis', filtered)
  return NextResponse.json({ success: true })
}
