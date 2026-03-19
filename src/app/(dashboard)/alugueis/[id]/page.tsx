'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft, FileText, User, Calendar, DollarSign, CheckCircle2, XCircle, Clock, Plus, Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import type { Aluguel, Pagamento, Cliente, Imovel } from '@/lib/types'

const statusConfig: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  pago: { label: 'Pago', icon: CheckCircle2, color: '#10b981' },
  pendente: { label: 'Pendente', icon: Clock, color: '#f59e0b' },
  atrasado: { label: 'Atrasado', icon: XCircle, color: '#ef4444' },
}

export default function AluguelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [aluguel, setAluguel] = useState<Aluguel | null>(null)
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [pForm, setPForm] = useState({ competencia: '', valor: '', valorPago: '', dataPagamento: '', status: 'pago', observacoes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/alugueis/${id}`).then(r => r.json()),
      fetch(`/api/pagamentos?aluguelId=${id}`).then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
      fetch('/api/imoveis').then(r => r.json()),
    ]).then(([a, p, c, i]) => {
      setAluguel(a); setPagamentos(p); setClientes(c); setImoveis(i); setLoading(false)
    })
  }, [id])

  const getCliente = (cid: string) => clientes.find(c => c.id === cid)
  const getImovel = (iid: string) => imoveis.find(i => i.id === iid)

  async function handleAddPagamento(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/pagamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pForm, aluguelId: id, valor: Number(pForm.valor), valorPago: Number(pForm.valorPago) }),
    })
    setSaving(false)
    if (res.ok) {
      const novo = await res.json()
      setPagamentos(prev => [...prev, novo])
      setShowModal(false)
      setPForm({ competencia: '', valor: '', valorPago: '', dataPagamento: '', status: 'pago', observacoes: '' })
      toast.success('Pagamento registrado!')
    } else {
      toast.error('Erro ao salvar')
    }
  }

  async function handleDeletePagamento(pid: string) {
    if (!confirm('Excluir este pagamento?')) return
    const res = await fetch(`/api/pagamentos/${pid}`, { method: 'DELETE' })
    if (res.ok) {
      setPagamentos(prev => prev.filter(p => p.id !== pid))
      toast.success('Pagamento excluído')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  if (!aluguel) return <div className="text-slate-400 text-center mt-20">Contrato não encontrado</div>

  const locatario = getCliente(aluguel.locatarioId)
  const proprietario = getCliente(aluguel.proprietarioId)
  const imovel = getImovel(aluguel.imovelId)
  const totalPago = pagamentos.filter(p => p.status === 'pago').reduce((s, p) => s + (p.valorPago || 0), 0)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/alugueis">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <ArrowLeft className="w-4 h-4 text-slate-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Contrato de Aluguel
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{imovel?.titulo || aluguel.imovelId}</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: aluguel.status === 'ativo' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: aluguel.status === 'ativo' ? '#10b981' : '#ef4444' }}>
          {aluguel.status}
        </span>
      </motion.div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Partes</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}><User className="w-4 h-4 text-purple-400" /></div>
              <div>
                <p className="text-xs text-slate-500">Locatário</p>
                <p className="text-sm text-white font-medium">{locatario?.nome || '—'}</p>
                {locatario?.telefone && <p className="text-xs text-slate-400">{locatario.telefone}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)' }}><User className="w-4 h-4 text-emerald-400" /></div>
              <div>
                <p className="text-xs text-slate-500">Proprietário</p>
                <p className="text-sm text-white font-medium">{proprietario?.nome || '—'}</p>
                {proprietario?.telefone && <p className="text-xs text-slate-400">{proprietario.telefone}</p>}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valores e Datas</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Aluguel', value: `R$ ${aluguel.valorAluguel.toLocaleString('pt-BR')}`, color: '#10b981' },
              { label: 'Depósito', value: `R$ ${(aluguel.deposito || 0).toLocaleString('pt-BR')}`, color: '#f59e0b' },
              { label: 'Vencimento', value: `Dia ${aluguel.diaVencimento}`, color: '#3b82f6' },
              { label: 'Reajuste', value: aluguel.indiceReajuste.toUpperCase(), color: '#8b5cf6' },
            ].map(item => (
              <div key={item.label} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(aluguel.dataInicio), 'dd/MM/yyyy', { locale: ptBR })} → {format(new Date(aluguel.dataFim), 'dd/MM/yyyy', { locale: ptBR })}
          </div>
        </motion.div>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="flex items-center justify-between rounded-2xl p-4"
        style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="text-center">
          <p className="text-xs text-slate-500">Total de pagamentos</p>
          <p className="text-lg font-bold text-white">{pagamentos.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Total recebido</p>
          <p className="text-lg font-bold text-emerald-400">R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Em aberto</p>
          <p className="text-lg font-bold text-amber-400">{pagamentos.filter(p => p.status === 'pendente').length}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', boxShadow: '0 0 16px rgba(139,92,246,0.3)' }}>
          <Plus className="w-4 h-4" /> Registrar Pagamento
        </button>
      </motion.div>

      {/* Payments Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" /> Histórico de Pagamentos</h3>
        </div>
        {pagamentos.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">Nenhum pagamento registrado</div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
            {pagamentos.sort((a, b) => a.competencia.localeCompare(b.competencia)).map((p, i) => {
              const sc = statusConfig[p.status]
              const Icon = sc.icon
              return (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${sc.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: sc.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{p.competencia}</p>
                      {p.dataPagamento && <p className="text-xs text-slate-500">Pago em {format(new Date(p.dataPagamento), 'dd/MM/yyyy', { locale: ptBR })}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold" style={{ color: sc.color }}>R$ {(p.valorPago || p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      {p.valorPago && p.valorPago !== p.valor && <p className="text-xs text-slate-500">Venc: R$ {p.valor.toLocaleString('pt-BR')}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${sc.color}15`, color: sc.color }}>{sc.label}</span>
                    <button onClick={() => handleDeletePagamento(p.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl p-5 space-y-4"
            style={{ background: '#0d0d2b', border: '1px solid rgba(139,92,246,0.3)' }}>
            <h3 className="text-base font-semibold text-white">Registrar Pagamento</h3>
            <form onSubmit={handleAddPagamento} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Competência</label>
                  <input type="month" required value={pForm.competencia} onChange={e => setPForm(p => ({ ...p, competencia: e.target.value }))}
                    className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.25)' }} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <select value={pForm.status} onChange={e => setPForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-[#0d0d2b] text-sm text-white outline-none px-3 py-2 rounded-xl cursor-pointer" style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Valor (R$)</label>
                  <input type="number" step="0.01" required value={pForm.valor} onChange={e => setPForm(p => ({ ...p, valor: e.target.value }))} placeholder={String(aluguel.valorAluguel)}
                    className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.25)' }} />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Valor pago (R$)</label>
                  <input type="number" step="0.01" value={pForm.valorPago} onChange={e => setPForm(p => ({ ...p, valorPago: e.target.value }))}
                    className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.25)' }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Data do pagamento</label>
                <input type="date" value={pForm.dataPagamento} onChange={e => setPForm(p => ({ ...p, dataPagamento: e.target.value }))}
                  className="w-full bg-transparent text-sm text-white outline-none px-3 py-2 rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.25)' }} />
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm text-slate-400" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
                  {saving ? '...' : 'Salvar'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
