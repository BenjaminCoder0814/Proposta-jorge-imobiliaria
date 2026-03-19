'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Key, Building2, Calendar, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import type { Imovel, Cliente } from '@/lib/types'

export default function NovoAluguelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  const [form, setForm] = useState({
    imovelId: '',
    locatarioId: '',
    proprietarioId: '',
    valorAluguel: '',
    diaVencimento: '10',
    dataInicio: '',
    dataFim: '',
    deposito: '',
    indiceReajuste: 'IGPM',
    observacoes: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/imoveis').then(r => r.json()),
      fetch('/api/clientes').then(r => r.json()),
    ]).then(([im, cl]) => { setImoveis(im); setClientes(cl) })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.imovelId || !form.locatarioId || !form.valorAluguel || !form.dataInicio || !form.dataFim) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/alugueis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        // Mark imovel as alugado
        await fetch(`/api/imoveis/${form.imovelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'alugado' }),
        })
        toast.success('Contrato criado com sucesso!')
        router.push('/alugueis')
      } else {
        toast.error('Erro ao criar contrato')
      }
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = 'w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none'
  const fieldStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href="/alugueis">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <ArrowLeft className="w-4 h-4 text-purple-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" /> Novo Contrato de Aluguel
          </h1>
          <p className="text-slate-400 text-xs">Cadastrar novo contrato de locação</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card title="Imóvel e Partes" icon={Building2}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Imóvel *</label>
              <select name="imovelId" value={form.imovelId} onChange={handleChange} className={fieldClass} style={fieldStyle} required>
                <option value="" className="bg-[#0d0d2b]">Selecionar imóvel...</option>
                {imoveis.filter(i => i.status !== 'vendido').map(i => (
                  <option key={i.id} value={i.id} className="bg-[#0d0d2b]">{i.titulo} — {i.bairro || i.cidade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Locatário *</label>
              <select name="locatarioId" value={form.locatarioId} onChange={handleChange} className={fieldClass} style={fieldStyle} required>
                <option value="" className="bg-[#0d0d2b]">Selecionar locatário...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0d0d2b]">{c.nome} — {c.telefone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Proprietário</label>
              <select name="proprietarioId" value={form.proprietarioId} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                <option value="" className="bg-[#0d0d2b]">Selecionar proprietário...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0d0d2b]">{c.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card title="Valores" icon={DollarSign}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Valor do Aluguel (R$) *</label>
              <input name="valorAluguel" type="number" value={form.valorAluguel} onChange={handleChange} placeholder="0,00" className={fieldClass} style={fieldStyle} required />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Depósito (R$)</label>
              <input name="deposito" type="number" value={form.deposito} onChange={handleChange} placeholder="0,00" className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Dia de Vencimento</label>
              <input name="diaVencimento" type="number" min="1" max="28" value={form.diaVencimento} onChange={handleChange} className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Índice de Reajuste</label>
              <select name="indiceReajuste" value={form.indiceReajuste} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                <option value="IGPM" className="bg-[#0d0d2b]">IGP-M</option>
                <option value="IPCA" className="bg-[#0d0d2b]">IPCA</option>
                <option value="nenhum" className="bg-[#0d0d2b]">Nenhum</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Período" icon={Calendar}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Data de Início *</label>
              <input name="dataInicio" type="date" value={form.dataInicio} onChange={handleChange} className={fieldClass} style={fieldStyle} required />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Data de Término *</label>
              <input name="dataFim" type="date" value={form.dataFim} onChange={handleChange} className={fieldClass} style={fieldStyle} required />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs text-slate-400 block mb-1.5">Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Informações adicionais sobre o contrato..." rows={3} className={`${fieldClass} resize-none`} style={fieldStyle} />
          </div>
        </Card>

        <div className="flex gap-3 pt-2">
          <Link href="/alugueis" className="flex-1">
            <button type="button" className="w-full py-3 rounded-xl text-sm font-medium text-slate-300" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancelar</button>
          </Link>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</span> : 'Criar Contrato'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
        <Icon className="w-4 h-4 text-purple-400" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}
