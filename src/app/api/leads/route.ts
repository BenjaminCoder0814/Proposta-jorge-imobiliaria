import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'leads.json')

function readLeads() {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeLeads(data: unknown[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    return NextResponse.json(readLeads())
  } catch {
    return NextResponse.json({ error: 'Erro ao ler leads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const leads = readLeads()
    const newLead = {
      id: `lead-${Date.now()}`,
      etapa: 'novo',
      observacoes: '',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    leads.push(newLead)
    writeLeads(leads)
    return NextResponse.json(newLead, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 })
  }
}
