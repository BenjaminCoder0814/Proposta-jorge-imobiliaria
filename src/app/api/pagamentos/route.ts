import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { v4 as uuidv4 } from 'uuid'
import type { Pagamento } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const aluguelId = searchParams.get('aluguelId')
  const pagamentos = readData<Pagamento>('pagamentos')
  if (aluguelId) return NextResponse.json(pagamentos.filter((p) => p.aluguelId === aluguelId))
  return NextResponse.json(pagamentos)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const pagamentos = readData<Pagamento>('pagamentos')

  const novo: Pagamento = {
    id: uuidv4(),
    aluguelId: body.aluguelId || '',
    competencia: body.competencia || '',
    valor: Number(body.valor) || 0,
    valorPago: Number(body.valorPago) || 0,
    dataPagamento: body.dataPagamento || '',
    dataVencimento: body.dataVencimento || '',
    status: body.status || 'pendente',
    observacoes: body.observacoes || '',
    createdAt: new Date().toISOString(),
  }

  pagamentos.push(novo)
  writeData('pagamentos', pagamentos)
  return NextResponse.json(novo, { status: 201 })
}
