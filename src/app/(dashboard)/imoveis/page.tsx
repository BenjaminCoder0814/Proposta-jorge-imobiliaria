'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Building2,
  Plus,
  Search,
  Home,
  Bed,
  Bath,
  Car,
  MapPin,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Star,
  ChevronDown,
  Hash,
  Building,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Imovel } from '@/lib/types'

const statusConfig = {
  disponivel: { label: 'Disponível', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
  reservado: { label: 'Reservado', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  vendido: { label: 'Vendido', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  alugado: { label: 'Alugado', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
}

const tipoLabel: Record<string, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  sala: 'Sala',
}

function ImovelCard({ imovel, onDelete }: { imovel: Imovel; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = statusConfig[imovel.status]
  const foto = imovel.fotos[0] || null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13, 13, 43, 0.85)',
        border: '1px solid rgba(59, 130, 246, 0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background: '#0a0a20' }}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={imovel.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,3,17,0.8) 0%, transparent 60%)' }} />

        {/* Status badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
        >
          {status.label}
        </div>

        {/* Destaque */}
        {imovel.destaque && (
          <div
            className="absolute top-3 right-10 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            <Star className="w-3 h-3 fill-current" />
            Destaque
          </div>
        )}

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute right-0 top-9 w-40 rounded-xl overflow-hidden z-20 shadow-2xl"
                style={{ background: '#0d0d2b', border: '1px solid rgba(59,130,246,0.2)' }}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link href={`/imoveis/${imovel.id}`}>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 transition-colors">
                    <Eye className="w-4 h-4 text-blue-400" /> Ver detalhes
                  </button>
                </Link>
                <Link href={`/imoveis/${imovel.id}/editar`}>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 transition-colors">
                    <Pencil className="w-4 h-4 text-amber-400" /> Editar
                  </button>
                </Link>
                <button
                  onClick={() => { onDelete(imovel.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{imovel.titulo}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin className="w-3 h-3" />
          {imovel.bairro ? `${imovel.bairro}, ` : ''}{imovel.cidade}
        </div>

        {/* Features */}
        {imovel.tipo !== 'terreno' && (
          <div className="flex items-center gap-3 mb-3">
            {imovel.quartos > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Bed className="w-3.5 h-3.5 text-slate-500" /> {imovel.quartos}
              </span>
            )}
            {imovel.banheiros > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Bath className="w-3.5 h-3.5 text-slate-500" /> {imovel.banheiros}
              </span>
            )}
            {imovel.garagem > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Car className="w-3.5 h-3.5 text-slate-500" /> {imovel.garagem}
              </span>
            )}
            {imovel.area > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Home className="w-3.5 h-3.5 text-slate-500" /> {imovel.area}m²
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              R$ {imovel.valor.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-slate-500">{tipoLabel[imovel.tipo]} · {imovel.finalidade === 'aluguel' ? 'Aluguel' : imovel.finalidade === 'venda' ? 'Venda' : 'Venda/Aluguel'}</div>
          </div>
          <Link href={`/imoveis/${imovel.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}
            >
              Ver
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroCep, setFiltroCep] = useState('')
  const [filtroCondominio, setFiltroCondominio] = useState('')

  useEffect(() => {
    fetch('/api/imoveis').then((r) => r.json()).then((data) => {
      setImoveis(data)
      setLoading(false)
    })
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Excluir este imóvel?')) return
    const res = await fetch(`/api/imoveis/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setImoveis((prev) => prev.filter((i) => i.id !== id))
      toast.success('Imóvel excluído')
    } else {
      toast.error('Erro ao excluir')
    }
  }

  const filtered = imoveis.filter((i) => {
    const matchSearch =
      !search ||
      i.titulo.toLowerCase().includes(search.toLowerCase()) ||
      i.endereco.toLowerCase().includes(search.toLowerCase()) ||
      i.bairro.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filtroStatus === 'todos' || i.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || i.tipo === filtroTipo
    const matchCep = !filtroCep || (i.cep && i.cep.replace(/\D/g, '').includes(filtroCep.replace(/\D/g, '')))
    const matchCond = !filtroCondominio || (i.condominio && i.condominio.toLowerCase().includes(filtroCondominio.toLowerCase()))
    return matchSearch && matchStatus && matchTipo && matchCep && matchCond
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Imóveis
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{imoveis.length} imóvel(is) cadastrado(s)</p>
        </div>
        <Link href="/imoveis/novo">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #0891b2, #1d4ed8)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            Novo Imóvel
          </motion.button>
        </Link>
      </motion.div>

      {/* Filters row 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1 min-w-50"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por título, rua, bairro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
          >
            <option value="todos" className="bg-[#0d0d2b]">Todos os status</option>
            <option value="disponivel" className="bg-[#0d0d2b]">Disponível</option>
            <option value="reservado" className="bg-[#0d0d2b]">Reservado</option>
            <option value="vendido" className="bg-[#0d0d2b]">Vendido</option>
            <option value="alugado" className="bg-[#0d0d2b]">Alugado</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <Home className="w-4 h-4 text-slate-500" />
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="bg-transparent text-sm text-slate-300 outline-none cursor-pointer"
          >
            <option value="todos" className="bg-[#0d0d2b]">Todos os tipos</option>
            <option value="casa" className="bg-[#0d0d2b]">Casa</option>
            <option value="apartamento" className="bg-[#0d0d2b]">Apartamento</option>
            <option value="terreno" className="bg-[#0d0d2b]">Terreno</option>
            <option value="comercial" className="bg-[#0d0d2b]">Comercial</option>
            <option value="sala" className="bg-[#0d0d2b]">Sala</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      </motion.div>

      {/* Filters row 2 - CEP and condominio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-3"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Filtrar por CEP..."
            value={filtroCep}
            onChange={(e) => setFiltroCep(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-32"
          />
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(13,13,43,0.6)', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Filtrar por condomínio..."
            value={filtroCondominio}
            onChange={(e) => setFiltroCondominio(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-44"
          />
        </div>
        {(filtroCep || filtroCondominio || (filtroStatus !== 'todos') || (filtroTipo !== 'todos') || search) && (
          <button
            onClick={() => { setSearch(''); setFiltroStatus('todos'); setFiltroTipo('todos'); setFiltroCep(''); setFiltroCondominio('') }}
            className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            Limpar filtros
          </button>
        )}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-48 rounded-2xl"
          style={{ background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(59,130,246,0.2)' }}
        >
          <Building2 className="w-12 h-12 text-slate-700 mb-3" />
          <p className="text-slate-500 text-sm">Nenhum imóvel encontrado</p>
          <Link href="/imoveis/novo">
            <button className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              + Cadastrar primeiro imóvel
            </button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
