'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  LayoutDashboard, Calendar, Users, DollarSign, Home, FileText,
  CheckCircle, ArrowRight, Video, Globe,
  Zap, Clock, BarChart3, Shield, Menu, X,
  ShoppingBag, UserPlus, TrendingUp, Play, Award,
  ChevronDown, Star, Sparkles,
} from 'lucide-react'

/* ─── helpers ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const start = Date.now()
    const dur = 2000
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref}>{prefix}{val.toLocaleString('pt-BR')}{suffix}</span>
}

/* ─── data ─────────────────────────────────────── */
const ERP_MODULES = [
  { icon: LayoutDashboard, label: 'Dashboard', desc: 'Visão geral do negócio em tempo real', color: '#3b82f6' },
  { icon: Home, label: 'Imóveis', desc: 'Portfólio completo com fotos e filtros avançados', color: '#10b981' },
  { icon: FileText, label: 'Aluguéis', desc: 'Contratos, vencimentos e inadimplências', color: '#f59e0b' },
  { icon: ShoppingBag, label: 'Vendas', desc: 'Negociações, comissões e pipeline de vendas', color: '#8b5cf6' },
  { icon: UserPlus, label: 'Leads / CRM', desc: 'Funil kanban de captação de clientes', color: '#f97316' },
  { icon: Users, label: 'Clientes', desc: 'Cadastro completo de compradores e locatários', color: '#06b6d4' },
  { icon: Calendar, label: 'Agenda', desc: 'Visitas, reuniões e follow-ups organizados', color: '#ec4899' },
  { icon: DollarSign, label: 'Financeiro', desc: 'Receitas, despesas e relatórios automáticos', color: '#14b8a6' },
]

const PAINS = [
  { emoji: '📋', text: 'Agenda bagunçada, visitas esquecidas, clientes no vácuo' },
  { emoji: '💸', text: 'Sem controle de contratos que vencem e inadimplências' },
  { emoji: '📱', text: 'Leads perdidos no WhatsApp sem acompanhamento' },
  { emoji: '📊', text: 'Não sabe quanto vai receber de comissão no mês' },
  { emoji: '🏠', text: 'Portfólio desorganizado, sem fotos e sem filtros de busca' },
  { emoji: '🌐', text: 'Site ultrapassado que não converte visitantes em clientes' },
]

const GAINS = [
  { icon: Clock, text: 'Recupere até 3h por dia em tarefas administrativas', color: '#3b82f6' },
  { icon: TrendingUp, text: 'Aumente vendas com gestão profissional de leads', color: '#10b981' },
  { icon: BarChart3, text: 'Relatórios automáticos para decisões mais inteligentes', color: '#f59e0b' },
  { icon: Shield, text: 'Dados seguros e acessíveis de qualquer dispositivo', color: '#8b5cf6' },
  { icon: Zap, text: 'Resposta rápida com histórico completo de cada cliente', color: '#f97316' },
  { icon: Award, text: 'Posicione-se como gestor profissional no mercado imobiliário', color: '#ec4899' },
]

const DRONE_BENEFITS = [
  'Destaque nos portais imobiliários (ZAP, Viva Real)',
  'Mais visualizações e cliques nos anúncios',
  'Transmite exclusividade e premium ao imóvel',
  'Acelera o processo de venda e locação',
  'Conteúdo para Instagram, YouTube e site',
  'Diferencial competitivo frente à concorrência',
]

const PROPERTY_IDS = [
  'photo-1613490493576-7fde63acd811',
  'photo-1600596542815-ffad4c1539a9',
  'photo-1564013799919-ab600027ffc6',
  'photo-1512917774080-9991f1c4c750',
  'photo-1580587771525-78b9dba3b914',
  'photo-1568605114967-8130f3a36994',
]

