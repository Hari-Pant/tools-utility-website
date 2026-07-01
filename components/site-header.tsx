"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"
import { Menu } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">DevTools</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
