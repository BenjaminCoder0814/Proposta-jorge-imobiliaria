export interface Imovel {
  id: string
  titulo: string
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'sala'
  status: 'disponivel' | 'reservado' | 'vendido' | 'alugado'
  finalidade: 'venda' | 'aluguel' | 'ambos'
  endereco: string
  bairro: string
  cidade: string
  cep: string
  condominio?: string
  area: number
  quartos: number
  banheiros: number
  garagem: number
  valor: number
  descricao: string
  fotos: string[]
  tags: string[]
  destaque: boolean
  proprietarioNome?: string
  proprietarioTelefone?: string
  proprietarioEmail?: string
  createdAt: string
  updatedAt: string
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  cpf: string
  tipo: 'comprador' | 'vendedor' | 'locatario' | 'proprietario'
  interesse: string
  observacoes: string
  createdAt: string
  updatedAt: string
}

export interface Aluguel {
  id: string
  imovelId: string
  locatarioId: string
  proprietarioId: string
  valorAluguel: number
  diaVencimento: number
  dataInicio: string
  dataFim: string
  status: 'ativo' | 'encerrado' | 'inadimplente'
  deposito: number
  indiceReajuste: 'IGPM' | 'IPCA' | 'nenhum'
  observacoes: string
  createdAt: string
  updatedAt: string
}

export interface Pagamento {
  id: string
  aluguelId: string
  competencia: string
  valor: number
  valorPago: number
  dataPagamento: string
  dataVencimento: string
  status: 'pago' | 'pendente' | 'atrasado' | 'parcial'
  observacoes: string
  createdAt: string
}

export interface Visita {
  id: string
  imovelId: string
  clienteId: string
  nomeContato: string
  telefoneContato: string
  data: string
  hora: string
  status: 'agendada' | 'realizada' | 'cancelada'
  observacoes: string
  createdAt: string
}

export interface Lead {
  id: string
  nome: string
  telefone: string
  email: string
  origem: 'whatsapp' | 'indicacao' | 'portal' | 'instagram' | 'site' | 'outro'
  tipoInteresse: 'compra' | 'aluguel' | 'ambos'
  imovelId?: string
  orcamento?: number
  etapa: 'novo' | 'contato' | 'visita' | 'proposta' | 'fechado' | 'perdido'
  observacoes: string
  createdAt: string
  updatedAt: string
}

export interface Venda {
  id: string
  imovelId: string
  compradorId: string
  vendedorNome?: string
  valorVenda: number
  comissaoPercent: number
  comissaoValor: number
  dataVenda?: string
  dataContrato?: string
  dataEscritura?: string
  status: 'em_andamento' | 'contrato_assinado' | 'escritura' | 'concluida' | 'cancelada'
  observacoes?: string
  createdAt: string
}

export interface Documento {
  id: string
  imovelId: string
  nome: string
  tipo: 'escritura' | 'iptu' | 'matricula' | 'habite_se' | 'planta' | 'outro'
  url: string
  tamanho?: string
  createdAt: string
}

export interface SistemaUser {
  id: string
  nome: string
  username: string
  password: string
  role: 'admin' | 'corretor' | 'funcionario' | 'funcionaria'
  email?: string
  telefone?: string
  ativo: boolean
  createdAt: string
}
