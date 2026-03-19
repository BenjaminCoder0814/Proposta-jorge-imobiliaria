import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import type { Visita } from '@/lib/types'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const visitas = readData<Visita>('visitas')
  const visita = visitas.find(v => v.id === id)
  if (!visita) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(visita)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const visitas = readData<Visita>('visitas')
  const idx = visitas.findIndex(v => v.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  visitas[idx] = { ...visitas[idx], ...body }
  writeData('visitas', visitas)
  return NextResponse.json(visitas[idx])
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const visitas = readData<Visita>('visitas')
  const filtered = visitas.filter(v => v.id !== id)
  if (filtered.length === visitas.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  writeData('visitas', filtered)
  return NextResponse.json({ success: true })
}
