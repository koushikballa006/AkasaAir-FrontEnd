// File: src/app/layout.tsx
'use client'

import { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-slate-800 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">E-commerce Store</Link>
            <div className="space-x-4">
              <Link href="/" passHref legacyBehavior>
                <Button variant="link" asChild>
                  <a>Home</a>
                </Button>
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" passHref legacyBehavior>
                    <Button variant="link" asChild>
                      <a>Dashboard</a>
                    </Button>
                  </Link>
                  <Button variant="link" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/register" passHref legacyBehavior>
                    <Button variant="link" asChild>
                      <a>Register</a>
                    </Button>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Button variant="link" asChild>
                      <a>Login</a>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}