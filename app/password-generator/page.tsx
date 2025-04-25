"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { toast } = useToast()

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    // Ensure at least one character type is selected
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let chars = ""
    if (useUppercase) chars += uppercase
    if (useLowercase) chars += lowercase
    if (useNumbers) chars += numbers
    if (useSymbols) chars += symbols

    let generatedPassword = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      generatedPassword += chars[randomIndex]
    }

    // Ensure the password contains at least one of each selected character type
    let validPassword = false
    while (!validPassword) {
      validPassword = true

      if (useUppercase && !/[A-Z]/.test(generatedPassword)) validPassword = false
      if (useLowercase && !/[a-z]/.test(generatedPassword)) validPassword = false
      if (useNumbers && !/[0-9]/.test(generatedPassword)) validPassword = false
      if (useSymbols && !/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(generatedPassword)) validPassword = false

      if (!validPassword) {
        generatedPassword = ""
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length)
          generatedPassword += chars[randomIndex]
        }
      }
    }

    setPassword(generatedPassword)
  }

  const calculatePasswordStrength = () => {
    if (!password) return 0

    let strength = 0

    // Length contribution (up to 40%)
    strength += Math.min(40, (password.length / 20) * 40)

    // Character variety contribution (up to 60%)
    if (/[A-Z]/.test(password)) strength += 15
    if (/[a-z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 15

    return Math.min(100, strength)
  }

  const getStrengthLabel = () => {
    if (passwordStrength >= 80) return "Very Strong"
    if (passwordStrength >= 60) return "Strong"
    if (passwordStrength >= 40) return "Medium"
    if (passwordStrength >= 20) return "Weak"
    return "Very Weak"
  }

  const getStrengthColor = () => {
    if (passwordStrength >= 80) return "bg-green-500"
    if (passwordStrength >= 60) return "bg-emerald-500"
    if (passwordStrength >= 40) return "bg-yellow-500"
    if (passwordStrength >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  const copyToClipboard = async () => {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: "Copied to clipboard",
        description: "Password has been copied to your clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    generatePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength())
  }, [password])

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Password Generator</h1>
        <p className="text-muted-foreground mt-2">Generate secure, random passwords with customizable options.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generated Password</CardTitle>
            <CardDescription>Your secure random password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={password} readOnly className="font-mono text-lg" type="text" />
              <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={generatePassword} title="Generate new password">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Password Strength: {getStrengthLabel()}</span>
                <span className="text-sm">{Math.round(passwordStrength)}%</span>
              </div>
              <Progress value={passwordStrength} className={getStrengthColor()} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Options</CardTitle>
            <CardDescription>Customize your password generation settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="length">Password Length: {length}</Label>
                </div>
                <Slider
                  id="length"
                  min={8}
                  max={64}
                  step={1}
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Include Uppercase Letters (A-Z)</Label>
                  <Switch id="uppercase" checked={useUppercase} onCheckedChange={setUseUppercase} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">Include Lowercase Letters (a-z)</Label>
                  <Switch id="lowercase" checked={useLowercase} onCheckedChange={setUseLowercase} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                  <Switch id="numbers" checked={useNumbers} onCheckedChange={setUseNumbers} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols">Include Symbols (!@#$%^&*)</Label>
                  <Switch id="symbols" checked={useSymbols} onCheckedChange={setUseSymbols} />
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full">
                Generate New Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
