'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch('https://akasaair-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('isLoggedIn', 'true')
        // Dispatch a custom event to notify other components of the login
        window.dispatchEvent(new Event('storage'))
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        router.replace('/dashboard')
      } else {
        toast({
          title: "Login failed",
          description: data.error || 'Invalid credentials',
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: 'An error occurred. Please try again.',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px] border-green-500 dark:border-green-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">FreshEats Login</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} className="border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} className="border-green-200 dark:border-green-800 focus:border-green-500 dark:focus:border-green-600" />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}