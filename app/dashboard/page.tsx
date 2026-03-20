"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Leaf,
  MapPin,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Camera,
  Mic,
  MessageSquare,
  Users,
  BookOpen,
  Sun,
  Moon,
  Phone,
  LogOut,
  Upload,
  ExternalLink,
  Building2,
  Banknote,
  ShoppingCart,
  FileText,
  Globe,
  CheckCircle,
  User,
  AlertTriangle,
  Sprout,
} from "lucide-react"
import { useTheme } from "next-themes"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  description: string
  location: string
}

interface FarmerProfile {
  name: string
  farmSize: string
  yearsOfFarming: string
  cropHistory: string
  location: string
  phoneNumber: string
}

interface CropAdvice {
  crop: string
  advice: string
  pesticides: string[]
  fertilizers: string[]
  season: string
}

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [profile, setProfile] = useState<FarmerProfile>({
    name: "",
    farmSize: "",
    yearsOfFarming: "",
    cropHistory: "",
    location: "",
    phoneNumber: "",
  })
  const [language, setLanguage] = useState("en")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [locationName, setLocationName] = useState("")
  const [cropAdvices, setCropAdvices] = useState<CropAdvice[]>([])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = sessionStorage.getItem("isLoggedIn")
      const phoneNumber = sessionStorage.getItem("phoneNumber")
      const savedLanguage = sessionStorage.getItem("language")

      console.log(" Checking authentication - loggedIn:", loggedIn, "phoneNumber:", phoneNumber)

      if (loggedIn === "true" && phoneNumber) {
        setIsAuthenticated(true)
        setProfile((prev) => ({ ...prev, phoneNumber }))
        if (savedLanguage) {
          setLanguage(savedLanguage)
        }
        console.log(" User authenticated successfully")
      } else {
        console.log(" User not authenticated, redirecting to login")
        window.location.href = "/"
        return
      }

      setIsLoading(false)
    }

    // Small delay to ensure sessionStorage is available
    setTimeout(checkAuth, 100)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const savedProfile = localStorage.getItem("farmerProfile")
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          setProfile(parsedProfile)
          const isComplete =
            parsedProfile.name && parsedProfile.farmSize && parsedProfile.yearsOfFarming && parsedProfile.cropHistory
          setIsProfileComplete(!!isComplete)

          if (parsedProfile.cropHistory) {
            generateCropAdvice(parsedProfile.cropHistory)
          }
        } catch (error) {
          console.log(" Error parsing saved profile:", error)
        }
      }
    }
  }, [isAuthenticated])

  const cropAdviceData: CropAdvice[] = [
    {
      crop: "Wheat",
      advice: "Plant in November-December. Ensure proper drainage and use certified seeds.",
      pesticides: ["Chlorpyrifos", "Imidacloprid", "Mancozeb"],
      fertilizers: ["DAP", "Urea", "Potash"],
      season: "Rabi",
    },
    {
      crop: "Rice",
      advice: "Transplant in June-July. Maintain 2-3 cm water level in fields.",
      pesticides: ["Carbofuran", "Fipronil", "Tricyclazole"],
      fertilizers: ["NPK", "Zinc Sulphate", "Urea"],
      season: "Kharif",
    },
    {
      crop: "Cotton",
      advice: "Sow in April-May. Monitor for bollworm and whitefly regularly.",
      pesticides: ["Acetamiprid", "Emamectin Benzoate", "Profenofos"],
      fertilizers: ["Complex fertilizer", "Boron", "Sulphur"],
      season: "Kharif",
    },
    {
      crop: "Sugarcane",
      advice: "Plant in February-March or October-November. Ensure adequate irrigation.",
      pesticides: ["Chlorpyrifos", "Carbofuran", "Imidacloprid"],
      fertilizers: ["FYM", "NPK", "Micronutrients"],
      season: "Annual",
    },
  ]

  const govPortals = [
    {
      name: "Punjab Agricultural University",
      nameHi: "पंजाब कृषि विश्वविद्यालय",
      namePa: "ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ",
      description: "Research, education and extension services",
      descriptionHi: "अनुसंधान, शिक्षा और विस्तार सेवाएं",
      descriptionPa: "ਖੋਜ, ਸਿੱਖਿਆ ਅਤੇ ਵਿਸਤਾਰ ਸੇਵਾਵਾਂ",
      url: "https://www.pau.edu",
      icon: BookOpen,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Kisan Suvidha",
      nameHi: "किसान सुविधा",
      namePa: "ਕਿਸਾਨ ਸੁਵਿਧਾ",
      description: "Government of India farmer services",
      descriptionHi: "भारत सरकार की किसान सेवाएं",
      descriptionPa: "ਭਾਰਤ ਸਰਕਾਰ ਦੀਆਂ ਕਿਸਾਨ ਸੇਵਾਵਾਂ",
      url: "https://kisansuvidha.gov.in",
      icon: Building2,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "PM-Kisan Samman Nidhi",
      nameHi: "पीएम-किसान सम्मान निधि",
      namePa: "ਪੀਐਮ-ਕਿਸਾਨ ਸਮਾਨ ਨਿਧੀ",
      description: "Direct income support to farmers",
      descriptionHi: "किसानों को प्रत्यक्ष आय सहायता",
      descriptionPa: "ਕਿਸਾਨਾਂ ਨੂੰ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ",
      url: "https://pmkisan.gov.in",
      icon: Banknote,
      color: "bg-orange-100 text-orange-700",
    },
    {
      name: "Mandi Board Punjab",
      nameHi: "मंडी बोर्ड पंजाब",
      namePa: "ਮੰਡੀ ਬੋਰਡ ਪੰਜਾਬ",
      description: "Agricultural marketing and prices",
      descriptionHi: "कृषि विपणन और मूल्य",
      descriptionPa: "ਖੇਤੀਬਾੜੀ ਮਾਰਕੀਟਿੰਗ ਅਤੇ ਕੀਮਤਾਂ",
      url: "https://punjabmandi.gov.in",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "myScheme Portal",
      nameHi: "मायस्कीम पोर्टल",
      namePa: "ਮਾਈਸਕੀਮ ਪੋਰਟਲ",
      description: "Government schemes discovery",
      descriptionHi: "सरकारी योजनाओं की खोज",
      descriptionPa: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਖੋਜ",
      url: "https://www.myscheme.gov.in",
      icon: FileText,
      color: "bg-teal-100 text-teal-700",
    },
    {
      name: "eNAM",
      nameHi: "ई-नाम",
      namePa: "ਈ-ਨਾਮ",
      description: "National Agriculture Market",
      descriptionHi: "राष्ट्रीय कृषि बाजार",
      descriptionPa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀਬਾੜੀ ਮਾਰਕੀਟ",
      url: "https://enam.gov.in",
      icon: Globe,
      color: "bg-red-100 text-red-700",
    },
  ]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })

          // Reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=demo_key`,
            )
            if (response.ok) {
              const data = await response.json()
              if (data.length > 0) {
                const locationStr = `${data[0].name}, ${data[0].state}, ${data[0].country}`
                setLocationName(locationStr)
                setProfile((prev) => ({ ...prev, location: locationStr }))
              }
            }
          } catch (error) {
            console.log(" Reverse geocoding failed, using default location")
            setLocationName("Punjab, India")
            setProfile((prev) => ({ ...prev, location: "Punjab, India" }))
          }

          fetchWeatherData(latitude, longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to default location (Punjab, India)
          setLocation({ lat: 30.7333, lon: 76.7794 })
          setLocationName("Punjab, India")
          setProfile((prev) => ({ ...prev, location: "Punjab, India" }))
          fetchWeatherData(30.7333, 76.7794)
        },
      )
    }
  }, [])

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const mockWeather: WeatherData = {
        temperature: Math.round(20 + Math.random() * 15), // Random temp between 20-35°C
        humidity: Math.round(40 + Math.random() * 40), // Random humidity 40-80%
        windSpeed: Math.round(5 + Math.random() * 15), // Random wind 5-20 km/h
        description: ["Clear Sky", "Partly Cloudy", "Overcast", "Light Rain"][Math.floor(Math.random() * 4)],
        location: locationName || "Punjab, India",
      }
      setWeather(mockWeather)
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
  }

  const generateCropAdvice = (cropHistory: string) => {
    const crops = cropHistory
      .toLowerCase()
      .split(",")
      .map((crop) => crop.trim())
    const relevantAdvice = cropAdviceData.filter((advice) =>
      crops.some((crop) => advice.crop.toLowerCase().includes(crop) || crop.includes(advice.crop.toLowerCase())),
    )
    setCropAdvices(relevantAdvice)
  }

  const handleProfileUpdate = () => {
    const isComplete = profile.name && profile.farmSize && profile.yearsOfFarming && profile.cropHistory
    setIsProfileComplete(!!isComplete)
    localStorage.setItem("farmerProfile", JSON.stringify(profile))

    if (profile.cropHistory) {
      generateCropAdvice(profile.cropHistory)
    }

    // Show success message
    alert(
      language === "en"
        ? "Profile updated successfully!"
        : language === "hi"
          ? "प्रोफाइल सफलतापूर्वक अपडेट हो गया!"
          : "ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਅਪਡੇਟ ਹੋ ਗਿਆ!",
    )
  }

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.removeItem("farmerProfile")
    console.log(" User logged out")
    window.location.href = "/"
  }

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUploadedImage(result)

          // Mock AI analysis
          setTimeout(() => {
            alert(
              language === "en"
                ? "Image analyzed! Detected: Healthy wheat crop. Recommendation: Continue current care routine."
                : language === "hi"
                  ? "छवि का विश्लेषण किया गया! पाया गया: स्वस्थ गेहूं की फसल। सिफारिश: वर्तमान देखभाल की दिनचर्या जारी रखें।"
                  : "ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਗਿਆ! ਮਿਲਿਆ: ਸਿਹਤਮੰਦ ਕਣਕ ਦੀ ਫਸਲ। ਸਿਫਾਰਸ਼: ਮੌਜੂਦਾ ਦੇਖਭਾਲ ਦੀ ਰੁਟੀਨ ਜਾਰੀ ਰੱਖੋ।",
            )
          }, 2000)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleVoiceInput = () => {
    console.log(" Opening voice assistant page")
    window.open("/voice-assistant", "_blank")
  }

  const translations = {
    en: {
      title: "KRISHIMITRA Dashboard",
      welcome: "Welcome, Farmer",
      profile: isProfileComplete ? "Updated Profile" : "Farmer Profile",
      weather: "Weather Alerts",
      cropAdvisory: "Crop Advisory",
      community: "Community",
      govPortals: "Government Portals",
      name: "Full Name",
      farmSize: "Farm Size (acres)",
      yearsOfFarming: "Years of Farming",
      cropHistory: "Crop History",
      location: "Location",
      updateProfile: "Update Profile",
      uploadImage: "Upload Crop Image",
      voiceInput: "Voice Assistant",
      chatbot: "AI Chatbot",
      temperature: "Temperature",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      logout: "Logout",
      helpline: "Helpline: 1800-180-1551",
      subtitle:
        "Advanced agricultural guidance, weather alerts, and community support - all in your language. Empowering farmers with technology for better harvests.",
      cropAdvice: "Crop Advice",
      pesticides: "Recommended Pesticides",
      fertilizers: "Recommended Fertilizers",
      season: "Season",
    },
    hi: {
      title: "कृषिमित्र डैशबोर्ड",
      welcome: "स्वागत है, किसान",
      profile: isProfileComplete ? "अपडेटेड प्रोफाइल" : "किसान प्रोफाइल",
      weather: "मौसम चेतावनी",
      cropAdvisory: "फसल सलाह",
      community: "समुदाय",
      govPortals: "सरकारी पोर्टल",
      name: "पूरा नाम",
      farmSize: "खेत का आकार (एकड़)",
      yearsOfFarming: "खेती के वर्ष",
      cropHistory: "फसल इतिहास",
      location: "स्थान",
      updateProfile: "प्रोफाइल अपडेट करें",
      uploadImage: "फसल की तस्वीर अपलोड करें",
      voiceInput: "आवाज सहायक",
      chatbot: "एआई चैटबॉट",
      temperature: "तापमान",
      humidity: "नमी",
      windSpeed: "हवा की गति",
      logout: "लॉगआउट",
      helpline: "हेल्पलाइन: 1800-180-1551",
      subtitle:
        "उन्नत कृषि मार्गदर्शन, मौसम चेतावनी, और सामुदायिक सहायता - सभी आपकी भाषा में। बेहतर फसल के लिए किसानों को तकनीक से सशक्त बनाना।",
      cropAdvice: "फसल सलाह",
      pesticides: "अनुशंसित कीटनाशक",
      fertilizers: "अनुशंसित उर्वरक",
      season: "मौसम",
    },
    pa: {
      title: "ਕ੍ਰਿਸ਼ਿਮਿਤ੍ਰਾ ਡੈਸ਼ਬੋਰਡ",
      welcome: "ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ",
      profile: isProfileComplete ? "ਅਪਡੇਟ ਕੀਤਾ ਪ੍ਰੋਫਾਈਲ" : "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
      weather: "ਮੌਸਮ ਚੇਤਾਵਨੀ",
      cropAdvisory: "ਫਸਲ ਸਲਾਹ",
      community: "ਭਾਈਚਾਰਾ",
      govPortals: "ਸਰਕਾਰੀ ਪੋਰਟਲ",
      name: "ਪੂਰਾ ਨਾਮ",
      farmSize: "ਖੇਤ ਦਾ ਆਕਾਰ (ਏਕੜ)",
      yearsOfFarming: "ਖੇਤੀ ਦੇ ਸਾਲ",
      cropHistory: "ਫਸਲ ਇਤਿਹਾਸ",
      location: "ਸਥਾਨ",
      updateProfile: "ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ",
      uploadImage: "ਫਸਲ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
      voiceInput: "ਆਵਾਜ਼ ਸਹਾਇਕ",
      chatbot: "ਏਆਈ ਚੈਟਬੋਟ",
      temperature: "ਤਾਪਮਾਨ",
      humidity: "ਨਮੀ",
      windSpeed: "ਹਵਾ ਦੀ ਗਤੀ",
      logout: "ਲਾਗਆਉਟ",
      helpline: "ਹੈਲਪਲਾਈਨ: 1800-180-1551",
      subtitle:
        "ਉੱਨਤ ਖੇਤੀਬਾੜੀ ਮਾਰਗਦਰਸ਼ਨ, ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ, ਅਤੇ ਭਾਈਚਾਰਾ ਸਹਾਇਤਾ - ਸਭ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ। ਬਿਹਤਰ ਫਸਲਾਂ ਲਈ ਕਿਸਾਨਾਂ ਨੂੰ ਤਕਨਾਲੋਜੀ ਨਾਲ ਸਸ਼ਕਤ ਬਣਾਉਣਾ।",
      cropAdvice: "ਫਸਲ ਸਲਾਹ",
      pesticides: "ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕੀਟਨਾਸ਼ਕ",
      fertilizers: "ਸਿਫਾਰਸ਼ ਕੀਤੇ ਖਾਦ",
      season: "ਮੌਸਮ",
    },
  }

  const t = translations[language as keyof typeof translations]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 mx-auto text-primary mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-primary mb-2">KRISHIMITRA</h2>
          <p className="text-muted-foreground">
            {language === "en" ? "Loading..." : language === "hi" ? "लोड हो रहा है..." : "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..."}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">KRISHIMITRA</h1>
              <p className="text-xs opacity-90">कृषिमित्र - ਕ੍ਰਿਸ਼ਿਮਿਤ੍ਰਾ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isProfileComplete && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                <User className="h-3 w-3" />
              </Badge>
            )}
            <Button
              variant={language === "en" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              variant={language === "hi" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("hi")}
              className="text-xs"
            >
              हिं
            </Button>
            <Button
              variant={language === "pa" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("pa")}
              className="text-xs"
            >
              ਪੰ
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-primary mb-2">{t.welcome}</h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => (window.location.href = "/crop-advisory")}
            className="h-20 flex-col gap-2 text-sm font-semibold"
          >
            <BookOpen className="h-6 w-6" />
            {t.cropAdvisory}
          </Button>
          <Button
            onClick={handleVoiceInput}
            variant="secondary"
            className="h-20 flex-col gap-2 text-sm font-semibold"
            data-voice-button
          >
            <Mic className="h-6 w-6" />
            {t.voiceInput}
          </Button>
          <Button
            onClick={() => (window.location.href = "/community")}
            variant="secondary"
            className="h-20 flex-col gap-2 text-sm font-semibold"
          >
            <Users className="h-6 w-6" />
            {t.community}
          </Button>
          <Button
            onClick={() => (window.location.href = "/chatbot")}
            variant="secondary"
            className="h-20 flex-col gap-2 text-sm font-semibold"
          >
            <MessageSquare className="h-6 w-6" />
            {t.chatbot}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Weather Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Cloud className="h-5 w-5" />
                {t.weather}
              </CardTitle>
              {location && (
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {locationName || weather?.location || "Punjab, India"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {weather ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Thermometer className="h-6 w-6 mx-auto text-orange-500 mb-1" />
                      <p className="text-2xl font-bold">{weather.temperature}°C</p>
                      <p className="text-xs text-muted-foreground">{t.temperature}</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                      <p className="text-2xl font-bold">{weather.humidity}%</p>
                      <p className="text-xs text-muted-foreground">{t.humidity}</p>
                    </div>
                    <div className="text-center">
                      <Wind className="h-6 w-6 mx-auto text-gray-500 mb-1" />
                      <p className="text-2xl font-bold">{weather.windSpeed}</p>
                      <p className="text-xs text-muted-foreground">{t.windSpeed}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    {weather.description}
                  </Badge>
                </div>
              ) : (
                <p className="text-muted-foreground">Loading weather data...</p>
              )}
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                {isProfileComplete && <CheckCircle className="h-5 w-5 text-green-600" />}
                {t.profile}
              </CardTitle>
              <CardDescription>
                {isProfileComplete
                  ? language === "en"
                    ? "Profile Complete"
                    : language === "hi"
                      ? "प्रोफाइल पूर्ण"
                      : "ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ"
                  : language === "en"
                    ? "Please complete your profile"
                    : language === "hi"
                      ? "कृपया अपनी प्रोफाइल पूरी करें"
                      : "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ ਕਰੋ"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder={
                      language === "en" ? "Enter your name" : language === "hi" ? "अपना नाम दर्ज करें" : "ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ"
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="farmSize">{t.farmSize}</Label>
                  <Input
                    id="farmSize"
                    value={profile.farmSize}
                    onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                    placeholder="e.g., 5 acres"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="years">{t.yearsOfFarming}</Label>
                <Input
                  id="years"
                  value={profile.yearsOfFarming}
                  onChange={(e) => setProfile({ ...profile, yearsOfFarming: e.target.value })}
                  placeholder="e.g., 10 years"
                />
              </div>
              <div>
                <Label htmlFor="crops">{t.cropHistory}</Label>
                <Textarea
                  id="crops"
                  value={profile.cropHistory}
                  onChange={(e) => setProfile({ ...profile, cropHistory: e.target.value })}
                  placeholder="e.g., Wheat, Rice, Cotton"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="location">{t.location}</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder={locationName || "Location will be detected automatically"}
                  disabled
                />
              </div>
              <Button onClick={handleProfileUpdate} className="w-full">
                {t.updateProfile}
              </Button>
            </CardContent>
          </Card>
        </div>

        {cropAdvices.length > 0 && (
          <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Sprout className="h-5 w-5" />
                {t.cropAdvice}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "Personalized advice based on your crops"
                  : language === "hi"
                    ? "आपकी फसलों के आधार पर व्यक्तिगत सलाह"
                    : "ਤੁਹਾਡੀਆਂ ਫਸਲਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਵਿਅਕਤੀਗਤ ਸਲਾਹ"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cropAdvices.map((advice, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      {advice.crop} ({t.season}: {advice.season})
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{advice.advice}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          {t.pesticides}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {advice.pesticides.map((pesticide, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {pesticide}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Sprout className="h-3 w-3 text-green-500" />
                          {t.fertilizers}
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {advice.fertilizers.map((fertilizer, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {fertilizer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Upload Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Camera className="h-5 w-5" />
              {t.uploadImage}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Upload crop or soil images for AI-powered disease detection and analysis"
                : language === "hi"
                  ? "एआई-संचालित रोग का पता लगाने और विश्लेषण के लिए फसल या मिट्टी की तस्वीरें अपलोड करें"
                  : "ਏਆਈ-ਸੰਚਾਲਿਤ ਬਿਮਾਰੀ ਦਾ ਪਤਾ ਲਗਾਉਣ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਫਸਲ ਜਾਂ ਮਿੱਟੀ ਦੀਆਂ ਤਸਵੀਰਾਂ ਅਪਲੋਡ ਕਰੋ"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedImage && (
              <div className="mb-4">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded crop"
                  className="w-full max-w-md mx-auto rounded-lg border"
                />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {language === "en"
                    ? "Analyzing image..."
                    : language === "hi"
                      ? "छवि का विश्लेषण कर रहे हैं..."
                      : "ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਹੇ ਹਾਂ..."}
                </p>
              </div>
            )}
            <Button onClick={handleImageUpload} className="w-full h-16 text-base font-semibold">
              <Upload className="h-6 w-6 mr-2" />
              {t.uploadImage}
            </Button>
          </CardContent>
        </Card>

        {/* Government Portals Section */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5" />
              {language === "en" ? "Government Portals" : language === "hi" ? "सरकारी पोर्टल" : "ਸਰਕਾਰੀ ਪੋਰਟਲ"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Access official government services and schemes for farmers"
                : language === "hi"
                  ? "किसानों के लिए आधिकारिक सरकारी सेवाओं और योजनाओं तक पहुंच"
                  : "ਕਿਸਾਨਾਂ ਲਈ ਅਧਿਕਾਰਤ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਅਤੇ ਸਕੀਮਾਂ ਤੱਕ ਪਹੁੰਚ"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                {govPortals.map((portal, index) => {
                  const IconComponent = portal.icon
                  return (
                    <Card
                      key={index}
                      className="min-w-[280px] border-2 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => window.open(portal.url, "_blank")}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${portal.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm font-semibold leading-tight">
                              {language === "en" ? portal.name : language === "hi" ? portal.nameHi : portal.namePa}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1 leading-relaxed">
                              {language === "en"
                                ? portal.description
                                : language === "hi"
                                  ? portal.descriptionHi
                                  : portal.descriptionPa}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {language === "en" ? "Visit Portal" : language === "hi" ? "पोर्टल पर जाएं" : "ਪੋਰਟਲ 'ਤੇ ਜਾਓ"}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                {govPortals.map((_, index) => (
                  <div key={index} className="w-2 h-2 rounded-full bg-primary/30"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-6 border-t">
          <div className="flex justify-center items-center gap-2 text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            <p className="font-medium">{t.helpline}</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 KRISHIMITRA - Government of India Initiative</p>
        </footer>
      </div>
    </div>
  )
}
