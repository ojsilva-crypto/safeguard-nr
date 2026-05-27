import { useState, useEffect } from 'react'
import api from '../services/api'

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get(url)
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar dados'))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
