import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'vendas.json')

function readVendas() {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeVendas(data: unknown[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    return NextResponse.json(readVendas())
  } catch {
    return NextResponse.json({ error: 'Erro ao ler vendas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const vendas = readVendas()
    const newVenda = {
      id: `venda-${Date.now()}`,
      status: 'em_andamento',
      observacoes: '',
      ...body,
      createdAt: new Date().toISOString(),
    }
    vendas.push(newVenda)
    writeVendas(vendas)
    return NextResponse.json(newVenda, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar venda' }, { status: 500 })
  }
}
