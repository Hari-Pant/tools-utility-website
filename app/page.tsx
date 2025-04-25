import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  ArrowRight,
  Code,
  FileText,
  Hash,
  Type,
  LinkIcon as Url,
  FileCode,
  Key,
  Palette,
  FileType,
  QrCode,
} from "lucide-react"

export default function Home() {
  const tools = [
    {
      title: "Text Case Converter",
      description: "Convert text between different cases: uppercase, lowercase, title case, and more.",
      icon: <Type className="h-6 w-6" />,
      href: "/text-case-converter",
    },
    {
      title: "Word & Character Counter",
      description: "Count words, characters, and estimate reading time for any text.",
      icon: <FileText className="h-6 w-6" />,
      href: "/word-counter",
    },
    {
      title: "Code Minifier & Beautifier",
      description: "Format or minify HTML, CSS, and JavaScript code.",
      icon: <Code className="h-6 w-6" />,
      href: "/code-formatter",
    },
    {
      title: "JSON Formatter & Validator",
      description: "Beautify, validate and format JSON data.",
      icon: <Hash className="h-6 w-6" />,
      href: "/json-formatter",
    },
    {
      title: "URL Encoder/Decoder",
      description: "Encode or decode URLs and URL components.",
      icon: <Url className="h-6 w-6" />,
      href: "/url-encoder",
    },
    {
      title: "Base64 Encoder/Decoder",
      description: "Encode text to Base64 or decode Base64 to text. Also supports file encoding.",
      icon: <FileCode className="h-6 w-6" />,
      href: "/base64",
    },
    {
      title: "Password Generator",
      description: "Generate secure, random passwords with customizable options.",
      icon: <Key className="h-6 w-6" />,
      href: "/password-generator",
    },
    {
      title: "Color Converter",
      description: "Convert between different color formats: HEX, RGB, and HSL.",
      icon: <Palette className="h-6 w-6" />,
      href: "/color-converter",
    },
    {
      title: "Markdown Preview",
      description: "Write Markdown and see the HTML preview in real-time.",
      icon: <FileType className="h-6 w-6" />,
      href: "/markdown-preview",
    },
    {
      title: "QR Code Generator",
      description: "Create customizable QR codes for websites, text, contact information, and more.",
      icon: <QrCode className="h-6 w-6" />,
      href: "/qr-code-generator",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Web Developer Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          A collection of free, fast, and easy-to-use web development utilities to help with your daily tasks.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {tools.map((tool) => (
          <Card key={tool.title} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={tool.href}>
                  Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
