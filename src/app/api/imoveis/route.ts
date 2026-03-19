import { NextRequest, NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/data'
import { v4 as uuidv4 } from 'uuid'
import type { Imovel } from '@/lib/types'

export async function GET() {
  const imoveis = readData<Imovel>('imoveis')
  return NextResponse.json(imoveis)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const imoveis = readData<Imovel>('imoveis')

  const novo: Imovel = {
    id: uuidv4(),
    titulo: body.titulo || '',
    tipo: body.tipo || 'casa',
    status: body.status || 'disponivel',
    finalidade: body.finalidade || 'venda',
    endereco: body.endereco || '',
    bairro: body.bairro || '',
    cidade: body.cidade || 'Engenheiro Coelho',
    cep: body.cep || '',
    area: Number(body.area) || 0,
    quartos: Number(body.quartos) || 0,
    banheiros: Number(body.banheiros) || 0,
    garagem: Number(body.garagem) || 0,
    valor: Number(body.valor) || 0,
    descricao: body.descricao || '',
    fotos: body.fotos || [],
    tags: body.tags || [],
    destaque: body.destaque || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  imoveis.push(novo)
  writeData('imoveis', imoveis)
  return NextResponse.json(novo, { status: 201 })
}
