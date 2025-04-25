"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, ArrowDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function UrlEncoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const { toast } = useToast()

  const handleEncode = () => {
    if (!inputText.trim()) {
      setOutputText("")
      return
    }

    try {
      setOutputText(encodeURIComponent(inputText))
    } catch (error) {
      toast({
        title: "Error encoding URL",
        description: "There was an error encoding your text",
        variant: "destructive",
      })
    }
  }

  const handleDecode = () => {
    if (!inputText.trim()) {
      setOutputText("")
      return
    }

    try {
      setOutputText(decodeURIComponent(inputText))
    } catch (error) {
      toast({
        title: "Error decoding URL",
        description: "There was an error decoding your text. Make sure it's a valid encoded URL",
        variant: "destructive",
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setInputText("")
    setOutputText("")
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

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">URL Encoder/Decoder</h1>
        <p className="text-muted-foreground mt-2">Encode or decode URLs and URL components.</p>
      </div>

      <Tabs defaultValue="encode" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === "encode" ? "Text to Encode" : "URL to Decode"}</CardTitle>
              <CardDescription>
                {activeTab === "encode"
                  ? "Enter the text you want to URL encode"
                  : "Enter the URL-encoded text you want to decode"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={activeTab === "encode" ? "Enter text to encode..." : "Enter URL-encoded text to decode..."}
                className="min-h-[150px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-4">
                <Button onClick={activeTab === "encode" ? handleEncode : handleDecode} disabled={!inputText.trim()}>
                  {activeTab === "encode" ? "Encode" : "Decode"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {outputText && (
            <>
              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{activeTab === "encode" ? "Encoded URL" : "Decoded Text"}</CardTitle>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap break-all font-mono text-sm">{outputText}</pre>
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
