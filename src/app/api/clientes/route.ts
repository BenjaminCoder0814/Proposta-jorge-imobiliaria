import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { v4 as uuidv4 } from 'uuid'
import type { Cliente } from '@/lib/types'

export async function GET() {
  return NextResponse.json(readData<Cliente>('clientes'))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const clientes = readData<Cliente>('clientes')

  const novo: Cliente = {
    id: uuidv4(),
    nome: body.nome || '',
    email: body.email || '',
    telefone: body.telefone || '',
    cpf: body.cpf || '',
    tipo: body.tipo || 'comprador',
    interesse: body.interesse || '',
    observacoes: body.observacoes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  clientes.push(novo)
  writeData('clientes', clientes)
  return NextResponse.json(novo, { status: 201 })
}
