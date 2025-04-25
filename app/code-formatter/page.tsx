"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Download, ArrowDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function CodeFormatter() {
  const [inputCode, setInputCode] = useState("")
  const [outputCode, setOutputCode] = useState("")
  const [activeTab, setActiveTab] = useState("html")
  const [activeAction, setActiveAction] = useState<"beautify" | "minify" | null>(null)
  const { toast } = useToast()

  const beautifyHTML = (html: string) => {
    let formatted = ""
    let indent = ""

    html.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(2)
      }

      formatted += indent + "<" + element + ">\n"

      if (element.match(/^<?\w[^>]*[^/]$/) && !element.startsWith("input")) {
        indent += "  "
      }
    })

    return formatted.substring(1, formatted.length - 2)
  }

  const minifyHTML = (html: string) => {
    return html
      .replace(/\n/g, " ")
      .replace(/[\t ]+</g, "<")
      .replace(/>[\t ]+</g, "><")
      .replace(/>[\t ]+$/g, ">")
  }

  const beautifyCSS = (css: string) => {
    let formatted = ""
    let indent = ""

    // Remove existing whitespace
    css = css.replace(/\s+/g, " ").replace(/\{ /g, "{").replace(/ \}/g, "}").replace(/; /g, ";")

    // Add newlines and indentation
    css = css.replace(/{/g, " {\n").replace(/}/g, "\n}\n").replace(/;/g, ";\n")

    css.split("\n").forEach((line) => {
      if (line.includes("}")) {
        indent = indent.substring(2)
      }

      formatted += indent + line + "\n"

      if (line.includes("{")) {
        indent += "  "
      }
    })

    return formatted
  }

  const minifyCSS = (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/ *([{}:;,]) */g, "$1")
      .replace(/\s+/g, " ")
      .trim()
  }

  const beautifyJS = (js: string) => {
    let formatted = ""
    let indent = ""

    // Basic formatting for demonstration
    js = js.replace(/\{/g, " {\n").replace(/\}/g, "\n}\n").replace(/;/g, ";\n")

    js.split("\n").forEach((line) => {
      if (line.includes("}")) {
        indent = indent.substring(2)
      }

      formatted += indent + line + "\n"

      if (line.includes("{")) {
        indent += "  "
      }
    })

    return formatted
  }

  const minifyJS = (js: string) => {
    return js
      .replace(/\/\/.*$/gm, "")
      .replace(/\s+/g, " ")
      .replace(/ *([{}:;,]) */g, "$1")
      .trim()
  }

  const handleFormat = (action: "beautify" | "minify") => {
    setActiveAction(action)

    if (!inputCode.trim()) {
      setOutputCode("")
      return
    }

    try {
      let result = ""

      if (action === "beautify") {
        switch (activeTab) {
          case "html":
            result = beautifyHTML(inputCode)
            break
          case "css":
            result = beautifyCSS(inputCode)
            break
          case "javascript":
            result = beautifyJS(inputCode)
            break
        }
      } else {
        switch (activeTab) {
          case "html":
            result = minifyHTML(inputCode)
            break
          case "css":
            result = minifyCSS(inputCode)
            break
          case "javascript":
            result = minifyJS(inputCode)
            break
        }
      }

      setOutputCode(result)
    } catch (error) {
      toast({
        title: "Error formatting code",
        description: "There was an error processing your code",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async () => {
    if (!outputCode) return

    try {
      await navigator.clipboard.writeText(outputCode)
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = () => {
    if (!outputCode) return

    const element = document.createElement("a")
    const file = new Blob([outputCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)

    const extensions = {
      html: "html",
      css: "css",
      javascript: "js",
    }

    element.download = `formatted.${extensions[activeTab as keyof typeof extensions]}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Code Minifier & Beautifier</h1>
        <p className="text-muted-foreground mt-2">Format or minify HTML, CSS, and JavaScript code.</p>
      </div>

      <Tabs defaultValue="html" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Code</CardTitle>
              <CardDescription>Paste your {activeTab.toUpperCase()} code below</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={`Paste your ${activeTab.toUpperCase()} code here...`}
                className="min-h-[200px] font-mono text-sm"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={activeAction === "beautify" ? "default" : "outline"}
              onClick={() => handleFormat("beautify")}
              disabled={!inputCode.trim()}
            >
              Beautify
            </Button>
            <Button
              variant={activeAction === "minify" ? "default" : "outline"}
              onClick={() => handleFormat("minify")}
              disabled={!inputCode.trim()}
            >
              Minify
            </Button>
          </div>

          {outputCode && (
            <>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsFile}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border bg-muted/50 p-4 overflow-auto">
                    <pre className="whitespace-pre font-mono text-sm">{outputCode}</pre>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}
