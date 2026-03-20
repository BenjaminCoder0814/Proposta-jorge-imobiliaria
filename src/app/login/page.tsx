'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, User, MapPin, Eye, EyeOff, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        toast.success('Bem-vindo ao sistema!')
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Credenciais inválidas')
      }
    } catch {
      toast.error('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#030311' }}
    >
      {/* Animated blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          top: '-15%',
          left: '-10%',
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)',
          bottom: '5%',
          right: '-5%',
        }}
        animate={{ x: [0, -30, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          top: '45%',
          right: '20%',
        }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles */}
      {([
        { w: 3.5, h: 4.0 },
        { w: 2.8, h: 4.8 },
        { w: 3.4, h: 5.9 },
        { w: 4.0, h: 3.0 },
        { w: 2.1, h: 2.4 },
        { w: 3.3, h: 2.6 },
      ] as { w: number; h: number }[]).map(({ w, h }, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: w,
            height: h,
            background: ['#3b82f6', '#8b5cf6', '#06b6d4'][i % 3],
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.6,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(13, 13, 43, 0.88)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow:
              '0 0 60px rgba(59, 130, 246, 0.1), 0 0 120px rgba(139, 92, 246, 0.06), 0 24px 48px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 180 }}
              className="relative mb-4"
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: 'rgba(13,13,43,0.5)',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(59,130,246,0.25)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="ERP Imobiliário" className="w-20 h-20 object-contain" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-2xl font-bold text-gradient-blue text-center"
            >
              ERP Imobiliário
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-sm text-slate-400 mt-1"
            >
              Sistema de Gestão Imobiliária
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: '#67e8f9',
              }}
            >
              <MapPin className="w-3 h-3" />
              Engenheiro Coelho, SP
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div className="relative group">
              <User
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: '#475569' }}
              />
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  outline: 'none',
                }}
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#475569' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-12 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm mt-2 transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(59, 130, 246, 0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Acessar Sistema'
              )}
            </motion.button>
          </motion.form>

          <p className="text-center text-xs text-slate-600 mt-6">
            © 2025 Jorge Corretor · Engenheiro Coelho, SP
          </p>
        </div>
      </motion.div>
    </div>
  )
}
