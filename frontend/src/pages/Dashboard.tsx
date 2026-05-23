
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react'

interface DashboardData {
  totalClientes: number
  totalProdutos: number
  totalPedidos: number
  receitaTotal: number
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/dashboard')
        setData(response.data)
      } catch (err) {
        console.error('Erro ao carregar dashboard', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const cards = [
    {
      title: 'Clientes',
      value: data?.totalClientes ?? 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Produtos',
      value: data?.totalProdutos ?? 0,
      icon: Package,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Pedidos',
      value: data?.totalPedidos ?? 0,
      icon: ShoppingCart,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      title: 'Receita Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(data?.receitaTotal ?? 0),
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
