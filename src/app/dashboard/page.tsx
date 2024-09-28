// File: src/app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard. Here you can view your orders and manage your account.</p>
    </div>
  )
}