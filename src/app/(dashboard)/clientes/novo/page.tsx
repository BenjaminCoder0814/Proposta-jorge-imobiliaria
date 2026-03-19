'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, CreditCard, Tag, FileText, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function NovoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    tipo: 'comprador',
    interesse: '',
    observacoes: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return }
    setLoading(true)
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Cliente cadastrado!')
      router.push('/clientes')
    } else {
      toast.error('Erro ao salvar cliente')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href="/clientes">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-emerald-400" /> Novo Cliente</h1>
          <p className="text-slate-500 text-sm mt-0.5">Preencha os dados do cliente</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dados Pessoais */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" /> Dados Pessoais
          </h2>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Nome completo *</label>
            <input required value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Maria Silva"
              className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none px-3 py-2.5 rounded-xl"
              style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">CPF</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <CreditCard className="w-4 h-4 text-slate-600" />
                <input value={form.cpf} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00"
                  className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Tipo *</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)} required
                className="w-full bg-[#0d0d2b] text-sm text-white outline-none px-3 py-2.5 rounded-xl cursor-pointer"
                style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="locatario">Locatário</option>
                <option value="proprietario">Proprietário</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Contato */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" /> Contato
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Telefone / WhatsApp</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <Phone className="w-4 h-4 text-slate-600" />
                <input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(19) 99999-9999"
                  className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <Mail className="w-4 h-4 text-slate-600" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@exemplo.com"
                  className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interesse e Observações */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-5 space-y-4"
          style={{ background: 'rgba(13,13,43,0.85)', border: '1px solid rgba(59,130,246,0.12)' }}>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" /> Interesse &amp; Observações
          </h2>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Interesse / Objetivo</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <Tag className="w-4 h-4 text-slate-600" />
              <input value={form.interesse} onChange={e => set('interesse', e.target.value)} placeholder="Ex: Casa 3 quartos em Eng. Coelho até R$ 400k"
                className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Observações</label>
            <div className="flex gap-2 px-3 py-2.5 rounded-xl" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <FileText className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)}
                placeholder="Anotações, preferências, informações adicionais..."
                rows={3} className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-full resize-none" />
            </div>
          </div>
        </motion.div>

        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          type="submit" disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 0 25px rgba(16,185,129,0.35)' }}>
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </motion.button>
      </form>
    </div>
  )
}
