"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, Phone, CreditCard, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [farmerCardNumber, setFarmerCardNumber] = useState("")
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleLogin = async () => {
    if (!phoneNumber || !farmerCardNumber) {
      alert(
        language === "en"
          ? "Please fill in all fields"
          : language === "hi"
            ? "कृपया सभी फ़ील्ड भरें"
            : "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ",
      )
      return
    }

    setIsLoading(true)
    console.log(" Starting simple login process for:", phoneNumber)

    try {
      // Simple validation - just check if fields are filled
      if (phoneNumber.length >= 10 && farmerCardNumber.length >= 5) {
        // Store simple auth data
        sessionStorage.setItem("isLoggedIn", "true")
        sessionStorage.setItem("phoneNumber", phoneNumber)
        sessionStorage.setItem("farmerCardNumber", farmerCardNumber)
        sessionStorage.setItem("language", language)

        console.log(" Login successful, redirecting to dashboard")
        // Use window.location for reliable navigation
        window.location.href = "/dashboard"
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.log(" Login error:", error)
      setIsLoading(false)
      alert(
        language === "en"
          ? "Login failed. Please check your credentials."
          : language === "hi"
            ? "लॉगिन असफल। कृपया अपनी जानकारी जांचें।"
            : "ਲਾਗਇਨ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
      )
    }
  }

  const translations = {
    en: {
      title: "KRISHIMITRA",
      subtitle:
        "Advanced agricultural guidance, weather alerts, and community support - all in your language. Empowering farmers with technology for better harvests.",
      login: "Login",
      phoneNumber: "Phone Number",
      farmerCard: "Farmer Card Number",
      enterPhone: "Enter your phone number",
      enterCard: "Enter your farmer card number",
      loginButton: "Login to Dashboard",
      helpline: "Helpline: 1800-180-1551",
    },
    hi: {
      title: "कृषिमित्र",
      subtitle:
        "उन्नत कृषि मार्गदर्शन, मौसम चेतावनी, और सामुदायिक सहायता - सभी आपकी भाषा में। बेहतर फसल के लिए किसानों को तकनीक से सशक्त बनाना।",
      login: "लॉगिन",
      phoneNumber: "फोन नंबर",
      farmerCard: "किसान कार्ड नंबर",
      enterPhone: "अपना फोन नंबर दर्ज करें",
      enterCard: "अपना किसान कार्ड नंबर दर्ज करें",
      loginButton: "डैशबोर्ड में लॉगिन करें",
      helpline: "हेल्पलाइन: 1800-180-1551",
    },
    pa: {
      title: "ਕ੍ਰਿਸ਼ਿਮਿਤ੍ਰਾ",
      subtitle:
        "ਉੱਨਤ ਖੇਤੀਬਾੜੀ ਮਾਰਗਦਰਸ਼ਨ, ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ, ਅਤੇ ਭਾਈਚਾਰਕ ਸਹਾਇਤਾ - ਸਭ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ। ਬਿਹਤਰ ਫਸਲਾਂ ਲਈ ਕਿਸਾਨਾਂ ਨੂੰ ਤਕਨਾਲੋਜੀ ਨਾਲ ਸਸ਼ਕਤ ਬਣਾਉਣਾ।",
      login: "ਲਾਗਇਨ",
      phoneNumber: "ਫੋਨ ਨੰਬਰ",
      farmerCard: "ਕਿਸਾਨ ਕਾਰਡ ਨੰਬਰ",
      enterPhone: "ਆਪਣਾ ਫੋਨ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
      enterCard: "ਆਪਣਾ ਕਿਸਾਨ ਕਾਰਡ ਨੰਬਰ ਦਾਖਲ ਕਰੋ",
      loginButton: "ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ",
      helpline: "ਹੈਲਪਲਾਈਨ: 1800-180-1551",
    },
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              variant={language === "hi" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("hi")}
              className="text-xs"
            >
              हिं
            </Button>
            <Button
              variant={language === "pa" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("pa")}
              className="text-xs"
            >
              ਪੰ
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary p-4 rounded-full">
              <Leaf className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary text-balance">{t.title}</h1>
            <p className="text-sm text-muted-foreground mt-2 text-pretty leading-relaxed">{t.subtitle}</p>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-primary">{t.login}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Enter your credentials to access KRISHIMITRA"
                : language === "hi"
                  ? "कृषिमित्र तक पहुंचने के लिए अपनी जानकारी दर्ज करें"
                  : "ਕ੍ਰਿਸ਼ਿਮਿਤ੍ਰਾ ਤੱਕ ਪਹੁੰਚ ਲਈ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦਾਖਲ ਕਰੋ"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                {t.phoneNumber}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t.enterPhone}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card" className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                {t.farmerCard}
              </Label>
              <Input
                id="card"
                type="text"
                placeholder={t.enterCard}
                value={farmerCardNumber}
                onChange={(e) => setFarmerCardNumber(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full h-12 text-base font-semibold"
              disabled={!phoneNumber || !farmerCardNumber || isLoading}
            >
              {isLoading
                ? language === "en"
                  ? "Logging in..."
                  : language === "hi"
                    ? "लॉगिन हो रहा है..."
                    : "ਲਾਗਇਨ ਹੋ ਰਿਹਾ ਹੈ..."
                : t.loginButton}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground font-medium">{t.helpline}</p>
        </div>
      </div>
    </div>
  )
}
