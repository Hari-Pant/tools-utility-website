"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeCase, setActiveCase] = useState("")
  const { toast } = useToast()

  const convertCase = (type: string) => {
    setActiveCase(type)
    let result = ""

    switch (type) {
      case "uppercase":
        result = inputText.toUpperCase()
        break
      case "lowercase":
        result = inputText.toLowerCase()
        break
      case "titlecase":
        result = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        break
      case "sentencecase":
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
        break
      case "capitalizewords":
        result = inputText
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        break
      default:
        result = inputText
    }

    setOutputText(result)
  }

  const copyToClipboard = async () => {
    if (!outputText) return

    try {
      await navigator.clipboard.writeText(outputText)
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadAsTextFile = () => {
    if (!outputText) return

    const element = document.createElement("a")
    const file = new Blob([outputText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "converted-text.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Text Case Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert your text to different cases: UPPERCASE, lowercase, Title Case, Sentence case, and Capitalize Each
          Word.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter or paste your text below</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your text here..."
              className="min-h-[150px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-2">
          <Button variant={activeCase === "uppercase" ? "default" : "outline"} onClick={() => convertCase("uppercase")}>
            UPPERCASE
          </Button>
          <Button variant={activeCase === "lowercase" ? "default" : "outline"} onClick={() => convertCase("lowercase")}>
            lowercase
          </Button>
          <Button variant={activeCase === "titlecase" ? "default" : "outline"} onClick={() => convertCase("titlecase")}>
            Title Case
          </Button>
          <Button
            variant={activeCase === "sentencecase" ? "default" : "outline"}
            onClick={() => convertCase("sentencecase")}
          >
            Sentence case
          </Button>
          <Button
            variant={activeCase === "capitalizewords" ? "default" : "outline"}
            onClick={() => convertCase("capitalizewords")}
          >
            Capitalize Each Word
          </Button>
        </div>

        {outputText && (
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
                  <Button variant="outline" size="sm" onClick={downloadAsTextFile}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border bg-muted/50 p-4">
                  <pre className="whitespace-pre-wrap break-all">{outputText}</pre>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
