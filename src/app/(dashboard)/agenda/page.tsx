'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays, Plus, Home, Phone, Clock, CheckCircle2, XCircle, Trash2, ChevronDown,
} from 'lucide-react'
import { format, parseISO, isFuture, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import type { Visita, Imovel } from '@/lib/types'

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: LucideIcon }> = {
  agendada: { label: 'Agendada', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: Clock },
  realizada: { label: 'Realizada', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle2 },
  cancelada: { label: 'Cancelada', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
}

export default function AgendaPage() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filtro, setFiltro] = useState('todos')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ imovelId: '', nomeContato: '', telefoneContato: '', data: '', hora: '', observacoes: '', status: 'agendada' })

  useEffect(() => {
    Promise.all([fetch('/api/visitas').then(r => r.json()), fetch('/api/imoveis').then(r => r.json())])
      .then(([v, i]) => { setVisitas(v); setImoveis(i); setLoading(false) })
  }, [])

  function set(key: string, value: string) { setForm(prev => ({ ...prev, [key]: value })) }
  const getImovel = (id: string) => imoveis.find(i => i.id === id)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.data || !form.hora || !form.nomeContato) { toast.error('Preencha os campos obrigatórios'); return }
    setSaving(true)
    const res = await fetch('/api/visitas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) {
      const nova = await res.json()
      setVisitas(prev => [...prev, nova])
      setShowModal(false)
      setForm({ imovelId: '', nomeContato: '', telefoneContato: '', data: '', hora: '', observacoes: '', status: 'agendada' })
      toast.success('Visita agendada!')
    } else { toast.error('Erro ao salvar') }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta visita?')) return
    const res = await fetch(`/api/visitas/${id}`, { method: 'DELETE' })
    if (res.ok) { setVisitas(prev => prev.filter(v => v.id !== id)); toast.success('Visita excluída') }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    const res = await fetch(`/api/visitas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    if (res.ok) setVisitas(prev => prev.map(v => v.id === id ? { ...v, status: newStatus as Visita['status'] } : v))
  }

  const filtered = visitas
    .filter(v => filtro === 'todos' || v.status === filtro)
    .sort((a, b) => `${a.data}T${a.hora}`.localeCompare(`${b.data}T${b.hora}`))

  const upcoming = visitas.filter(v => {
    try { const d = parseISO(`${v.data}T${v.hora}`); return (isFuture(d) || isToday(d)) && v.status === 'agendada' } catch { return false }
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><CalendarDays className="w-6 h-6 text-amber-400" /> Agenda de Visitas</h1>
          <p className="text-slate-400 text-sm mt-0.5">{upcoming.length} visita(s) nos próximos dias</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
          <Plus className="w-4 h-4" /> Agendar Visita
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Agendadas', value: visitas.filter(v => v.status === 'agendada').length, color: '#3b82f6' },
          { label: 'Realizadas', value: visitas.filter(v => v.status === 'realizada').length, color: '#10b981' },
          { label: 'Canceladas', value: visitas.filter(v => v.status === 'cancelada').length, color: '#ef4444' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl p-4 text-center" style={{ background: 'rgba(13,13,43,0.85)', border: `1px solid ${s.color}25` }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['todos', 'agendada', 'realizada', 'cancelada'].map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
            style={{ background: filtro === f ? 'rgba(245,158,11,0.15)' : 'rgba(13,13,43,0.6)', color: filtro === f ? '#f59e0b' : '#94a3b8', border: `1px solid ${filtro === f ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.1)'}` }}>
            {f === 'todos' ? 'Todas' : statusConfig[f].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(59,130,246,0.2)' }}>
          <CalendarDays className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">Nenhuma visita registrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((v, i) => {
              const sc = statusConfig[v.status]
              const Icon = sc.icon
              const imovel = getImovel(v.imovelId)
              let dateLabel = ''
              try {
                const d = parseISO(`${v.data}T${v.hora}`)
                dateLabel = isToday(d) ? `Hoje, ${v.hora}` : format(d, "EEE, dd 'de' MMM", { locale: ptBR }) + ` • ${v.hora}`
              } catch { dateLabel = `${v.data} ${v.hora}` }

              return (
                <motion.div key={v.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: 'rgba(13,13,43,0.85)', border: `1px solid ${sc.color}20`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: sc.bg }}>
                    <Icon className="w-5 h-5" style={{ color: sc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{v.nomeContato}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-amber-400 flex items-center gap-1"><Clock className="w-3 h-3" />{dateLabel}</span>
                      {imovel && <span className="text-xs text-slate-500 flex items-center gap-1 truncate"><Home className="w-3 h-3" />{imovel.titulo}</span>}
                    </div>
                    {v.telefoneContato && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{v.telefoneContato}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {v.status === 'agendada' && (
                      <>
                        <button onClick={() => handleStatusChange(v.id, 'realizada')}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Realizada</button>
                        <button onClick={() => handleStatusChange(v.id, 'cancelada')}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>Cancelar</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(v.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl p-5 space-y-4"
            style={{ background: '#0d0d2b', border: '1px solid rgba(245,158,11,0.25)' }}>
            <h3 className="text-base font-semibold text-white flex items-center gap-2"><CalendarDays className="w-4 h-4 text-amber-400" /> Agendar Visita</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Imóvel</label>
                <div className="relative">
                  <select value={form.imovelId} onChange={e => set('imovelId', e.target.value)}
                    className="w-full bg-[#0d0d2b] text-sm text-white outline-none px-3 py-2 rounded-xl cursor-pointer appearance-none"
                    style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
                    <option value="">— Selecionar imóvel —</option>
                    {imoveis.map(i => <option key={i.id} value={i.id} className="bg-[#0d0d2b]">{i.titulo}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nome do contato *</label>
                <input required value={form.nomeContato} onChange={e => set('nomeContato', e.target.value)} placeholder="Nome do cliente"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(245,158,11,0.2)' }} />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Telefone</label>
                <input value={form.telefoneContato} onChange={e => set('telefoneContato', e.target.value)} placeholder="(19) 99999-9999"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(245,158,11,0.2)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Data *</label>
                  <input type="date" required value={form.data} onChange={e => set('data', e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(245,158,11,0.2)' }} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Hora *</label>
                  <input type="time" required value={form.hora} onChange={e => set('hora', e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(245,158,11,0.2)' }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Observações</label>
                <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} rows={2}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2 rounded-xl resize-none"
                  style={{ border: '1px solid rgba(245,158,11,0.2)' }} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm text-slate-400" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
                  {saving ? '...' : 'Agendar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
