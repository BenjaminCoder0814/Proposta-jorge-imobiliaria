import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import type { Cliente } from '@/lib/types'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const clientes = readData<Cliente>('clientes')
  const cliente = clientes.find((c) => c.id === id)
  if (!cliente) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json(cliente)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const clientes = readData<Cliente>('clientes')
  const idx = clientes.findIndex((c) => c.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  clientes[idx] = { ...clientes[idx], ...body, id, updatedAt: new Date().toISOString() }
  writeData('clientes', clientes)
  return NextResponse.json(clientes[idx])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const clientes = readData<Cliente>('clientes')
  const filtered = clientes.filter((c) => c.id !== id)
  if (filtered.length === clientes.length)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeData('clientes', filtered)
  return NextResponse.json({ success: true })
}
