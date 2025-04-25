"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, Download, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { QRCodeSVG } from "qrcode.react"

type QRCodeType = "text" | "url" | "email" | "phone" | "sms" | "wifi"

interface QRCodeData {
  text: string
  email: {
    address: string
    subject: string
    body: string
  }
  phone: string
  sms: {
    number: string
    message: string
  }
  wifi: {
    ssid: string
    password: string
    encryption: "WPA" | "WEP" | "nopass"
    hidden: boolean
  }
}

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRCodeType>("text")
  const [qrData, setQrData] = useState<QRCodeData>({
    text: "",
    email: { address: "", subject: "", body: "" },
    phone: "",
    sms: { number: "", message: "" },
    wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  })
  const [qrValue, setQrValue] = useState("")
  const [qrSize, setQrSize] = useState(200)
  const [qrFgColor, setQrFgColor] = useState("#000000")
  const [qrBgColor, setQrBgColor] = useState("#ffffff")
  const [qrLevel, setQrLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const [qrIncludeMargin, setQrIncludeMargin] = useState(true)
  const qrRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Generate QR code value based on type and data
  useEffect(() => {
    let value = ""

    switch (qrType) {
      case "text":
        value = qrData.text
        break
      case "url":
        value = qrData.text.trim()
        if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
          value = "https://" + value
        }
        break
      case "email":
        value = `mailto:${qrData.email.address}`
        if (qrData.email.subject) value += `?subject=${encodeURIComponent(qrData.email.subject)}`
        if (qrData.email.body) {
          value += `${qrData.email.subject ? "&" : "?"}body=${encodeURIComponent(qrData.email.body)}`
        }
        break
      case "phone":
        value = `tel:${qrData.phone}`
        break
      case "sms":
        value = `sms:${qrData.sms.number}`
        if (qrData.sms.message) value += `?body=${encodeURIComponent(qrData.sms.message)}`
        break
      case "wifi":
        value = `WIFI:S:${qrData.wifi.ssid};T:${qrData.wifi.encryption};P:${qrData.wifi.password};H:${
          qrData.wifi.hidden ? "true" : "false"
        };;`
        break
    }

    setQrValue(value)
  }, [qrType, qrData])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQrData({ ...qrData, text: e.target.value })
  }

  const handleEmailChange = (field: keyof QRCodeData["email"], value: string) => {
    setQrData({
      ...qrData,
      email: {
        ...qrData.email,
        [field]: value,
      },
    })
  }

  const handlePhoneChange = (value: string) => {
    setQrData({ ...qrData, phone: value })
  }

  const handleSmsChange = (field: keyof QRCodeData["sms"], value: string) => {
    setQrData({
      ...qrData,
      sms: {
        ...qrData.sms,
        [field]: value,
      },
    })
  }

  const handleWifiChange = (field: keyof QRCodeData["wifi"], value: any) => {
    setQrData({
      ...qrData,
      wifi: {
        ...qrData.wifi,
        [field]: value,
      },
    })
  }

  const downloadQRCode = (format: "png" | "svg") => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector("canvas")
    const svg = qrRef.current.querySelector("svg")

    if (format === "png" && canvas) {
      const link = document.createElement("a")
      link.download = `qrcode-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } else if (format === "svg" && svg) {
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const link = document.createElement("a")
      link.download = `qrcode-${Date.now()}.svg`
      link.href = svgUrl
      link.click()

      URL.revokeObjectURL(svgUrl)
    }

    toast({
      title: "QR Code downloaded",
      description: `Your QR code has been downloaded as ${format.toUpperCase()}`,
    })
  }

  const copyQRCodeToClipboard = async () => {
    if (!qrRef.current) return

    const canvas = qrRef.current.querySelector("canvas")
    if (!canvas) return

    try {
      const dataUrl = canvas.toDataURL("image/png")
      const blob = await (await fetch(dataUrl)).blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])

      toast({
        title: "QR Code copied",
        description: "Your QR code has been copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy QR code to clipboard. Try downloading instead.",
        variant: "destructive",
      })
    }
  }

  const isValidQRCode = qrValue.trim().length > 0

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">QR Code Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create customizable QR codes for websites, text, contact information, and more.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Content</CardTitle>
              <CardDescription>Select the type of QR code you want to create</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" value={qrType} onValueChange={(value) => setQrType(value as QRCodeType)}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="wifi">WiFi</TabsTrigger>
                </TabsList>

                <div className="mt-4 space-y-4">
                  <TabsContent value="text" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="text">Text Content</Label>
                      <Input
                        id="text"
                        placeholder="Enter text to encode in QR code"
                        value={qrData.text}
                        onChange={handleTextChange}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="url">Website URL</Label>
                      <Input id="url" placeholder="example.com" value={qrData.text} onChange={handleTextChange} />
                      <p className="text-xs text-muted-foreground">
                        https:// will be added automatically if not included
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={qrData.email.address}
                        onChange={(e) => handleEmailChange("address", e.target.value)}
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input
                        id="subject"
                        placeholder="Email subject"
                        value={qrData.email.subject}
                        onChange={(e) => handleEmailChange("subject", e.target.value)}
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="body">Message (Optional)</Label>
                      <Input
                        id="body"
                        placeholder="Email body"
                        value={qrData.email.body}
                        onChange={(e) => handleEmailChange("body", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={qrData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sms" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="smsNumber">Phone Number</Label>
                      <Input
                        id="smsNumber"
                        type="tel"
                        placeholder="+1234567890"
                        value={qrData.sms.number}
                        onChange={(e) => handleSmsChange("number", e.target.value)}
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="smsMessage">Message (Optional)</Label>
                      <Input
                        id="smsMessage"
                        placeholder="SMS message"
                        value={qrData.sms.message}
                        onChange={(e) => handleSmsChange("message", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="ssid">Network Name (SSID)</Label>
                      <Input
                        id="ssid"
                        placeholder="WiFi network name"
                        value={qrData.wifi.ssid}
                        onChange={(e) => handleWifiChange("ssid", e.target.value)}
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="WiFi password"
                        value={qrData.wifi.password}
                        onChange={(e) => handleWifiChange("password", e.target.value)}
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="encryption">Encryption Type</Label>
                      <Select
                        value={qrData.wifi.encryption}
                        onValueChange={(value) => handleWifiChange("encryption", value as "WPA" | "WEP" | "nopass")}
                      >
                        <SelectTrigger id="encryption">
                          <SelectValue placeholder="Select encryption type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">No Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hidden"
                        checked={qrData.wifi.hidden}
                        onCheckedChange={(checked) => handleWifiChange("hidden", checked)}
                      />
                      <Label htmlFor="hidden">Hidden Network</Label>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Customization</CardTitle>
              <CardDescription>Customize the appearance of your QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="size">Size: {qrSize}px</Label>
                </div>
                <Slider
                  id="size"
                  min={100}
                  max={400}
                  step={10}
                  value={[qrSize]}
                  onValueChange={(value) => setQrSize(value[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fgColor">Foreground Color</Label>
                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-md border" style={{ backgroundColor: qrFgColor }}></div>
                    <Input
                      id="fgColor"
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <div className="flex gap-2">
                    <div className="h-9 w-9 rounded-md border" style={{ backgroundColor: qrBgColor }}></div>
                    <Input
                      id="bgColor"
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Error Correction</Label>
                  <Select value={qrLevel} onValueChange={(value) => setQrLevel(value as "L" | "M" | "Q" | "H")}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <Switch id="margin" checked={qrIncludeMargin} onCheckedChange={setQrIncludeMargin} />
                  <Label htmlFor="margin">Include Margin</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="md:sticky md:top-20">
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Scan with a QR code reader to test</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div
                ref={qrRef}
                className={`flex items-center justify-center rounded-lg p-4 ${!isValidQRCode ? "opacity-50" : ""}`}
                style={{ backgroundColor: qrBgColor }}
              >
                {isValidQRCode ? (
                  <QRCodeSVG
                    value={qrValue}
                    size={qrSize}
                    level={qrLevel}
                    fgColor={qrFgColor}
                    bgColor={qrBgColor}
                    includeMargin={qrIncludeMargin}
                  />
                ) : (
                  <div className="flex h-[200px] w-[200px] flex-col items-center justify-center text-center">
                    <QrCode className="mb-2 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Enter content to generate QR code</p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid w-full grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadQRCode("png")}
                  disabled={!isValidQRCode}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadQRCode("svg")}
                  disabled={!isValidQRCode}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  SVG
                </Button>
              </div>

              <div className="mt-2 grid w-full grid-cols-1 gap-2">
                <Button onClick={copyQRCodeToClipboard} disabled={!isValidQRCode} className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>

              {isValidQRCode && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>QR Code content:</p>
                  <p className="mt-1 break-all font-mono text-xs">{qrValue}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
