'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Users, Plus, Search, Phone, Mail, Tag, Pencil, Trash2, ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Cliente } from '@/lib/types'

const tipoConfig: Record<string, { label: string; color: string; bg: string }> = {
  comprador: { label: 'Comprador', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  vendedor: { label: 'Vendedor', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  locatario: { label: 'Locatário', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  proprietario: { label: 'Proprietário', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')

  useEffect(() => {
    fetch('/api/clientes').then(r => r.json()).then(data => { setClientes(data); setLoading(false) })
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Excluir este cliente?')) return
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setClientes(prev => prev.filter(c => c.id !== id))
      toast.success('Cliente excluído')
    } else {
      toast.error('Erro ao excluir')
    }
  }

  const filtered = clientes.filter(c => {
    const matchSearch = !search ||
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.telefone.includes(search)
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    return matchSearch && matchTipo
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Clientes
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{clientes.length} cliente(s) na base</p>
        </div>
        <Link href="/clientes/novo">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            <Plus className="w-4 h-4" /> Novo Cliente
          </motion.button>
        </Link>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Buscar por nome, email ou telefone..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Tag className="w-4 h-4 text-slate-500" />
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer">
            <option value="todos" className="bg-[#0d0d2b]">Todos os tipos</option>
            <option value="comprador" className="bg-[#0d0d2b]">Comprador</option>
            <option value="vendedor" className="bg-[#0d0d2b]">Vendedor</option>
            <option value="locatario" className="bg-[#0d0d2b]">Locatário</option>
            <option value="proprietario" className="bg-[#0d0d2b]">Proprietário</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(59,130,246,0.2)' }}>
          <Users className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">Nenhum cliente encontrado</p>
          <Link href="/clientes/novo">
            <button className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">+ Cadastrar primeiro cliente</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((c, i) => {
              const tipo = tipoConfig[c.tipo] ?? { label: c.tipo, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' }
              const initials = c.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
              const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']
              const color = colors[c.nome.charCodeAt(0) % colors.length]

              return (
                <motion.div key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-4 relative"
                  style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}aa, ${color})` }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{c.nome}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: tipo.bg, color: tipo.color }}>
                          {tipo.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/clientes/${c.id}/editar`}>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: 'rgba(245,158,11,0.08)', color: '#fbbf24' }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
                    {c.telefone && (
                      <a href={`tel:${c.telefone}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group">
                        <Phone className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                        {c.telefone}
                      </a>
                    )}
                    {c.email && (
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group">
                        <Mail className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        <span className="truncate">{c.email}</span>
                      </a>
                    )}
                    {c.interesse && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Tag className="w-3.5 h-3.5 text-slate-600" />
                        <span className="truncate">{c.interesse}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
