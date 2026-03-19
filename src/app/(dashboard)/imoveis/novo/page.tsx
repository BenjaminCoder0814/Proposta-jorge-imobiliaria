'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Star,
  MapPin,
  Home,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovoImovelPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    tipo: 'casa',
    status: 'disponivel',
    finalidade: 'venda',
    endereco: '',
    bairro: '',
    cidade: 'Engenheiro Coelho',
    cep: '',
    area: '',
    quartos: '',
    banheiros: '',
    garagem: '',
    valor: '',
    descricao: '',
    destaque: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setFotos((prev) => [...prev, url])
      } else {
        toast.error(`Erro ao enviar ${file.name}`)
      }
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t])
    }
    setTagInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo) { toast.error('Informe o título do imóvel'); return }
    if (!form.valor) { toast.error('Informe o valor'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/imoveis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fotos, tags }),
      })
      if (res.ok) {
        toast.success('Imóvel cadastrado com sucesso!')
        router.push('/imoveis')
      } else {
        toast.error('Erro ao cadastrar imóvel')
      }
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = `w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all`
  const fieldStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(59,130,246,0.2)' }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <Link href="/imoveis">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-400" /> Novo Imóvel
          </h1>
          <p className="text-slate-400 text-xs">Cadastrar um novo imóvel no portfólio</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Informações Básicas */}
        <Section title="Informações Básicas" icon={Building2}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Título *</Label>
              <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Casa 3 quartos no centro" className={fieldClass} style={fieldStyle} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <select name="tipo" value={form.tipo} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                  <option value="casa" className="bg-[#0d0d2b]">Casa</option>
                  <option value="apartamento" className="bg-[#0d0d2b]">Apartamento</option>
                  <option value="terreno" className="bg-[#0d0d2b]">Terreno</option>
                  <option value="comercial" className="bg-[#0d0d2b]">Comercial</option>
                  <option value="sala" className="bg-[#0d0d2b]">Sala</option>
                </select>
              </div>
              <div>
                <Label>Finalidade</Label>
                <select name="finalidade" value={form.finalidade} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                  <option value="venda" className="bg-[#0d0d2b]">Venda</option>
                  <option value="aluguel" className="bg-[#0d0d2b]">Aluguel</option>
                  <option value="ambos" className="bg-[#0d0d2b]">Venda e Aluguel</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select name="status" value={form.status} onChange={handleChange} className={fieldClass} style={fieldStyle}>
                  <option value="disponivel" className="bg-[#0d0d2b]">Disponível</option>
                  <option value="reservado" className="bg-[#0d0d2b]">Reservado</option>
                  <option value="vendido" className="bg-[#0d0d2b]">Vendido</option>
                  <option value="alugado" className="bg-[#0d0d2b]">Alugado</option>
                </select>
              </div>
              <div>
                <Label>Valor (R$) *</Label>
                <input name="valor" type="number" value={form.valor} onChange={handleChange} placeholder="0,00" className={fieldClass} style={fieldStyle} />
              </div>
            </div>
          </div>
        </Section>

        {/* Endereço */}
        <Section title="Endereço" icon={MapPin}>
          <div className="grid grid-cols-1 gap-4">
            <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número" className={fieldClass} style={fieldStyle} />
            <div className="grid grid-cols-3 gap-4">
              <input name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" className={fieldClass} style={fieldStyle} />
              <input name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" className={fieldClass} style={fieldStyle} />
              <input name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" className={fieldClass} style={fieldStyle} />
            </div>
          </div>
        </Section>

        {/* Características */}
        <Section title="Características" icon={Home}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Área (m²)</Label>
              <input name="area" type="number" value={form.area} onChange={handleChange} placeholder="0" className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <Label>Quartos</Label>
              <input name="quartos" type="number" value={form.quartos} onChange={handleChange} placeholder="0" className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <Label>Banheiros</Label>
              <input name="banheiros" type="number" value={form.banheiros} onChange={handleChange} placeholder="0" className={fieldClass} style={fieldStyle} />
            </div>
            <div>
              <Label>Garagem</Label>
              <input name="garagem" type="number" value={form.garagem} onChange={handleChange} placeholder="0" className={fieldClass} style={fieldStyle} />
            </div>
          </div>
          <div className="mt-4">
            <Label>Descrição</Label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o imóvel..."
              rows={3}
              className={`${fieldClass} resize-none`}
              style={fieldStyle}
            />
          </div>

          {/* Tags */}
          <div className="mt-4">
            <Label>Tags</Label>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((t) => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {t}
                  <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))}>
                    <X className="w-3 h-3 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Ex: piscina, churrasqueira..."
                className={`${fieldClass} flex-1`}
                style={fieldStyle}
              />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-xl text-sm text-blue-400 transition-all" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Destaque */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              name="destaque"
              checked={form.destaque}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">Marcar como destaque</span>
          </label>
        </Section>

        {/* Fotos */}
        <Section title="Fotos" icon={Upload}>
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-blue-500/50"
            style={{ borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.03)' }}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Clique para enviar fotos</p>
            <p className="text-xs text-slate-600 mt-1">JPG, PNG, WEBP até 10MB</p>
            {uploading && <p className="text-xs text-blue-400 mt-2 animate-pulse">Enviando...</p>}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />

          {fotos.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {fotos.map((url, i) => (
                <div key={url} className="relative group rounded-xl overflow-hidden h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: 'rgba(59,130,246,0.8)', color: '#fff' }}>Capa</div>
                  )}
                  <button
                    type="button"
                    onClick={() => setFotos((prev) => prev.filter((f) => f !== url))}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Link href="/imoveis" className="flex-1">
            <button type="button" className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Cancelar
            </button>
          </Link>
          <motion.button
            type="submit"
            disabled={loading || uploading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0891b2, #1d4ed8)', boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </span>
            ) : 'Cadastrar Imóvel'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5"
      style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}
    >
      <div className="flex items-center gap-2 mb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', paddingBottom: '12px' }}>
        <Icon className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs text-slate-400 mb-1.5 font-medium">{children}</label>
}
