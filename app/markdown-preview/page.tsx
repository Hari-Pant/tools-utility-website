"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(
    "# Markdown Preview\n\nThis is a **bold text** and this is an *italic text*.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n\n```javascript\nconst greeting = 'Hello, world!';\nconsole.log(greeting);\n```\n\n## Links\n\n[Visit DevTools](https://example.com)\n\n## Tables\n\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n",
  )
  const [html, setHtml] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    convertMarkdownToHtml(markdown)
  }, [markdown])

  const convertMarkdownToHtml = (md: string) => {
    // This is a simple markdown to HTML converter
    // For a production app, you would use a library like marked or remark

    let htmlOutput = md

    // Headers
    htmlOutput = htmlOutput.replace(/^# (.*$)/gm, "<h1>$1</h1>")
    htmlOutput = htmlOutput.replace(/^## (.*$)/gm, "<h2>$1</h2>")
    htmlOutput = htmlOutput.replace(/^### (.*$)/gm, "<h3>$1</h3>")
    htmlOutput = htmlOutput.replace(/^#### (.*$)/gm, "<h4>$1</h4>")
    htmlOutput = htmlOutput.replace(/^##### (.*$)/gm, "<h5>$1</h5>")
    htmlOutput = htmlOutput.replace(/^###### (.*$)/gm, "<h6>$1</h6>")

    // Bold and Italic
    htmlOutput = htmlOutput.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    htmlOutput = htmlOutput.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Links
    htmlOutput = htmlOutput.replace(
      /\[(.*?)\]$$(.*?)$$/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // Lists
    htmlOutput = htmlOutput.replace(/^\s*-\s*(.*)/gm, "<li>$1</li>")
    htmlOutput = htmlOutput.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

    // Code blocks
    htmlOutput = htmlOutput.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    htmlOutput = htmlOutput.replace(/`(.*?)`/g, "<code>$1</code>")

    // Tables
    const tableRegex = /\|(.+)\|\n\|([-:]+\|)+\n((?:\|.+\|\n?)+)/g
    htmlOutput = htmlOutput.replace(tableRegex, (match) => {
      const lines = match.split("\n")
      let table = '<table class="border-collapse w-full"><thead><tr>'

      // Headers
      const headers = lines[0].split("|").filter((cell) => cell.trim() !== "")
      headers.forEach((header) => {
        table += `<th class="border p-2">${header.trim()}</th>`
      })

      table += "</tr></thead><tbody>"

      // Rows
      for (let i = 2; i < lines.length; i++) {
        if (lines[i].trim() === "") continue

        table += "<tr>"
        const cells = lines[i].split("|").filter((cell) => cell.trim() !== "")
        cells.forEach((cell) => {
          table += `<td class="border p-2">${cell.trim()}</td>`
        })
        table += "</tr>"
      }

      table += "</tbody></table>"
      return table
    })

    // Paragraphs
    htmlOutput = htmlOutput.replace(/^(?!<[a-z])(.*$)/gm, (match) => {
      if (match.trim() === "") return ""
      return `<p>${match}</p>`
    })

    // Line breaks
    htmlOutput = htmlOutput.replace(/\n\n/g, "<br />")

    setHtml(htmlOutput)
  }

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied to your clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadMarkdown = () => {
    const element = document.createElement("a")
    const file = new Blob([markdown], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = "document.md"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown to HTML</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    code { font-family: monospace; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
${html}
</body>
</html>`

    const element = document.createElement("a")
    const file = new Blob([fullHtml], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = "document.html"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Markdown Preview</h1>
        <p className="text-muted-foreground mt-2">Write Markdown and see the HTML preview in real-time.</p>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="md:h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Markdown</CardTitle>
              <CardDescription>Write your Markdown here</CardDescription>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(markdown, "Markdown")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Markdown
                </Button>
                <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                  <Download className="mr-2 h-4 w-4" />
                  Download .md
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-full min-h-[400px] font-mono text-sm resize-none"
                placeholder="Write your Markdown here..."
              />
            </CardContent>
          </Card>

          <Card className="md:h-[600px] flex flex-col">
            <CardHeader className="flex-none">
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your Markdown looks</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <Tabs defaultValue="preview" className="h-full flex flex-col">
                <div className="px-6">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <TabsContent value="preview" className="h-full mt-0 data-[state=active]:flex-1">
                    <div
                      className="prose dark:prose-invert max-w-none h-full overflow-auto"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </TabsContent>

                  <TabsContent value="html" className="h-full mt-0 data-[state=active]:flex-1">
                    <div className="flex gap-2 mb-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(html, "HTML")}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy HTML
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadHtml}>
                        <Download className="mr-2 h-4 w-4" />
                        Download .html
                      </Button>
                    </div>
                    <pre className="bg-muted p-4 rounded-md overflow-auto h-[calc(100%-40px)] text-xs">
                      <code>{html}</code>
                    </pre>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Markdown Cheat Sheet</CardTitle>
            <CardDescription>Quick reference for Markdown syntax</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Syntax</h3>
                <ul className="space-y-2">
                  <li>
                    <code className="bg-muted px-1 rounded"># Heading 1</code> - Heading 1
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">## Heading 2</code> - Heading 2
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">**bold**</code> - <strong>bold</strong>
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">*italic*</code> - <em>italic</em>
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">[link](url)</code> - <a href="#">link</a>
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">![alt](image.jpg)</code> - Image
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Extended Syntax</h3>
                <ul className="space-y-2">
                  <li>
                    <code className="bg-muted px-1 rounded">- item</code> - Unordered list
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">1. item</code> - Ordered list
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">`code`</code> - Inline code
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">```code block```</code> - Code block
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">| table | header |</code> - Table
                  </li>
                  <li>
                    <code className="bg-muted px-1 rounded">&gt; quote</code> - Blockquote
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
