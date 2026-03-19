import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { SistemaUser } from '@/lib/types'

const filePath = path.join(process.cwd(), 'data', 'users.json')

function readUsers(): SistemaUser[] {
  if (!fs.existsSync(filePath)) return []
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function writeUsers(data: SistemaUser[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const users = readUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    // Don't allow changing username via this endpoint without explicit field
    const { password, ...rest } = body
    users[idx] = { ...users[idx], ...rest }
    if (password && password.length >= 4) users[idx].password = password
    writeUsers(users)
    const { password: _, ...safe } = users[idx]
    return NextResponse.json(safe)
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const users = readUsers()
  const filtered = users.filter((u) => u.id !== id)
  if (filtered.length === users.length) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  writeUsers(filtered)
  return NextResponse.json({ success: true })
}
