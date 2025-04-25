"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [isValidHex, setIsValidHex] = useState(true)
  const { toast } = useToast()

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace(/^#/, "")

    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    const bigint = Number.parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return { r, g, b }
  }

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setHex(value)

    // Validate hex
    const isValid = /^#?([0-9A-F]{3}){1,2}$/i.test(value)
    setIsValidHex(isValid)

    if (isValid) {
      const formattedHex = value.startsWith("#") ? value : `#${value}`
      setHex(formattedHex)
      const newRgb = hexToRgb(formattedHex)
      setRgb(newRgb)
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
    }
  }

  // Handle RGB input changes
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const clampedValue = Math.max(0, Math.min(255, numValue))

    const newRgb = { ...rgb, [component]: clampedValue }
    setRgb(newRgb)

    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(newHex)
    setIsValidHex(true)

    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  // Handle HSL input changes
  const handleHslChange = (component: "h" | "s" | "l", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const max = component === "h" ? 360 : 100
    const clampedValue = Math.max(0, Math.min(max, numValue))

    const newHsl = { ...hsl, [component]: clampedValue }
    setHsl(newHsl)

    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(newRgb)

    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(newHex)
    setIsValidHex(true)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Color Converter</h1>
        <p className="text-muted-foreground mt-2">Convert between different color formats: HEX, RGB, and HSL.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Preview</CardTitle>
              <CardDescription>Visual representation of the current color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 rounded-md border" style={{ backgroundColor: isValidHex ? hex : "#ff0000" }}></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HEX Color</CardTitle>
              <CardDescription>Hexadecimal color code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="hex">HEX</Label>
                  <Input
                    id="hex"
                    value={hex}
                    onChange={handleHexChange}
                    className={`font-mono ${!isValidHex ? "border-red-500" : ""}`}
                  />
                  {!isValidHex && <p className="text-sm text-red-500">Please enter a valid HEX color</p>}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="mt-6"
                  onClick={() => copyToClipboard(hex, "HEX color")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RGB Color</CardTitle>
              <CardDescription>Red, Green, Blue values (0-255)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="r">Red (R)</Label>
                    <Input
                      id="r"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.r}
                      onChange={(e) => handleRgbChange("r", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="g">Green (G)</Label>
                    <Input
                      id="g"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.g}
                      onChange={(e) => handleRgbChange("g", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="b">Blue (B)</Label>
                    <Input
                      id="b"
                      type="number"
                      min="0"
                      max="255"
                      value={rgb.b}
                      onChange={(e) => handleRgbChange("b", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB color")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HSL Color</CardTitle>
              <CardDescription>Hue, Saturation, Lightness values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="h">Hue (H)</Label>
                    <Input
                      id="h"
                      type="number"
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={(e) => handleHslChange("h", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="s">Saturation (S)</Label>
                    <Input
                      id="s"
                      type="number"
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={(e) => handleHslChange("s", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="l">Lightness (L)</Label>
                    <Input
                      id="l"
                      type="number"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) => handleHslChange("l", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL color")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
