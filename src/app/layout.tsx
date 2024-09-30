'use client'

import { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import { useRouter } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { getCartCount } from "@/lib/api"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [cartItemCount, setCartItemCount] = useState<number>(0)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Listen for changes in login state
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token')
      setIsLoggedIn(!!newToken)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    // Fetch cart item count here when logged in
    if (isLoggedIn) {
      // Replace this with your actual cart item count fetching logic
      const fetchCartItemCount = async () => {
        const count = await fetch('https://akasaair-backend.onrender.com/api/cart', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }

        })

        console.log(count?.data.items.length, count)
        // setCartItemCount(count)
        
        setCartItemCount(count?.data.items.length) // Placeholder
      }
      fetchCartItemCount()
    } else {
      setCartItemCount(0)
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} cartItemCount={cartItemCount} />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}