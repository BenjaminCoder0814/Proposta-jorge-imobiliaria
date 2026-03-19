import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { v4 as uuidv4 } from 'uuid'
import type { Aluguel } from '@/lib/types'

export async function GET() {
  return NextResponse.json(readData<Aluguel>('alugueis'))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const alugueis = readData<Aluguel>('alugueis')

  const novo: Aluguel = {
    id: uuidv4(),
    imovelId: body.imovelId || '',
    locatarioId: body.locatarioId || '',
    proprietarioId: body.proprietarioId || '',
    valorAluguel: Number(body.valorAluguel) || 0,
    diaVencimento: Number(body.diaVencimento) || 10,
    dataInicio: body.dataInicio || '',
    dataFim: body.dataFim || '',
    status: body.status || 'ativo',
    deposito: Number(body.deposito) || 0,
    indiceReajuste: body.indiceReajuste || 'nenhum',
    observacoes: body.observacoes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  alugueis.push(novo)
  writeData('alugueis', alugueis)
  return NextResponse.json(novo, { status: 201 })
}
