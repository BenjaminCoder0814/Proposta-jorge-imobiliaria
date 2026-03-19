import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { SistemaUser } from '@/lib/types'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { username, password } = body

  // Check users.json first
  const usersPath = path.join(process.cwd(), 'data', 'users.json')
  if (fs.existsSync(usersPath)) {
    const users: SistemaUser[] = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))
    const user = users.find(
      (u) => u.username.toLowerCase() === username?.toLowerCase().trim() && u.password === password && u.ativo
    )
    if (user) {
      const response = NextResponse.json({ success: true, nome: user.nome, role: user.role })
      response.cookies.set('jorge_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      return response
    }
  } else {
    // Fallback: hardcoded jorge
    if (username?.toLowerCase().trim() === 'jorge' && password === 'jorge123') {
      const response = NextResponse.json({ success: true })
      response.cookies.set('jorge_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      return response
    }
  }

  return NextResponse.json(
    { success: false, error: 'Usuário ou senha inválidos' },
    { status: 401 }
  )
}
