import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevTools - Web Utilities",
  description: "A collection of useful web development tools and utilities",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://yourusername.github.io/devtools'
  ),
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex flex-1">
                <AppSidebar />
                <main className="flex-1 p-4 md:p-6">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
