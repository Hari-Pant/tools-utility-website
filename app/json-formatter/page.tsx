"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Download, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [error, setError] = useState("")
  const [indentSize, setIndentSize] = useState(2)
  const { toast } = useToast()

  const formatJson = () => {
    if (!inputJson.trim()) {
      setOutputJson("")
      setError("")
      return
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(inputJson)
      // Stringify with indentation
      const formattedJson = JSON.stringify(parsedJson, null, indentSize)
      setOutputJson(formattedJson)
      setError("")
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message)
      setOutputJson("")
    }
  }

  const minifyJson = () => {
    if (!inputJson.trim()) {
      setOutputJson("")
      setError("")
      return
    }

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(inputJson)
      // Stringify without indentation
      const minifiedJson = JSON.stringify(parsedJson)
      setOutputJson(minifiedJson)
      setError("")
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message)
      setOutputJson("")
    }
  }

  const copyToClipboard = async () => {
    if (!outputJson) return

    try {
      await navigator.clipboard.writeText(outputJson)
      toast({
        title: "Copied to clipboard",
        description: "JSON has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy JSON to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = () => {
    if (!outputJson) return

    const element = document.createElement("a")
    const file = new Blob([outputJson], { type: "application/json" })
    element.href = URL.createObjectURL(file)
    element.download = "formatted.json"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground mt-2">Beautify, validate and format JSON data.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
            <CardDescription>Paste your JSON data below</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JSON here..."
              className="min-h-[200px] font-mono text-sm"
              value={inputJson}
              onChange={(e) => {
                setInputJson(e.target.value)
                setError("")
              }}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="indent-size" className="text-sm">
              Indent Size:
            </label>
            <select
              id="indent-size"
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={formatJson} disabled={!inputJson.trim()}>
              Format JSON
            </Button>
            <Button variant="outline" onClick={minifyJson} disabled={!inputJson.trim()}>
              Minify JSON
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}

        {outputJson && (
          <>
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formatted JSON</CardTitle>
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
                  <pre className="whitespace-pre font-mono text-sm">{outputJson}</pre>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
