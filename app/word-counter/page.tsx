"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WordCounter() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length
    const sentences = text === "" ? 0 : (text.match(/[.!?]+/g) || []).length
    const paragraphs = text === "" ? 0 : text.split(/\n+/).filter(Boolean).length

    // Average reading speed: 200-250 words per minute
    const readingTime = Math.ceil(words / 225)

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    })
  }, [text])

  const copyToClipboard = async () => {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
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
        <h1 className="text-3xl font-bold">Word & Character Counter</h1>
        <p className="text-muted-foreground mt-2">
          Count words, characters, sentences, and estimate reading time for any text.
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
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!text}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.characters}</div>
              <p className="text-sm text-muted-foreground mt-1">{stats.charactersNoSpaces} without spaces</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Words</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.words}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Reading Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.readingTime} {stats.readingTime === 1 ? "min" : "mins"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Based on 225 words per minute</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Sentences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.sentences}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Paragraphs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.paragraphs}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
