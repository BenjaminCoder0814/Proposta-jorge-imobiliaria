'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, CheckCircle2, Clock, XCircle, Percent, Calculator } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { Pagamento, Aluguel } from '@/lib/types'

export default function FinanceiroPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [alugueis, setAlugueis] = useState<Aluguel[]>([])
  const [loading, setLoading] = useState(true)
  const [comissaoValor, setComissaoValor] = useState('')
  const [comissaoPerc, setComissaoPerc] = useState('5')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  useEffect(() => {
    Promise.all([fetch('/api/pagamentos').then(r => r.json()), fetch('/api/alugueis').then(r => r.json())])
      .then(([p, a]) => { setPagamentos(p); setAlugueis(a); setLoading(false) })
  }, [])

  // Monthly revenue chart data (last 6 months)
  const monthlyData = (() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const key = format(d, 'yyyy-MM')
      const label = format(d, 'MMM/yy', { locale: ptBR })
      const total = pagamentos.filter(p => p.competencia === key && p.status === 'pago').reduce((s, p) => s + (p.valorPago || p.valor), 0)
      return { mes: label, receita: total }
    })
  })()

  const totalReceita = pagamentos.filter(p => p.status === 'pago').reduce((s, p) => s + (p.valorPago || p.valor), 0)
  const totalPendente = pagamentos.filter(p => p.status === 'pendente').reduce((s, p) => s + p.valor, 0)
  const totalAtrasado = pagamentos.filter(p => p.status === 'atrasado').reduce((s, p) => s + p.valor, 0)

  const mesAtual = format(new Date(), 'yyyy-MM')
  const receitaMes = pagamentos.filter(p => p.competencia === mesAtual && p.status === 'pago').reduce((s, p) => s + (p.valorPago || p.valor), 0)

  type StatusEntry = { label: string; color: string; icon: React.ElementType }
  const statusConfig: Record<string, StatusEntry> = {
    pago: { label: 'Pago', color: '#10b981', icon: CheckCircle2 },
    pendente: { label: 'Pendente', color: '#f59e0b', icon: Clock },
    atrasado: { label: 'Atrasado', color: '#ef4444', icon: XCircle },
  }

  const filtered = pagamentos
    .filter(p => filtroStatus === 'todos' || p.status === filtroStatus)
    .sort((a, b) => b.competencia.localeCompare(a.competencia))

  const comissaoCalc = comissaoValor && comissaoPerc
    ? (parseFloat(comissaoValor) * parseFloat(comissaoPerc)) / 100 : null

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-6 h-6 text-pink-400" /> Financeiro</h1>
        <p className="text-slate-400 text-sm mt-0.5">Receitas, pagamentos e comissões</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita Total', value: totalReceita, color: '#10b981', prefix: 'R$ ' },
          { label: 'Mês Atual', value: receitaMes, color: '#3b82f6', prefix: 'R$ ' },
          { label: 'A Receber', value: totalPendente, color: '#f59e0b', prefix: 'R$ ' },
          { label: 'Em Atraso', value: totalAtrasado, color: '#ef4444', prefix: 'R$ ' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4" style={{ background: 'rgba(13,13,43,0.85)', border: `1px solid ${c.color}25` }}>
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-lg font-bold mt-1" style={{ color: c.color }}>
              {loading ? '—' : c.prefix + c.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-4"
        style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-pink-400" /> Receita dos Últimos 6 Meses</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#0d0d2b', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '10px', color: '#fff' }}
              formatter={(v) => v != null ? [`R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita'] : ['', 'Receita']} />
            <Area type="monotone" dataKey="receita" stroke="#ec4899" strokeWidth={2} fill="url(#gPink)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Commission Calculator */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-4"
        style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Calculator className="w-4 h-4 text-purple-400" /> Calculadora de Comissão</h3>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1.5 block">Valor do imóvel / aluguel (R$)</label>
            <input type="number" value={comissaoValor} onChange={e => setComissaoValor(e.target.value)} placeholder="Ex: 350000"
              className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2.5 rounded-xl"
              style={{ border: '1px solid rgba(139,92,246,0.2)' }} />
          </div>
          <div className="w-28">
            <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1"><Percent className="w-3 h-3" /> Comissão</label>
            <div className="flex items-center px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
              <input type="number" min="0" max="100" step="0.1" value={comissaoPerc} onChange={e => setComissaoPerc(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none" />
              <span className="text-slate-500 text-sm">%</span>
            </div>
          </div>
          {comissaoCalc !== null && (
            <div className="px-4 py-2.5 rounded-xl text-center" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', minWidth: 140 }}>
              <p className="text-xs text-slate-500">Sua comissão</p>
              <p className="text-lg font-bold text-purple-400">R$ {comissaoCalc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Payments List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" /> Todos os Pagamentos</h3>
          <div className="flex gap-1">
            {['todos', 'pago', 'pendente', 'atrasado'].map(f => (
              <button key={f} onClick={() => setFiltroStatus(f)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize"
                style={{ background: filtroStatus === f ? 'rgba(16,185,129,0.12)' : 'transparent', color: filtroStatus === f ? '#10b981' : '#64748b' }}>
                {f === 'todos' ? 'Todos' : statusConfig[f].label}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-slate-500 text-sm">Nenhum pagamento encontrado</p>
        ) : (
          <div className="divide-y divide-blue-900/30 max-h-96 overflow-y-auto scrollbar-thin">
            {filtered.map((p, i) => {
              const sc = statusConfig[p.status]
              const Icon = sc.icon
              const aluguel = alugueis.find(a => a.id === p.aluguelId)
              return (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${sc.color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: sc.color }} />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{p.competencia}</p>
                      {aluguel && <p className="text-xs text-slate-500">Contrato #{aluguel.id.slice(0, 8)}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold" style={{ color: sc.color }}>
                      R$ {(p.valorPago || p.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${sc.color}12`, color: sc.color }}>{sc.label}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
