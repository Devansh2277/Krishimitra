"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bot, User, ArrowLeft, Sun, Moon, Mic, Send, Camera } from "lucide-react"
import { useTheme } from "next-themes"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  message: string
  timestamp: Date
  suggestions?: string[]
}

export default function Chatbot() {
  const [language, setLanguage] = useState("en")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      window.location.href = "/"
      return
    }

    // Initialize chat with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "bot",
      message:
        language === "en"
          ? "Hello! I'm your AI farming assistant powered by Punjab Agricultural University data. I can help you with crop recommendations, disease identification, weather advice, and farming techniques. How can I assist you today?"
          : language === "hi"
            ? "नमस्ते! मैं पंजाब कृषि विश्वविद्यालय के डेटा द्वारा संचालित आपका एआई कृषि सहायक हूं। मैं आपकी फसल की सिफारिशों, रोग की पहचान, मौसम की सलाह और कृषि तकनीकों में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?"
            : "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ ਦੇ ਡੇਟਾ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਨੂੰ ਫਸਲ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ, ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ, ਮੌਸਮ ਦੀ ਸਲਾਹ ਅਤੇ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?",
      timestamp: new Date(),
      suggestions: [
        language === "en" ? "Wheat farming tips" : language === "hi" ? "गेहूं की खेती के टिप्स" : "ਕਣਕ ਦੀ ਖੇਤੀ ਦੇ ਟਿਪਸ",
        language === "en" ? "Pest control advice" : language === "hi" ? "कीट नियंत्रण सलाह" : "ਕੀਟ ਨਿਯੰਤਰਣ ਸਲਾਹ",
        language === "en" ? "Soil health check" : language === "hi" ? "मिट्टी स्वास्थ्य जांच" : "ਮਿੱਟੀ ਸਿਹਤ ਜਾਂਚ",
        language === "en" ? "Weather forecast" : language === "hi" ? "मौसम पूर्वानुमान" : "ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ",
      ],
    }

    setMessages([welcomeMessage])
  }, [language])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: generateBotResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN"
      recognition.continuous = false
      recognition.interimResults = false

      setIsListening(true)
      recognition.start()

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
        alert("Voice recognition error. Please try again.")
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      alert("Voice recognition not supported in this browser")
    }
  }

  const handleImageUpload = () => {
    // Mock image upload for crop disease detection
    const mockAnalysis = {
      crop: "Tomato",
      issue: "Early Blight Disease",
      confidence: "87%",
      treatment: "Apply copper-based fungicide, improve air circulation, remove affected leaves",
      prevention: "Ensure proper spacing, avoid overhead watering, use disease-resistant varieties",
    }

    const botResponse: ChatMessage = {
      id: Date.now().toString(),
      type: "bot",
      message:
        language === "en"
          ? `Image Analysis Complete!\n\n🌱 Crop Detected: ${mockAnalysis.crop}\n🔍 Issue Identified: ${mockAnalysis.issue}\n📊 Confidence: ${mockAnalysis.confidence}\n\n💊 Treatment: ${mockAnalysis.treatment}\n\n🛡️ Prevention: ${mockAnalysis.prevention}`
          : language === "hi"
            ? `छवि विश्लेषण पूर्ण!\n\n🌱 फसल का पता चला: ${mockAnalysis.crop}\n🔍 समस्या की पहचान: ${mockAnalysis.issue}\n📊 विश्वास: ${mockAnalysis.confidence}\n\n💊 उपचार: ${mockAnalysis.treatment}\n\n🛡️ रोकथाम: ${mockAnalysis.prevention}`
            : `ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ!\n\n🌱 ਫਸਲ ਦਾ ਪਤਾ ਲਗਾਇਆ: ${mockAnalysis.crop}\n🔍 ਸਮੱਸਿਆ ਦੀ ਪਛਾਣ: ${mockAnalysis.issue}\n📊 ਭਰੋਸਾ: ${mockAnalysis.confidence}\n\n💊 ਇਲਾਜ: ${mockAnalysis.treatment}\n\n🛡️ ਰੋਕਥਾਮ: ${mockAnalysis.prevention}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botResponse])
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    // Wheat related queries
    if (lowerInput.includes("wheat") || lowerInput.includes("गेहूं") || lowerInput.includes("ਕਣਕ")) {
      return language === "en"
        ? "🌾 Wheat Farming Guide:\n\n• Best varieties for Punjab: HD-3086, PBW-725, DBW-187\n• Sowing time: Mid-November to early December\n• Seed rate: 100-120 kg/hectare\n• Fertilizer: 120:60:30 NPK kg/hectare\n• Irrigation: 4-5 irrigations needed\n• Harvest: April-May when grain moisture is 20-25%\n\nWould you like specific advice on any aspect?"
        : language === "hi"
          ? "🌾 गेहूं की खेती गाइड:\n\n• पंजाब के लिए सर्वोत्तम किस्में: HD-3086, PBW-725, DBW-187\n• बुआई का समय: नवंबर मध्य से दिसंबर प्रारंभ\n• बीज दर: 100-120 किलो/हेक्टेयर\n• उर्वरक: 120:60:30 NPK किलो/हेक्टेयर\n• सिंचाई: 4-5 सिंचाई आवश्यक\n• कटाई: अप्रैल-मई जब अनाज में 20-25% नमी हो\n\nक्या आप किसी विशिष्ट पहलू पर सलाह चाहते हैं?"
          : "🌾 ਕਣਕ ਦੀ ਖੇਤੀ ਗਾਈਡ:\n\n• ਪੰਜਾਬ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਕਿਸਮਾਂ: HD-3086, PBW-725, DBW-187\n• ਬੀਜਣ ਦਾ ਸਮਾਂ: ਨਵੰਬਰ ਮੱਧ ਤੋਂ ਦਸੰਬਰ ਸ਼ੁਰੂ\n• ਬੀਜ ਦਰ: 100-120 ਕਿਲੋ/ਹੈਕਟੇਅਰ\n• ਖਾਦ: 120:60:30 NPK ਕਿਲੋ/ਹੈਕਟੇਅਰ\n• ਸਿੰਚਾਈ: 4-5 ਸਿੰਚਾਈ ਲੋੜੀਂਦੀ\n• ਵਾਢੀ: ਅਪ੍ਰੈਲ-ਮਈ ਜਦੋਂ ਅਨਾਜ ਵਿੱਚ 20-25% ਨਮੀ ਹੋਵੇ\n\nਕੀ ਤੁਸੀਂ ਕਿਸੇ ਖਾਸ ਪਹਿਲੂ 'ਤੇ ਸਲਾਹ ਚਾਹੁੰਦੇ ਹੋ?"
    }

    // Disease related queries
    if (lowerInput.includes("disease") || lowerInput.includes("बीमारी") || lowerInput.includes("ਬਿਮਾਰੀ")) {
      return language === "en"
        ? "🔬 Common Crop Diseases in Punjab:\n\n• Wheat: Yellow rust, Brown rust, Loose smut\n• Rice: Blast, Bacterial blight, Sheath blight\n• Cotton: Pink bollworm, Whitefly, Leaf curl virus\n\n💡 Prevention Tips:\n• Use certified disease-free seeds\n• Follow crop rotation\n• Maintain proper plant spacing\n• Apply fungicides as preventive measure\n\nPlease specify your crop for detailed advice!"
        : language === "hi"
          ? "🔬 पंजाब में आम फसल रोग:\n\n• गेहूं: पीला रतुआ, भूरा रतुआ, लूज स्मट\n• धान: ब्लास्ट, बैक्टीरियल ब्लाइट, शीथ ब्लाइट\n• कपास: गुलाबी सुंडी, सफेद मक्खी, पत्ती मोड़ वायरस\n\n💡 रोकथाम के उपाय:\n• प्रमाणित रोग मुक्त बीज का उपयोग करें\n• फसल चक्र अपनाएं\n• उचित पौधों की दूरी बनाए रखें\n• रोकथाम के रूप में फफूंदनाशी का प्रयोग करें\n\nविस्तृत सलाह के लिए कृपया अपनी फसल बताएं!"
          : "🔬 ਪੰਜਾਬ ਵਿੱਚ ਆਮ ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ:\n\n• ਕਣਕ: ਪੀਲਾ ਰਤੁਆ, ਭੂਰਾ ਰਤੁਆ, ਲੂਜ਼ ਸਮਟ\n• ਚਾਵਲ: ਬਲਾਸਟ, ਬੈਕਟੀਰੀਅਲ ਬਲਾਈਟ, ਸ਼ੀਥ ਬਲਾਈਟ\n• ਕਪਾਹ: ਗੁਲਾਬੀ ਸੁੰਡੀ, ਚਿੱਟੀ ਮੱਖੀ, ਪੱਤਾ ਮੋੜ ਵਾਇਰਸ\n\n💡 ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ:\n• ਪ੍ਰਮਾਣਿਤ ਰੋਗ ਮੁਕਤ ਬੀਜ ਦੀ ਵਰਤੋਂ ਕਰੋ\n• ਫਸਲ ਚੱਕਰ ਅਪਣਾਓ\n• ਸਹੀ ਪੌਧਿਆਂ ਦੀ ਦੂਰੀ ਰੱਖੋ\n• ਰੋਕਥਾਮ ਵਜੋਂ ਫੰਗੀਸਾਈਡ ਲਗਾਓ\n\nਵਿਸਤ੍ਰਿਤ ਸਲਾਹ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਫਸਲ ਦੱਸੋ!"
    }

    // Weather related queries
    if (lowerInput.includes("weather") || lowerInput.includes("मौसम") || lowerInput.includes("ਮੌਸਮ")) {
      return language === "en"
        ? "🌤️ Current Weather Advisory for Punjab:\n\n• Temperature: 28°C (Moderate)\n• Humidity: 65% (Good for crops)\n• Wind Speed: 12 km/h\n• Rainfall: Light showers expected\n\n📋 Farming Recommendations:\n• Good time for transplanting rice\n• Apply nitrogen fertilizer to wheat\n• Monitor for fungal diseases due to humidity\n• Ensure proper drainage in fields\n\nStay updated with daily weather alerts!"
        : language === "hi"
          ? "🌤️ पंजाब के लिए वर्तमान मौसम सलाह:\n\n• तापमान: 28°C (मध्यम)\n• आर्द्रता: 65% (फसलों के लिए अच्छी)\n• हवा की गति: 12 किमी/घंटा\n• वर्षा: हल्की बारिश की संभावना\n\n📋 कृषि सिफारਸें:\n• धान की रोपाई के लिए अच्छा समय\n• गेहूं में नाइट्रोजन उर्वरक डालें\n• आर्द्रता के कारण फंगल रोगों की निगरानी करें\n• खेतों में उचित जल निकासी सुनिश्चित करें\n\nदैनिक मौसम अलर्ट के साथ अपडेट रहें!"
          : "🌤️ ਪੰਜਾਬ ਲਈ ਮੌਜੂਦਾ ਮੌਸਮ ਸਲਾਹ:\n\n• ਤਾਪਮਾਨ: 28°C (ਮੱਧਮ)\n• ਨਮੀ: 65% (ਫਸਲਾਂ ਲਈ ਚੰਗੀ)\n• ਹਵਾ ਦੀ ਗਤੀ: 12 ਕਿਮੀ/ਘੰਟਾ\n• ਬਰਸਾਤ: ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ\n\n📋 ਖੇਤੀਬਾੜੀ ਸਿਫਾਰਸ਼ਾਂ:\n• ਚਾਵਲ ਦੀ ਰੋਪਾਈ ਲਈ ਚੰਗਾ ਸਮਾਂ\n• ਕਣਕ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਖਾਦ ਪਾਓ\n• ਨਮੀ ਕਾਰਨ ਫੰਗਲ ਬਿਮਾਰੀਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ\n• ਖੇਤਾਂ ਵਿੱਚ ਸਹੀ ਨਿਕਾਸ ਯਕੀਨੀ ਬਣਾਓ\n\nਰੋਜ਼ਾਨਾ ਮੌਸਮ ਅਲਰਟ ਨਾਲ ਅਪਡੇਟ ਰਹੋ!"
    }

    // Default response
    return language === "en"
      ? "I understand your question about farming. I can help you with:\n\n🌾 Crop recommendations and varieties\n🔬 Disease and pest identification\n🌤️ Weather-based farming advice\n💧 Irrigation and water management\n🌱 Soil health and fertilization\n📈 Yield improvement techniques\n\nCould you please be more specific about what you'd like to know? You can also upload an image of your crop for instant analysis!"
      : language === "hi"
        ? "मैं खेती के बारे में आपके प्रश्न को समझता हूं। मैं आपकी इनमें मदद कर सकता हूं:\n\n🌾 फसल सिफारिशें और किस्में\n🔬 रोग और कीट की पहचान\n🌤️ मौसम आधारित कृषि सलाह\n💧 सिंचाई और जल प्रबंधन\n🌱 मिट्टी स्वास्थ्य और उर्वरीकरण\n📈 उत्पादन सुधार तकनीकें\n\nकृपया बताएं कि आप क्या जानना चाहते हैं? आप तुਰंत विश्लेषण के लिए अपनी फसल की तਸ्वीਰ भी अपਲੋਡ ਕਰ ਸਕते हैं!"
        : "ਮੈਂ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲ ਨੂੰ ਸਮਝਦਾ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਇਨ੍ਹਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n\n🌾 ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ ਅਤੇ ਕਿਸਮਾਂ\n🔬 ਬਿਮਾਰੀ ਅਤੇ ਕੀਟ ਦੀ ਪਛਾਣ\n🌤️ ਮੌਸਮ ਅਧਾਰਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ\n💧 ਸਿੰਚਾਈ ਅਤੇ ਪਾਣੀ ਪ੍ਰਬੰਧਨ\n🌱 ਮਿੱਟੀ ਸਿਹਤ ਅਤੇ ਖਾਦ\n📈 ਪੈਦਾਵਾਰ ਸੁਧਾਰ ਤਕਨੀਕਾਂ\n\nਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ? ਤੁਸੀਂ ਤੁਰੰਤ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਆਪਣੀ ਫਸਲ ਦੀ ਤਸਵੀਰ ਵੀ ਅਪਲੋਡ ਕਰ ਸਕਦੇ ਹੋ!"
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const translations = {
    en: {
      title: "AI Farming Assistant",
      subtitle: "Powered by Punjab Agricultural University",
      typePlaceholder: "Ask about crops, diseases, weather, or farming techniques...",
      send: "Send",
      uploadImage: "Upload Image",
      typing: "AI is typing...",
      back: "Back to Dashboard",
    },
    hi: {
      title: "एआई कृषि सहायक",
      subtitle: "पंजाब कृषि विश्वविद्यालय द्वारा संचालित",
      typePlaceholder: "फसलों, बीमारियों, मौसम या कृषि तकनीकों के बारे में पूछें...",
      send: "भेजें",
      uploadImage: "छवि अपलोड करें",
      typing: "एआई टाइप कर रहा है...",
      back: "डैशबोर्ड पर वापस",
    },
    pa: {
      title: "ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ",
      subtitle: "ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
      typePlaceholder: "ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ, ਮੌਸਮ ਜਾਂ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
      send: "ਭੇਜੋ",
      uploadImage: "ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ",
      typing: "ਏਆਈ ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ...",
      back: "ਡੈਸ਼ਬੋਰਡ ਵਾਪਸ",
    },
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              <div>
                <h1 className="text-xl font-bold">{t.title}</h1>
                <p className="text-xs opacity-90">{t.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={message.type === "user" ? "bg-primary" : "bg-secondary"}>
                    {message.type === "user" ? (
                      <User className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Bot className="h-5 w-5 text-secondary-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border text-card-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.message}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary">
                  <Bot className="h-5 w-5 text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border text-card-foreground rounded-lg p-4">
                <p className="text-sm text-muted-foreground italic">{t.typing}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t.typePlaceholder}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleVoiceInput} variant="outline" size="icon" disabled={isListening}>
                <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
              </Button>
              <Button onClick={handleImageUpload} variant="outline" size="icon">
                <Camera className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-xs text-muted-foreground">
                {language === "en"
                  ? "All advice based on Punjab Agricultural University guidelines"
                  : language === "hi"
                    ? "सभी सलाह पंजाब कृषि विश्वविद्यालय दिशानिर्देशों पर आधारित"
                    : "ਸਾਰੀ ਸਲਾਹ ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ 'ਤੇ ਅਧਾਰਤ"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
