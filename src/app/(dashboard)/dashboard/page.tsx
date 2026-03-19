'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Home,
  Key,
  AlertTriangle,
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import type { Imovel, Aluguel, Cliente, Pagamento, Visita } from '@/lib/types'
import { format, isAfter, isBefore, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / 30
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, 30)
    return () => clearInterval(timer)
  }, [value])
  return <span>{prefix}{display.toLocaleString('pt-BR')}</span>
}

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  icon: React.ElementType
  color: string
  gradient: string
  index: number
  subtitle?: string
}

function StatCard({ title, value, prefix, icon: Icon, color, gradient, index, subtitle }: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, scale: 1.01 }}
      className="rounded-2xl p-5 relative overflow-hidden cursor-default"
      style={{
        background: 'rgba(13, 13, 43, 0.8)',
        border: `1px solid ${color}22`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${color}11`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: gradient, transform: 'translate(30%, -30%)' }}
      />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: gradient, boxShadow: `0 0 20px ${color}40` }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 opacity-30" style={{ color }} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        <AnimatedNumber value={value} prefix={prefix} />
      </div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && <div className="text-xs mt-1" style={{ color: `${color}bb` }}>{subtitle}</div>}
    </motion.div>
  )
}

export default function DashboardPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [alugueis, setAlugueis] = useState<Aluguel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/imoveis').then((r) => r.json()),
      fetch('/api/alugueis').then((r) => r.json()),
      fetch('/api/clientes').then((r) => r.json()),
      fetch('/api/pagamentos').then((r) => r.json()),
      fetch('/api/visitas').then((r) => r.json()),
    ]).then(([im, al, cl, pg, vi]) => {
      setImoveis(im)
      setAlugueis(al)
      setClientes(cl)
      setPagamentos(pg)
      setVisitas(vi)
      setLoading(false)
    })
  }, [])

  const hoje = new Date()
  const hora = hoje.getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const imoveisDisponiveis = imoveis.filter((i) => i.status === 'disponivel').length
  const alugueisAtivos = alugueis.filter((a) => a.status === 'ativo').length
  const alugueisAtrasados = alugueis.filter((a) => a.status === 'inadimplente').length

  const receitaMes = pagamentos
    .filter(
      (p) =>
        p.status === 'pago' &&
        p.dataPagamento?.startsWith(format(hoje, 'yyyy-MM'))
    )
    .reduce((acc, p) => acc + (p.valorPago || 0), 0)

  const visitasAgendadas = visitas.filter((v) => v.status === 'agendada').length

  const alertasVencimento = alugueis
    .filter((a) => a.status === 'ativo')
    .filter((a) => {
      const fim = new Date(a.dataFim)
      return isBefore(fim, addDays(hoje, 60)) && isAfter(fim, hoje)
    })

  // Chart data — last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1)
    const mesStr = format(d, 'yyyy-MM')
    const receita = pagamentos
      .filter((p) => p.status === 'pago' && p.dataPagamento?.startsWith(mesStr))
      .reduce((acc, p) => acc + (p.valorPago || 0), 0)
    return { mes: format(d, 'MMM', { locale: ptBR }), receita }
  })

  // Status breakdown
  const statusData = [
    { name: 'Disponível', value: imoveis.filter((i) => i.status === 'disponivel').length, color: '#10b981' },
    { name: 'Alugado', value: imoveis.filter((i) => i.status === 'alugado').length, color: '#8b5cf6' },
    { name: 'Vendido', value: imoveis.filter((i) => i.status === 'vendido').length, color: '#3b82f6' },
    { name: 'Reservado', value: imoveis.filter((i) => i.status === 'reservado').length, color: '#f59e0b' },
  ]

  const stats = [
    { title: 'Total de Imóveis', value: imoveis.length, icon: Building2, color: '#3b82f6', gradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', subtitle: 'No portfólio' },
    { title: 'Disponíveis p/ Venda', value: imoveisDisponiveis, icon: Home, color: '#06b6d4', gradient: 'linear-gradient(135deg,#0891b2,#06b6d4)', subtitle: 'Prontos para negociar' },
    { title: 'Aluguéis Ativos', value: alugueisAtivos, icon: Key, color: '#8b5cf6', gradient: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', subtitle: 'Contratos vigentes' },
    { title: 'Em Inadimplência', value: alugueisAtrasados, icon: AlertTriangle, color: '#ef4444', gradient: 'linear-gradient(135deg,#dc2626,#ef4444)', subtitle: 'Requerem atenção' },
    { title: 'Receita do Mês', value: receitaMes, prefix: 'R$ ', icon: DollarSign, color: '#10b981', gradient: 'linear-gradient(135deg,#059669,#10b981)', subtitle: 'Aluguéis recebidos' },
    { title: 'Clientes Cadastrados', value: clientes.length, icon: Users, color: '#f59e0b', gradient: 'linear-gradient(135deg,#d97706,#f59e0b)', subtitle: 'Na base' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {saudacao},{' '}
            <span className="text-gradient-blue">Jorge!</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#93c5fd',
          }}
        >
          <TrendingUp className="w-4 h-4" />
          Sistema Ativo
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart — Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: 'rgba(13, 13, 43, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Receita dos Últimos 6 Meses</h2>
              <p className="text-xs text-slate-500">Aluguéis recebidos (R$)</p>
            </div>
            <div
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <CheckCircle className="w-3 h-3 inline mr-1" />
              Receita
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" />
              <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#0d0d2b', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, color: '#e2e8f0' }}
                formatter={(v) => v != null ? [`R$ ${Number(v).toLocaleString('pt-BR')}`, 'Receita'] : ['', 'Receita']}
              />
              <Area type="monotone" dataKey="receita" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorReceita)" dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart — Imovel status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(13, 13, 43, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
          }}
        >
          <h2 className="text-base font-semibold text-white mb-1">Status dos Imóveis</h2>
          <p className="text-xs text-slate-500 mb-5">Distribuição por status</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={statusData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0d0d2b', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, color: '#e2e8f0' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, i) => (
                  <rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alerts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alertas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(13, 13, 43, 0.8)', border: '1px solid rgba(59, 130, 246, 0.15)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Contratos Vencendo</h2>
            {alertasVencimento.length > 0 && (
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                {alertasVencimento.length}
              </span>
            )}
          </div>
          {alertasVencimento.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Nenhum contrato vencendo nos próximos 60 dias
            </div>
          ) : (
            <div className="space-y-2">
              {alertasVencimento.slice(0, 4).map((a) => {
                const imovel = imoveis.find((i) => i.id === a.imovelId)
                const dias = Math.ceil((new Date(a.dataFim).getTime() - hoje.getTime()) / 86400000)
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
                  >
                    <div>
                      <div className="text-sm font-medium text-white">{imovel?.titulo || 'Imóvel'}</div>
                      <div className="text-xs text-slate-500">Vence em {dias} dias</div>
                    </div>
                    <span className="text-xs font-medium text-amber-400">
                      {format(new Date(a.dataFim), 'dd/MM/yyyy')}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Visitas Agendadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(13, 13, 43, 0.8)', border: '1px solid rgba(59, 130, 246, 0.15)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-white">Próximas Visitas</h2>
            {visitasAgendadas > 0 && (
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.25)' }}
              >
                {visitasAgendadas}
              </span>
            )}
          </div>
          {visitas.filter((v) => v.status === 'agendada').length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
              <Clock className="w-4 h-4 text-slate-600" />
              Nenhuma visita agendada
            </div>
          ) : (
            <div className="space-y-2">
              {visitas
                .filter((v) => v.status === 'agendada')
                .slice(0, 4)
                .map((v) => {
                  const imovel = imoveis.find((i) => i.id === v.imovelId)
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
                    >
                      <div>
                        <div className="text-sm font-medium text-white">{v.nomeContato || 'Visita'}</div>
                        <div className="text-xs text-slate-500">{imovel?.titulo || 'Imóvel'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-blue-400">
                          {format(new Date(v.data), 'dd/MM', { locale: ptBR })}
                        </div>
                        <div className="text-xs text-slate-500">{v.hora}</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
