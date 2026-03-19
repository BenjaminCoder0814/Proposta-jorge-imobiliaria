import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import type { Pagamento } from '@/lib/types'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const pagamentos = readData<Pagamento>('pagamentos')
  const idx = pagamentos.findIndex((p) => p.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  pagamentos[idx] = { ...pagamentos[idx], ...body, id }
  writeData('pagamentos', pagamentos)
  return NextResponse.json(pagamentos[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pagamentos = readData<Pagamento>('pagamentos')
  const filtered = pagamentos.filter((p) => p.id !== id)
  writeData('pagamentos', filtered)
  return NextResponse.json({ success: true })
}