/* ─── main component ────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // allow access to demo after visiting landing
    document.cookie = 'pitch_visited=1; max-age=7200; path=/'
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Recursos', href: '#recursos' },
    { label: 'Drone', href: '#drone' },
    { label: 'Sites', href: '#sites' },
    { label: 'Preços', href: '#precos' },
  ]

  return (
    <div style={{ background: '#030311', color: 'white', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(3,3,17,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(59,130,246,0.12)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>JS</div>
            <div>
              <div className="text-sm font-bold text-white leading-none">Jorge Sousa</div>
              <div className="text-[10px] text-slate-400">Sistemas Imobiliários</div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</a>
            ))}
          </div>



          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-6 pb-4 space-y-3"
              style={{ background: 'rgba(3,3,17,0.98)', borderBottom: '1px solid rgba(59,130,246,0.12)' }}
            >
              {navLinks.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                  className="block text-sm text-slate-300 py-2 border-b"
                  style={{ borderColor: 'rgba(59,130,246,0.08)' }}>{l.label}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ paddingTop: '80px' }}>
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
            alt="Mansão aérea"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,3,17,0.7) 0%, rgba(3,3,17,0.5) 40%, rgba(3,3,17,0.85) 80%, #030311 100%)' }} />
        </div>

        {/* Animated grid */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Tag */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
            <Sparkles className="w-3.5 h-3.5" /> Soluções Tecnológicas para o Ramo Imobiliário
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="text-white">Pare de ser apenas</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              corretor.
            </span>
            <br />
            <span className="text-white">Comece a ser </span>
            <span style={{
              background: 'linear-gradient(135deg, #34d399, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              gestor.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema ERP completo + Vídeos profissionais com Drone + Site moderno e tecnológico.
            Tudo que você precisa para crescer no mercado imobiliário — com organização, dados e muito mais tempo.
          </motion.p>



          {/* Floating badges */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {[
              { text: '8 Módulos Completos', color: '#3b82f6' },
              { text: '100% Personalizado', color: '#10b981' },
              { text: 'Suporte Mensal Incluso', color: '#f59e0b' },
              { text: 'Pronto em Dias', color: '#8b5cf6' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: `${b.color}15`, border: `1px solid ${b.color}30`, color: b.color }}>
                <CheckCircle className="w-3 h-3" /> {b.text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 px-6" style={{ background: 'rgba(13,13,43,0.6)', borderTop: '1px solid rgba(59,130,246,0.08)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: 8, suffix: '', label: 'Módulos no sistema', color: '#3b82f6' },
            { val: 3, suffix: 'h', label: 'Horas economizadas/dia', color: '#10b981' },
            { val: 250, prefix: 'R$', label: 'Suporte mensal', color: '#f59e0b' },
            { val: 100, suffix: '%', label: 'Personalizado para você', color: '#8b5cf6' },
          ].map(item => (
            <motion.div key={item.label} {...fadeUp(0)}>
              <div className="text-4xl font-black mb-1" style={{ color: item.color }}>
                <CountUp to={item.val} suffix={item.suffix} prefix={item.prefix} />
              </div>
              <div className="text-sm text-slate-400">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              ⚠️ Você se reconhece aqui?
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              O dia a dia de um corretor
              <span style={{ color: '#f87171' }}> sem sistema</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Planilhas no Excel, caderninho, WhatsApp como CRM… isso não é gestão. É sobrevivência.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAINS.map((pain, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <span className="text-2xl shrink-0">{pain.emoji}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{pain.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GAINS */}
      <section id="recursos" className="py-24 px-6" style={{ background: 'rgba(13,13,43,0.4)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
              ✅ O que você vai ganhar
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Com o sistema, você assume o
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #34d399, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>controle total do negócio</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAINS.map((g, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="flex items-start gap-4 p-6 rounded-2xl transition-transform hover:-translate-y-1"
                style={{ background: 'rgba(13,13,43,0.9)', border: `1px solid ${g.color}20`, boxShadow: `0 4px 24px rgba(0,0,0,0.3)` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${g.color}15`, border: `1px solid ${g.color}25` }}>
                  <g.icon className="w-5 h-5" style={{ color: g.color }} />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{g.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP MODULES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <LayoutDashboard className="w-3.5 h-3.5" /> Sistema Completo
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              8 módulos integrados,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>tudo no mesmo lugar</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Chega de usar 5 ferramentas diferentes. Um sistema completo, integrado e feito para o mercado imobiliário.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ERP_MODULES.map((mod, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)}
                className="p-5 rounded-2xl text-left group transition-all hover:-translate-y-1.5 cursor-default"
                style={{
                  background: 'rgba(13,13,43,0.9)',
                  border: `1px solid ${mod.color}20`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${mod.color}15`, border: `1px solid ${mod.color}25` }}>
                  <mod.icon className="w-5 h-5" style={{ color: mod.color }} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{mod.label}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{mod.desc}</div>
              </motion.div>
            ))}
          </div>


        </div>
      </section>

      {/* DRONE SECTION */}
      <section id="drone" className="relative py-32 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1920&q=80"
            alt="Vista aérea de imóvel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(3,3,17,0.92) 0%, rgba(3,3,17,0.75) 50%, rgba(3,3,17,0.92) 100%)' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <motion.div {...fadeUp()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                <Video className="w-3.5 h-3.5" /> Serviço Adicional
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Seus imóveis vistos
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>de cima 🚁</span>
              </motion.h2>
              <motion.p {...fadeUp(0.2)} className="text-slate-300 text-lg mb-8 leading-relaxed">
                Imagens e vídeos aéreos com drone profissional para imobiliárias. Transforme qualquer imóvel em um anúncio de impacto que vende mais rápido.
              </motion.p>
              <motion.div {...fadeUp(0.25)} className="space-y-3 mb-10">
                {DRONE_BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#fbbf24' }} />
                    {b}
                  </div>
                ))}
              </motion.div>
              <motion.div {...fadeUp(0.3)} className="flex items-center gap-2 p-4 rounded-2xl"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <Star className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-sm text-amber-200">
                  <strong>Preço sob medida</strong> — varia conforme localização e distância. Solicite um orçamento personalizado.
                </p>
              </motion.div>
            </div>

            {/* Fake video thumbnail grid */}
            <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-3">
              {[
                'photo-1559554498-34b4740d41c2',
                'photo-1544984243-ec57ea16fe25',
                'photo-1491466424936-e304919aada7',
                'photo-1563911302283-d2bc129e7570',
              ].map((id, i) => (
                <div key={id} className="relative rounded-2xl overflow-hidden aspect-square group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://images.unsplash.com/${id}?w=400&q=80`}
                    alt="Vista aérea"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                  {i === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(251,191,36,0.9)', backdropFilter: 'blur(4px)' }}>
                        <Play className="w-6 h-6 text-black ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] px-2 py-1 rounded-full font-semibold text-white"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                      🚁 {i === 0 ? 'Vídeo' : 'Foto'} Drone
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROPERTIES GALLERY */}
      <section className="py-12 px-6">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <p className="text-slate-400 text-sm">Imóveis que ganham mais destaque com tecnologia e qualidade visual</p>
        </motion.div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PROPERTY_IDS.map((id, i) => (
            <motion.div key={id} {...fadeUp(i * 0.05)} className="relative rounded-2xl overflow-hidden aspect-square group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/${id}?w=400&q=80`}
                alt="Imóvel de luxo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(to top, rgba(59,130,246,0.6), transparent)' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* WEBSITE SECTION */}
      <section id="sites" className="py-24 px-6" style={{ background: 'rgba(13,13,43,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Screenshot comparison */}
            <motion.div {...fadeUp()} className="relative">
              {/* "Before" */}
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 30px rgba(239,68,68,0.1)' }}>
                <div className="px-3 py-2 flex items-center gap-2"
                  style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-[10px] text-slate-500 truncate">jorgeimob.com.br</div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/site-antigo.png"
                  alt="Site atual do Jorge Sousa Imóveis"
                  className="w-full object-cover object-top"
                />
              </div>

              {/* Arrow */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <div>
              <motion.div {...fadeUp()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>
                <Globe className="w-3.5 h-3.5" /> Modernização de Sites
              </motion.div>
              <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Seu site pode ser um{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #60a5fa, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>diferencial de mercado</span>
              </motion.h2>
              <motion.p {...fadeUp(0.2)} className="text-slate-300 text-lg mb-8 leading-relaxed">
                Posso transformar o seu site atual em um portal moderno, rápido, responsivo e visualmente impactante — que converte visitantes em clientes reais.
              </motion.p>
              <motion.div {...fadeUp(0.25)} className="space-y-3 mb-8">
                {[
                  { icon: Zap, text: 'Design moderno, tecnológico e futurístico', color: '#3b82f6' },
                  { icon: Globe, text: 'Mobile-first e 100% responsivo', color: '#8b5cf6' },
                  { icon: TrendingUp, text: 'Otimizado para SEO (aparecer no Google)', color: '#10b981' },
                  { icon: BarChart3, text: 'Integração com portais e redes sociais', color: '#f59e0b' },
                  { icon: Shield, text: 'Hospedagem profissional e segura', color: '#ec4899' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                    {item.text}
                  </div>
                ))}
              </motion.div>
              <motion.div {...fadeUp(0.3)} className="p-4 rounded-2xl"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)' }}>
                <p className="text-sm text-blue-200">
                  💡 <strong>Orçamento personalizado</strong> — entre em contato para discutirmos o melhor plano para o seu site.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              💰 Investimento
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Preço justo para um serviço
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>de alto nível</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sistema ERP */}
            <motion.div {...fadeUp(0.1)} className="relative rounded-3xl p-8 flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(29,78,216,0.15), rgba(124,58,237,0.15))',
                border: '2px solid rgba(124,58,237,0.5)',
                boxShadow: '0 0 50px rgba(124,58,237,0.2)',
              }}>
              {/* Most popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>
                  ⭐ Mais Completo
                </span>
              </div>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
                  <LayoutDashboard className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Sistema ERP</h3>
                <p className="text-sm text-slate-400">Gestão completa da sua imobiliária com 8 módulos integrados</p>
              </div>
              <div className="mb-6">
                <div className="text-5xl font-black text-white mb-1">
                  R$ <span className="text-violet-400">2.000</span>
                </div>
                <div className="text-sm text-slate-400">valor único de implantação</div>
                <div className="mt-3 p-3 rounded-xl"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <div className="text-xl font-bold text-violet-300">+ R$ 250<span className="text-sm font-normal text-slate-400">/mês</span></div>
                  <div className="text-xs text-slate-500 mt-0.5">manutenção, suporte e melhorias contínuas</div>
                </div>
              </div>
              <div className="space-y-2.5 mb-8 flex-1">
                {['8 módulos completos', 'Personalizado com seus dados', 'Suporte mensal incluso', 'Atualizações e melhorias', 'Acesso de múltiplos usuários', 'Dashboard com métricas reais'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 shrink-0 text-violet-400" /> {f}
                  </div>
                ))}
              </div>

            </motion.div>

            {/* Drone */}
            <motion.div {...fadeUp(0.2)} className="rounded-3xl p-8 flex flex-col"
              style={{ background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(251,191,36,0.25)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
                  <Video className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Drone & Vídeos</h3>
                <p className="text-sm text-slate-400">Imagens e vídeos aéreos profissionais para seus imóveis</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-black text-amber-400 mb-1">Sob Consulta</div>
                <div className="text-sm text-slate-400">conforme localização e distância</div>
              </div>
              <div className="space-y-2.5 mb-8 flex-1">
                {['Vídeos aéreos em 4K', 'Fotos com drone profissional', 'Edição e tratamento incluso', 'Entrega rápida', 'Para portais e redes sociais', 'Destaque nos anúncios'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 shrink-0 text-amber-400" /> {f}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Site */}
            <motion.div {...fadeUp(0.3)} className="rounded-3xl p-8 flex flex-col"
              style={{ background: 'rgba(13,13,43,0.9)', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Site Moderno</h3>
                <p className="text-sm text-slate-400">Seu portal imobiliário reinventado com tecnologia de ponta</p>
              </div>
              <div className="mb-6">
                <div className="text-3xl font-black text-blue-400 mb-1">Sob Consulta</div>
                <div className="text-sm text-slate-400">conforme escopo e funcionalidades</div>
              </div>
              <div className="space-y-2.5 mb-8 flex-1">
                {['Design moderno e futurístico', 'Mobile-first responsivo', 'SEO otimizado', 'Rápido e seguro', 'Integração com redes sociais', 'Painel administrativo'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 shrink-0 text-blue-400" /> {f}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEMO CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Mansão luxuosa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(3,3,17,0.92), rgba(29,78,216,0.5), rgba(3,3,17,0.92))' }} />
        </div>
        <div className="absolute inset-0 z-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
            🎯 Modelo demonstrativo — Sem compromisso
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Conheça o sistema.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Veja tudo funcionando.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-xl text-slate-300 mb-10 leading-relaxed">
            Preparamos um sistema completo — com dados reais simulados — para que você explore cada módulo e entenda o nível do que será entregue para você.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login"
              className="group flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', boxShadow: '0 0 60px rgba(124,58,237,0.5)' }}>
              <Play className="w-6 h-6" />
              Acessar o Demo Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="text-sm text-slate-400">
              Login: <code className="text-slate-300 bg-white/5 px-2 py-1 rounded-lg">jorge / jorge123</code>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ background: '#02020f', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)' }}>JS</div>
                <div>
                  <div className="text-sm font-bold text-white">Jorge Sousa</div>
                  <div className="text-[10px] text-slate-500">Sistemas Imobiliários</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Soluções tecnológicas para corretores e imobiliárias que querem crescer com organização, dados e qualidade.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Serviços</h4>
              <div className="space-y-2">
                {['Sistema ERP Imobiliário', 'Vídeos com Drone', 'Sites Modernos', 'Suporte e Manutenção'].map(s => (
                  <div key={s} className="text-sm text-slate-500 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-slate-600" /> {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contato</h4>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div>
                  <div className="text-sm font-semibold text-slate-300">(19) 97172-1217</div>
                  <div className="text-xs text-slate-500">Entre em contato pelo WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 text-center" style={{ borderTop: '1px solid rgba(59,130,246,0.06)' }}>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} Jorge Sousa Sistemas Imobiliários · Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

