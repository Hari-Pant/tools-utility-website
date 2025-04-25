"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Download, ArrowDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Base64Tool() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [file, setFile] = useState<File | null>(null)
  const [fileBase64, setFileBase64] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const { toast } = useToast()

  const handleEncode = () => {
    if (!inputText.trim()) {
      setOutputText("")
      return
    }

    try {
      const encoded = btoa(unescape(encodeURIComponent(inputText)))
      setOutputText(encoded)
    } catch (error) {
      toast({
        title: "Error encoding",
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
      const decoded = decodeURIComponent(escape(atob(inputText.trim())))
      setOutputText(decoded)
    } catch (error) {
      toast({
        title: "Error decoding",
        description: "There was an error decoding your text. Make sure it's valid Base64",
        variant: "destructive",
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setInputText("")
    setOutputText("")
    setFile(null)
    setFileBase64(null)
    setFileName("")
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

  const downloadAsFile = () => {
    if (!outputText) return

    const element = document.createElement("a")
    const file = new Blob([outputText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "base64-" + (activeTab === "encode" ? "encoded.txt" : "decoded.txt")
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setFileName(selectedFile.name)

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          // For file encoding, we get the base64 data after the comma
          const base64String = event.target.result.split(",")[1]
          setFileBase64(base64String)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const downloadDecodedFile = () => {
    if (!fileBase64) return

    try {
      const byteCharacters = atob(fileBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray])

      const element = document.createElement("a")
      element.href = URL.createObjectURL(blob)
      element.download = fileName || "decoded-file"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)

      toast({
        title: "File downloaded",
        description: "Your file has been downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error downloading",
        description: "There was an error downloading your file",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Base64 Encoder/Decoder</h1>
        <p className="text-muted-foreground mt-2">
          Encode text to Base64 or decode Base64 to text. You can also encode files to Base64.
        </p>
      </div>

      <Tabs defaultValue="encode" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
          <TabsTrigger value="file">File to Base64</TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          {activeTab === "file" ? (
            <Card>
              <CardHeader>
                <CardTitle>File to Base64</CardTitle>
                <CardDescription>Upload a file to convert it to Base64</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">Upload File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} />
                  </div>

                  {fileBase64 && (
                    <>
                      <div className="flex justify-center">
                        <ArrowDown className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Base64 Output</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(fileBase64)
                                toast({
                                  title: "Copied to clipboard",
                                  description: "Base64 has been copied to your clipboard",
                                })
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Base64
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md border bg-muted/50 p-4 max-h-[300px] overflow-auto">
                            <pre className="whitespace-pre-wrap break-all text-xs">{fileBase64}</pre>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{activeTab === "encode" ? "Text to Encode" : "Base64 to Decode"}</CardTitle>
                  <CardDescription>
                    {activeTab === "encode"
                      ? "Enter the text you want to encode to Base64"
                      : "Enter the Base64 string you want to decode"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={
                      activeTab === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."
                    }
                    className="min-h-[150px]"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className="mt-4">
                    <Button onClick={activeTab === "encode" ? handleEncode : handleDecode} disabled={!inputText.trim()}>
                      {activeTab === "encode" ? "Encode to Base64" : "Decode from Base64"}
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
                      <CardTitle>{activeTab === "encode" ? "Base64 Output" : "Decoded Text"}</CardTitle>
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
                      <div className="rounded-md border bg-muted/50 p-4">
                        <pre className="whitespace-pre-wrap break-all">{outputText}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}
