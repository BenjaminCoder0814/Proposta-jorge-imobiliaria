'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Mail, X, Plus, MessageCircle, Instagram, Globe,
  Users, TrendingUp, CheckCircle, XCircle, ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Lead } from '@/lib/types'

const etapas = [
  { id: 'novo', label: 'Novo Lead', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
  { id: 'contato', label: 'Contato', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  { id: 'visita', label: 'Visita', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
  { id: 'proposta', label: 'Proposta', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  { id: 'fechado', label: 'Fechado ✓', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  { id: 'perdido', label: 'Perdido', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
]

const origemIcon: Record<string, React.ElementType> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  site: Globe,
  portal: Globe,
  indicacao: Users,
  outro: Users,
}

const origemColor: Record<string, string> = {
  whatsapp: '#25d366',
  instagram: '#e1306c',
  site: '#3b82f6',
  portal: '#8b5cf6',
  indicacao: '#f59e0b',
  outro: '#64748b',
}

const etapaOrder = ['novo', 'contato', 'visita', 'proposta', 'fechado', 'perdido']

function LeadCard({ lead, onUpdate, onDelete }: { lead: Lead; onUpdate: (id: string, etapa: string) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const OrigemIcon = origemIcon[lead.origem] || Users
  const etapa = etapas.find((e) => e.id === lead.etapa)
  const etapaIdx = etapaOrder.indexOf(lead.etapa)
  const canAdvance = etapaIdx < 4 && lead.etapa !== 'fechado' && lead.etapa !== 'perdido'
  const canBack = etapaIdx > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="rounded-xl p-3 cursor-pointer"
      style={{
        background: 'rgba(13,13,43,0.9)',
        border: `1px solid ${etapa?.border ?? 'rgba(59,130,246,0.15)'}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${origemColor[lead.origem]}18`, border: `1px solid ${origemColor[lead.origem]}30` }}
          >
            <OrigemIcon className="w-3.5 h-3.5" style={{ color: origemColor[lead.origem] }} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{lead.nome}</div>
            <div className="text-[10px] text-slate-500 truncate">{lead.telefone}</div>
          </div>
        </div>
        {lead.orcamento && (
          <div className="text-[10px] font-semibold shrink-0" style={{ color: etapa?.color }}>
            R$ {lead.orcamento.toLocaleString('pt-BR')}
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
              {lead.email && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Mail className="w-3 h-3" /> {lead.email}
                </div>
              )}
              {lead.observacoes && (
                <p className="text-[11px] text-slate-400 leading-relaxed">{lead.observacoes}</p>
              )}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd' }}>
                  {lead.tipoInteresse}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full capitalize"
                  style={{ background: `${origemColor[lead.origem]}15`, color: origemColor[lead.origem] }}>
                  {lead.origem}
                </span>
              </div>
              {/* Move actions */}
              <div className="flex gap-1.5 pt-1">
                {canBack && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdate(lead.id, etapaOrder[etapaIdx - 1]) }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-white transition-all"
                    style={{ background: 'rgba(100,116,139,0.1)', border: '1px solid rgba(100,116,139,0.2)' }}
                  >
                    ← Voltar
                  </button>
                )}
                {canAdvance && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onUpdate(lead.id, etapaOrder[etapaIdx + 1]) }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all"
                    style={{ background: etapa?.bg, color: etapa?.color, border: `1px solid ${etapa?.border}` }}
                  >
                    Avançar <ChevronRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(lead.id) }}
                  className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <XCircle className="w-3 h-3" /> Remover
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const EMPTY_FORM = {
  nome: '', telefone: '', email: '', origem: 'whatsapp' as Lead['origem'],
  tipoInteresse: 'compra' as Lead['tipoInteresse'], orcamento: '', observacoes: '',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/leads').then((r) => r.json()).then((data) => { setLeads(data); setLoading(false) })
  }, [])

  async function handleUpdate(id: string, etapa: string) {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapa }),
    })
    if (res.ok) {
      const updated = await res.json()
      setLeads((prev) => prev.map((l) => l.id === id ? updated : l))
      toast.success(`Lead movido para "${etapas.find((e) => e.id === etapa)?.label}"`)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este lead?')) return
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== id))
      toast.success('Lead removido')
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, orcamento: form.orcamento ? Number(form.orcamento) : undefined }),
      })
      if (res.ok) {
        const newLead = await res.json()
        setLeads((prev) => [...prev, newLead])
        setShowModal(false)
        setForm(EMPTY_FORM)
        toast.success('Lead cadastrado!')
      }
    } finally {
      setSaving(false)
    }
  }

  const totalLeads = leads.length
  const fechados = leads.filter((l) => l.etapa === 'fechado').length
  const taxa = totalLeads > 0 ? Math.round((fechados / totalLeads) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-400" />
            Leads / CRM
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Gerencie seu funil de vendas</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}
        >
          <Plus className="w-4 h-4" /> Novo Lead
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total de Leads', value: totalLeads, color: '#f97316', icon: UserPlus },
          { label: 'Fechados', value: fechados, color: '#10b981', icon: CheckCircle },
          { label: 'Taxa Conversão', value: `${taxa}%`, color: '#3b82f6', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </motion.div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {etapas.map((etapa) => {
            const etapaLeads = leads.filter((l) => l.etapa === etapa.id)
            return (
              <motion.div
                key={etapa.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-3 flex flex-col gap-2 min-h-32"
                style={{ background: `${etapa.bg}`, border: `1px solid ${etapa.border}` }}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: etapa.color }}>{etapa.label}</span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${etapa.color}20`, color: etapa.color }}
                  >
                    {etapaLeads.length}
                  </span>
                </div>
                {/* Cards */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {etapaLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onUpdate={handleUpdate} onDelete={handleDelete} />
                    ))}
                  </AnimatePresence>
                  {etapaLeads.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-[10px] text-slate-600">Vazio</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* New Lead Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0d0d2b', border: '1px solid rgba(249,115,22,0.25)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-orange-400" /> Novo Lead
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
                    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}
                      placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Telefone *</label>
                    <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} required
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}
                      placeholder="(19) 99999-9999" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">E-mail</label>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      type="email"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}
                      placeholder="email@exemplo.com" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Origem</label>
                    <select value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value as Lead['origem'] })}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none cursor-pointer"
                      style={{ background: '#0d1020', border: '1px solid rgba(249,115,22,0.2)' }}>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="instagram">Instagram</option>
                      <option value="portal">Portal (ZAP/etc)</option>
                      <option value="site">Site</option>
                      <option value="indicacao">Indicação</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Interesse</label>
                    <select value={form.tipoInteresse} onChange={(e) => setForm({ ...form, tipoInteresse: e.target.value as Lead['tipoInteresse'] })}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none cursor-pointer"
                      style={{ background: '#0d1020', border: '1px solid rgba(249,115,22,0.2)' }}>
                      <option value="compra">Compra</option>
                      <option value="aluguel">Aluguel</option>
                      <option value="ambos">Compra ou Aluguel</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Orçamento (R$)</label>
                    <input value={form.orcamento} onChange={(e) => setForm({ ...form, orcamento: e.target.value })}
                      type="number"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}
                      placeholder="Ex: 350000" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 mb-1 block">Observações</label>
                    <textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.2)' }}
                      placeholder="O que o cliente está procurando..." />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  {saving ? 'Salvando...' : 'Cadastrar Lead'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
