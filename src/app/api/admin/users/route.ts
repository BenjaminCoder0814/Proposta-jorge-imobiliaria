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

export async function GET() {
  try {
    const users = readUsers().map(({ password: _, ...u }) => u)
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Erro ao ler usuários' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const users = readUsers()
    const exists = users.find((u) => u.username.toLowerCase() === body.username?.toLowerCase())
    if (exists) return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 })
    const newUser: SistemaUser = {
      id: `user-${Date.now()}`,
      ativo: true,
      role: 'corretor',
      ...body,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    writeUsers(users)
    const { password: _, ...safe } = newUser
    return NextResponse.json(safe, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}
