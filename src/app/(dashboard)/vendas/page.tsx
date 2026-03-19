'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Plus, X, DollarSign, Award,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Venda } from '@/lib/types'

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  em_andamento: { label: 'Em Andamento', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  contrato_assinado: { label: 'Contrato Assinado', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  escritura: { label: 'Escritura', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  concluida: { label: 'Concluída', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  cancelada: { label: 'Cancelada', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const EMPTY_FORM = {
  imovelId: '', compradorId: '', valorVenda: '', comissaoPercent: '6',
  status: 'em_andamento' as Venda['status'], dataVenda: new Date().toISOString().split('T')[0],
  observacoes: '',
}

interface ItemNome { id: string; nome: string }

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [imoveis, setImoveis] = useState<ItemNome[]>([])
  const [clientes, setClientes] = useState<ItemNome[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [detail, setDetail] = useState<Venda | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/vendas').then(r => r.json()),
      fetch('/api/imoveis').then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
    ]).then(([v, im, cl]) => {
      setVendas(v)
      setImoveis(im.map((x: { id: string; endereco: string }) => ({ id: x.id, nome: x.endereco })))
      setClientes(cl.map((x: { id: string; nome: string }) => ({ id: x.id, nome: x.nome })))
      setLoading(false)
    })
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const valorVenda = Number(form.valorVenda)
      const comissaoValor = valorVenda * (Number(form.comissaoPercent) / 100)
      const res = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, valorVenda, comissaoPercent: Number(form.comissaoPercent), comissaoValor }),
      })
      if (res.ok) {
        const nova = await res.json()
        setVendas(prev => [nova, ...prev])
        setShowModal(false)
        setForm(EMPTY_FORM)
        toast.success('Venda cadastrada!')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateStatus(id: string, status: Venda['status']) {
    const res = await fetch(`/api/vendas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setVendas(prev => prev.map(v => v.id === id ? updated : v))
      if (detail?.id === id) setDetail(updated)
      toast.success(`Status atualizado para "${statusMeta[status]?.label}"`)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta venda?')) return
    const res = await fetch(`/api/vendas/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setVendas(prev => prev.filter(v => v.id !== id))
      setDetail(null)
      toast.success('Venda excluída')
    }
  }

  const receitaTotal = vendas.filter(v => v.status === 'concluida').reduce((s, v) => s + (Number(v.valorVenda) || 0), 0)
  const comissaoTotal = vendas.filter(v => v.status === 'concluida').reduce((s, v) => s + (Number(v.comissaoValor ?? (v as unknown as Record<string,unknown>).comissao) || 0), 0)

  function nomeImovel(id: string) { return imoveis.find(i => i.id === id)?.nome ?? id }
  function nomeCliente(id: string) { return clientes.find(c => c.id === id)?.nome ?? id }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-400" /> Vendas
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Gestão de negociações e comissões</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
        >
          <Plus className="w-4 h-4" /> Nova Venda
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total de Vendas', value: vendas.length, color: '#3b82f6', icon: ShoppingBag },
          { label: 'Receita (concluídas)', value: `R$ ${receitaTotal.toLocaleString('pt-BR')}`, color: '#10b981', icon: DollarSign },
          { label: 'Comissão Total', value: `R$ ${comissaoTotal.toLocaleString('pt-BR')}`, color: '#f59e0b', icon: Award },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
          </div>
        ))}
      </motion.div>

      {/* Vendas List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {vendas.length === 0 && (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(59,130,246,0.08)' }}>
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Nenhuma venda cadastrada</p>
            </div>
          )}
          {vendas.map((venda) => {
            const sm = statusMeta[venda.status]
            return (
              <motion.div
                key={venda.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">{nomeImovel(venda.imovelId)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: sm?.bg, color: sm?.color }}>
                        {sm?.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">Comprador: <span className="text-slate-300">{nomeCliente(venda.compradorId)}</span></div>
                    {venda.dataVenda && (
                      <div className="text-xs text-slate-500 mt-0.5">{new Date(venda.dataVenda + 'T12:00:00').toLocaleDateString('pt-BR')}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold" style={{ color: '#10b981' }}>
                      R$ {(Number(venda.valorVenda) || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-amber-400">
                      Comissão: R$ {(Number(venda.comissaoValor ?? (venda as unknown as Record<string,unknown>).comissao) || 0).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[10px] text-slate-500">({venda.comissaoPercent}%)</div>
                  </div>
                </div>

                {/* Status actions */}
                <div className="mt-3 pt-3 flex items-center gap-2 flex-wrap" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
                  <span className="text-[11px] text-slate-500">Mover para:</span>
                  {Object.entries(statusMeta).filter(([k]) => k !== venda.status).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => handleUpdateStatus(venda.id, k as Venda['status'])}
                      className="text-[11px] px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                      style={{ background: v.bg, color: v.color, border: `1px solid ${v.color}30` }}
                    >
                      {v.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleDelete(venda.id)}
                    className="ml-auto text-[11px] px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* New Venda Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl p-6"
              style={{ background: '#0d0d2b', border: '1px solid rgba(59,130,246,0.25)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-400" /> Nova Venda
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Imóvel *</label>
                  <select value={form.imovelId} onChange={e => setForm({ ...form, imovelId: e.target.value })} required
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0d1020', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <option value="">Selecione...</option>
                    {imoveis.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Comprador *</label>
                  <select value={form.compradorId} onChange={e => setForm({ ...form, compradorId: e.target.value })} required
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0d1020', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <option value="">Selecione...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Valor (R$) *</label>
                    <input value={form.valorVenda} onChange={e => setForm({ ...form, valorVenda: e.target.value })} required
                      type="number" placeholder="Ex: 450000"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Comissão (%)</label>
                    <input value={form.comissaoPercent} onChange={e => setForm({ ...form, comissaoPercent: e.target.value })}
                      type="number" step="0.1" min="0" max="20"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Data *</label>
                    <input value={form.dataVenda} onChange={e => setForm({ ...form, dataVenda: e.target.value })} required
                      type="date"
                      className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)', colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Venda['status'] })}
                      className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                      style={{ background: '#0d1020', border: '1px solid rgba(59,130,246,0.2)' }}>
                      {Object.entries(statusMeta).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                {form.valorVenda && (
                  <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    Comissão calculada: <span className="font-semibold text-emerald-400">
                      R$ {(Number(form.valorVenda) * Number(form.comissaoPercent) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Observações</label>
                  <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })}
                    rows={2} placeholder="Notas sobre a negociação..."
                    className="w-full px-3 py-2 rounded-xl text-sm text-white bg-transparent outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }} />
                </div>
                <motion.button
                  type="submit" disabled={saving}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                  {saving ? 'Salvando...' : 'Registrar Venda'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
