"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Code,
  FileText,
  Hash,
  Home,
  Type,
  LinkIcon as Url,
  FileCode,
  Key,
  Palette,
  FileType,
  QrCode,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const tools = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Text Case Converter",
      icon: Type,
      href: "/text-case-converter",
    },
    {
      title: "Word & Character Counter",
      icon: FileText,
      href: "/word-counter",
    },
    {
      title: "Code Formatter",
      icon: Code,
      href: "/code-formatter",
    },
    {
      title: "JSON Formatter",
      icon: Hash,
      href: "/json-formatter",
    },
    {
      title: "URL Encoder/Decoder",
      icon: Url,
      href: "/url-encoder",
    },
    {
      title: "Base64 Encoder/Decoder",
      icon: FileCode,
      href: "/base64",
    },
    {
      title: "Password Generator",
      icon: Key,
      href: "/password-generator",
    },
    {
      title: "Color Converter",
      icon: Palette,
      href: "/color-converter",
    },
    {
      title: "Markdown Preview",
      icon: FileType,
      href: "/markdown-preview",
    },
    {
      title: "QR Code Generator",
      icon: QrCode,
      href: "/qr-code-generator",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">DevTools</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {tools.map((tool) => (
            <SidebarMenuItem key={tool.title}>
              <SidebarMenuButton
                asChild
                isActive={tool.href === "/" ? pathname === "/" : pathname === tool.href}
                tooltip={tool.title}
              >
                <Link href={tool.href}>
                  <tool.icon className="h-4 w-4" />
                  <span>{tool.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} DevTools</div>
      </SidebarFooter>
    </Sidebar>
  )
}
