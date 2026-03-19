import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { v4 as uuidv4 } from 'uuid'
import type { Visita } from '@/lib/types'

export async function GET() {
  return NextResponse.json(readData<Visita>('visitas'))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const visitas = readData<Visita>('visitas')

  const nova: Visita = {
    id: uuidv4(),
    imovelId: body.imovelId || '',
    clienteId: body.clienteId || '',
    nomeContato: body.nomeContato || '',
    telefoneContato: body.telefoneContato || '',
    data: body.data || '',
    hora: body.hora || '',
    status: body.status || 'agendada',
    observacoes: body.observacoes || '',
    createdAt: new Date().toISOString(),
  }

  visitas.push(nova)
  writeData('visitas', visitas)
  return NextResponse.json(nova, { status: 201 })
}
