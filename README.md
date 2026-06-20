# DevTools - Web Utilities

A collection of free, fast, and easy-to-use web development utilities to help with your daily tasks.

## Features

- Text Case Converter
- Word & Character Counter
- Code Minifier & Beautifier
- JSON Formatter & Validator
- URL Encoder/Decoder
- Base64 Encoder/Decoder
- Password Generator
- Color Converter
- Markdown Preview
- QR Code Generator

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/devtools.git
   cd devtools
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment to GitHub Pages

### Manual Deployment

1. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

2. Deploy to GitHub Pages:
   \`\`\`bash
   npm run deploy
   \`\`\`

### Automatic Deployment

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages when changes are pushed to the main branch.

## Configuration

If you're deploying to a subdirectory (e.g., username.github.io/repo-name), you need to update the `basePath` in `next.config.mjs`:

\`\`\`js
const nextConfig = {
  output: 'export',
  basePath: '/repo-name', // Replace with your repository name
  // ...other config
}
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's also update the app/layout.tsx to handle the base path correctly:

```typescriptreact file="app/layout.tsx"
[v0-no-op-code-block-prefix]import type React from "react"
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
