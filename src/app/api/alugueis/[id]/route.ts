import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import type { Aluguel } from '@/lib/types'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const alugueis = readData<Aluguel>('alugueis')
  const aluguel = alugueis.find((a) => a.id === id)
  if (!aluguel) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(aluguel)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const alugueis = readData<Aluguel>('alugueis')
  const idx = alugueis.findIndex((a) => a.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  alugueis[idx] = { ...alugueis[idx], ...body, id, updatedAt: new Date().toISOString() }
  writeData('alugueis', alugueis)
  return NextResponse.json(alugueis[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const alugueis = readData<Aluguel>('alugueis')
  const filtered = alugueis.filter((a) => a.id !== id)
  if (filtered.length === alugueis.length)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeData('alugueis', filtered)
  return NextResponse.json({ success: true })
}
