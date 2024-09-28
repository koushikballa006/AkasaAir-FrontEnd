// File: src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Our E-commerce Store</h1>
      {isLoggedIn ? (
        <div className="space-y-4">
          <Button variant="default" className="w-full" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Link href="/register" className="block">
            <Button variant="default" className="w-full">Register</Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">Login</Button>
          </Link>
        </div>
      )}
    </div>
  )
}