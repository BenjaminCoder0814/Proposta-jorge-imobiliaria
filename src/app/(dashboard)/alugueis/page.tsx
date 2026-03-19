'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Key, Plus, Search, AlertTriangle, CheckCircle, Clock, DollarSign,
  Building2, User, Calendar, ChevronDown, X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Aluguel, Imovel, Cliente, Pagamento } from '@/lib/types'
import { format, isAfter } from 'date-fns'

const statusConfig = {
  ativo: { label: 'Ativo', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  inadimplente: { label: 'Inadimplente', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  encerrado: { label: 'Encerrado', color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
}

function PagamentoModal({
  aluguel,
  onClose,
  onSaved,
}: {
  aluguel: Aluguel
  onClose: () => void
  onSaved: () => void
}) {
  const hoje = new Date()
  const [form, setForm] = useState({
    competencia: format(hoje, 'yyyy-MM'),
    valor: String(aluguel.valorAluguel),
    valorPago: String(aluguel.valorAluguel),
    dataPagamento: format(hoje, 'yyyy-MM-dd'),
    status: 'pago',
    observacoes: '',
  })

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    const venc = `${form.competencia}-${String(aluguel.diaVencimento).padStart(2, '0')}`
    await fetch('/api/pagamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        aluguelId: aluguel.id,
        ...form,
        dataVencimento: venc,
      }),
    })
    toast.success('Pagamento registrado!')
    onSaved()
    onClose()
  }

  const fieldClass = 'w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none'
  const fieldStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.2)' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: '#0d0d2b', border: '1px solid rgba(59,130,246,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" /> Registrar Pagamento
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handle} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Competência (mês)</label>
            <input type="month" value={form.competencia} onChange={e => setForm(p => ({ ...p, competencia: e.target.value }))} className={fieldClass} style={fieldStyle} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Valor (R$)</label>
              <input type="number" value={form.valor} onChange={e => setForm(p => ({ ...p, valor: e.target.value }))} className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Valor Pago (R$)</label>
              <input type="number" value={form.valorPago} onChange={e => setForm(p => ({ ...p, valorPago: e.target.value }))} className={fieldClass} style={fieldStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Data do Pagamento</label>
            <input type="date" value={form.dataPagamento} onChange={e => setForm(p => ({ ...p, dataPagamento: e.target.value }))} className={fieldClass} style={fieldStyle} />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={fieldClass} style={fieldStyle}>
              <option value="pago" className="bg-[#0d0d2b]">Pago</option>
              <option value="parcial" className="bg-[#0d0d2b]">Parcial</option>
              <option value="atrasado" className="bg-[#0d0d2b]">Atrasado</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Observações</label>
            <input value={form.observacoes} onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))} placeholder="Opcional..." className={fieldClass} style={fieldStyle} />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
            Salvar Pagamento
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AlugueisPage() {
  const [alugueis, setAlugueis] = useState<Aluguel[]>([])
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [modalAluguel, setModalAluguel] = useState<Aluguel | null>(null)

  async function loadData() {
    const [al, im, cl, pg] = await Promise.all([
      fetch('/api/alugueis').then(r => r.json()),
      fetch('/api/imoveis').then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
      fetch('/api/pagamentos').then(r => r.json()),
    ])
    setAlugueis(al)
    setImoveis(im)
    setClientes(cl)
    setPagamentos(pg)
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const [al, im, cl, pg] = await Promise.all([
        fetch('/api/alugueis').then(r => r.json()),
        fetch('/api/imoveis').then(r => r.json()),
        fetch('/api/clientes').then(r => r.json()),
        fetch('/api/pagamentos').then(r => r.json()),
      ])
      setAlugueis(al); setImoveis(im); setClientes(cl); setPagamentos(pg); setLoading(false)
    }
    void init()
  }, [])

  const hoje = new Date()

  function getStatusPagamento(aluguel: Aluguel) {
    const mesAtual = format(hoje, 'yyyy-MM')
    const pgMes = pagamentos.find(p => p.aluguelId === aluguel.id && p.competencia === mesAtual)
    if (pgMes?.status === 'pago') return { label: 'Em dia', color: '#10b981', icon: CheckCircle }
    const diaVenc = new Date(hoje.getFullYear(), hoje.getMonth(), aluguel.diaVencimento)
    if (isAfter(hoje, diaVenc) && !pgMes) return { label: 'Atrasado', color: '#ef4444', icon: AlertTriangle }
    return { label: 'A vencer', color: '#f59e0b', icon: Clock }
  }

  const filtered = alugueis.filter(a => {
    const imovel = imoveis.find(i => i.id === a.imovelId)
    const locatario = clientes.find(c => c.id === a.locatarioId)
    const matchSearch = !search ||
      imovel?.titulo.toLowerCase().includes(search.toLowerCase()) ||
      locatario?.nome.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || a.status === filtroStatus
    return matchSearch && matchStatus
  })

  const totalReceita = pagamentos.filter(p => p.status === 'pago' && p.competencia === format(hoje, 'yyyy-MM')).reduce((acc, p) => acc + (p.valorPago || 0), 0)
  const atrasados = alugueis.filter(a => a.status === 'inadimplente' || getStatusPagamento(a).label === 'Atrasado').length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-purple-400" /> Aluguéis
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{alugueis.filter(a => a.status === 'ativo').length} contrato(s) ativo(s)</p>
        </div>
        <Link href="/alugueis/novo">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            <Plus className="w-4 h-4" /> Novo Contrato
          </motion.button>
        </Link>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Receita do Mês', value: `R$ ${totalReceita.toLocaleString('pt-BR')}`, color: '#10b981', icon: DollarSign, gradient: 'linear-gradient(135deg,#059669,#10b981)' },
          { label: 'Contratos Ativos', value: String(alugueis.filter(a => a.status === 'ativo').length), color: '#8b5cf6', icon: Key, gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' },
          { label: 'Com Atraso', value: String(atrasados), color: '#ef4444', icon: AlertTriangle, gradient: 'linear-gradient(135deg,#dc2626,#ef4444)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'rgba(13,13,43,0.8)', border: `1px solid ${s.color}20` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.gradient, boxShadow: `0 0 16px ${s.color}40` }}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Search className="w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Buscar por imóvel ou locatário..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer">
            <option value="todos" className="bg-[#0d0d2b]">Todos os status</option>
            <option value="ativo" className="bg-[#0d0d2b]">Ativo</option>
            <option value="inadimplente" className="bg-[#0d0d2b]">Inadimplente</option>
            <option value="encerrado" className="bg-[#0d0d2b]">Encerrado</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 rounded-2xl" style={{ background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(59,130,246,0.2)' }}>
          <Key className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">Nenhum contrato encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((a, i) => {
              const imovel = imoveis.find(im => im.id === a.imovelId)
              const locatario = clientes.find(c => c.id === a.locatarioId)
              const st = statusConfig[a.status]
              const pg = getStatusPagamento(a)
              const PgIcon = pg.icon

              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">
                          {imovel?.titulo || 'Imóvel não encontrado'}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${pg.color}15`, color: pg.color, border: `1px solid ${pg.color}30` }}>
                          <PgIcon className="w-3 h-3" /> {pg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{locatario?.nome || 'Locatário'}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />R$ {a.valorAluguel.toLocaleString('pt-BR')}/mês</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Venc. dia {a.diaVencimento}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{format(new Date(a.dataInicio), 'dd/MM/yyyy')} — {format(new Date(a.dataFim), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {a.status === 'ativo' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setModalAluguel(a)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
                          <DollarSign className="w-3.5 h-3.5" /> Pagamento
                        </motion.button>
                      )}
                      <Link href={`/alugueis/${a.id}`}>
                        <button className="px-3 py-2 rounded-xl text-xs font-medium" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                          Detalhes
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalAluguel && (
          <PagamentoModal aluguel={modalAluguel} onClose={() => setModalAluguel(null)} onSaved={loadData} />
        )}
      </AnimatePresence>
    </div>
  )
}
