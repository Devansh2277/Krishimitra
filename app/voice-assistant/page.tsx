"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Mic, MicOff, Volume2, VolumeX, ArrowLeft, Sun, Moon, MessageSquare, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

interface VoiceMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  language: string
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState("en")
  const [messages, setMessages] = useState<VoiceMessage[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = sessionStorage.getItem("isLoggedIn")
      const savedLanguage = sessionStorage.getItem("language")

      console.log(
        " Checking authentication - loggedIn:",
        loggedIn,
        "phoneNumber:",
        sessionStorage.getItem("phoneNumber"),
      )

      if (loggedIn === "true") {
        setIsAuthenticated(true)
        if (savedLanguage) {
          setLanguage(savedLanguage)
        }
        console.log(" User authenticated successfully")
      } else {
        console.log(" Voice assistant not authenticated, redirecting")
        window.location.href = "/"
        return
      }

      setIsLoading(false)
    }

    setTimeout(checkAuth, 100)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const translations = {
    en: {
      title: "Voice Assistant",
      subtitle: "Ask me anything about farming, crops, weather, or agricultural practices",
      startListening: "Start Listening",
      stopListening: "Stop Listening",
      processing: "Processing...",
      listening: "Listening...",
      speaking: "Speaking...",
      backToDashboard: "Back to Dashboard",
      clearChat: "Clear Chat",
      noSpeechSupport: "Speech recognition not supported in this browser. Please use Chrome or Edge.",
      micPermissionDenied: "Microphone access denied. Please allow microphone access and try again.",
      noSpeechDetected: "No speech detected. Please try again.",
      voiceError: "Voice recognition error. Please try again.",
      welcomeMessage:
        "Hello! I'm your agricultural assistant. You can ask me about crops, farming techniques, weather, pest control, or any farming-related questions. How can I help you today?",
    },
    hi: {
      title: "आवाज सहायक",
      subtitle: "खेती, फसलों, मौसम, या कृषि प्रथाओं के बारे में मुझसे कुछ भी पूछें",
      startListening: "सुनना शुरू करें",
      stopListening: "सुनना बंद करें",
      processing: "प्रसंस्करण...",
      listening: "सुन रहे हैं...",
      speaking: "बोल रहे हैं...",
      backToDashboard: "डैशबोर्ड पर वापस",
      clearChat: "चैट साफ़ करें",
      noSpeechSupport: "इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया Chrome या Edge का उपयोग करें।",
      micPermissionDenied: "माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन एक्सेस की अनुमति दें और पुनः प्रयास करें।",
      noSpeechDetected: "कोई आवाज़ नहीं मिली। कृपया पुनः प्रयास करें।",
      voiceError: "आवाज़ पहचान त्रुटि। कृपया पुनः प्रयास करें।",
      welcomeMessage:
        "नमस्ते! मैं आपका कृषि सहायक हूं। आप मुझसे फसलों, खेती की तकनीकों, मौसम, कीट नियंत्रण, या किसी भी खेती से संबंधित प्रश्न पूछ सकते हैं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    },
    pa: {
      title: "ਆਵਾਜ਼ ਸਹਾਇਕ",
      subtitle: "ਖੇਤੀਬਾੜੀ, ਫਸਲਾਂ, ਮੌਸਮ, ਜਾਂ ਖੇਤੀਬਾੜੀ ਅਭਿਆਸਾਂ ਬਾਰੇ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ",
      startListening: "ਸੁਣਨਾ ਸ਼ੁਰੂ ਕਰੋ",
      stopListening: "ਸੁਣਨਾ ਬੰਦ ਕਰੋ",
      processing: "ਪ੍ਰਕਿਰਿਆ...",
      listening: "ਸੁਣ ਰਹੇ ਹਾਂ...",
      speaking: "ਬੋਲ ਰਹੇ ਹਾਂ...",
      backToDashboard: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਵਾਪਸ",
      clearChat: "ਚੈਟ ਸਾਫ਼ ਕਰੋ",
      noSpeechSupport: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਆਵਾਜ਼ ਪਛਾਣ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ Chrome ਜਾਂ Edge ਦੀ ਵਰਤੋਂ ਕਰੋ।",
      micPermissionDenied: "ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਇਨਕਾਰ। ਕਿਰਪਾ ਕਰਕੇ ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      noSpeechDetected: "ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      voiceError: "ਆਵਾਜ਼ ਪਛਾਣ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      welcomeMessage:
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫਸਲਾਂ, ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ, ਮੌਸਮ, ਕੀਟ ਨਿਯੰਤਰਣ, ਜਾਂ ਕਿਸੇ ਵੀ ਖੇਤੀਬਾੜੀ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: VoiceMessage = {
        id: Date.now().toString(),
        text: t.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        language: language,
      }
      setMessages([welcomeMessage])

      // Speak welcome message
      setTimeout(() => {
        speakText(t.welcomeMessage)
      }, 1000)
    }
  }, [isAuthenticated, language, t.welcomeMessage])

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert(t.noSpeechSupport)
      return
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log(" Microphone permission granted")

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition

        recognition.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN"
        recognition.continuous = false
        recognition.interimResults = true
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log(" Voice recognition started")
          setIsListening(true)
          setCurrentTranscript("")
        }

        recognition.onresult = (event: any) => {
          let transcript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setCurrentTranscript(transcript)

          if (event.results[event.results.length - 1].isFinal) {
            console.log(" Voice input received:", transcript)
            handleVoiceInput(transcript)
          }
        }

        recognition.onerror = (event: any) => {
          console.log(" Voice recognition error:", event.error)
          setIsListening(false)
          setCurrentTranscript("")

          let errorMessage = ""
          switch (event.error) {
            case "not-allowed":
              errorMessage = t.micPermissionDenied
              break
            case "no-speech":
              errorMessage = t.noSpeechDetected
              break
            case "aborted":
              errorMessage = t.voiceError
              break
            default:
              errorMessage = t.voiceError
          }
          alert(errorMessage)
        }

        recognition.onend = () => {
          console.log(" Voice recognition ended")
          setIsListening(false)
          setCurrentTranscript("")
        }

        recognition.start()
      })
      .catch((error) => {
        console.log(" Microphone permission error:", error)
        alert(t.micPermissionDenied)
      })
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setCurrentTranscript("")
  }

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return

    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: transcript,
      isUser: true,
      timestamp: new Date(),
      language: language,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate AI response based on the input
    const aiResponse = generateAIResponse(transcript, language)

    const aiMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date(),
      language: language,
    }

    setMessages((prev) => [...prev, aiMessage])
    setIsProcessing(false)

    // Speak the AI response
    setTimeout(() => {
      speakText(aiResponse)
    }, 500)
  }

  const generateAIResponse = (input: string, lang: string): string => {
    const lowerInput = input.toLowerCase()

    // Crop-related responses
    if (lowerInput.includes("wheat") || lowerInput.includes("गेहूं") || lowerInput.includes("ਕਣਕ")) {
      return lang === "en"
        ? "For wheat cultivation, plant in November-December. Use certified seeds, ensure proper drainage, and apply DAP fertilizer at sowing. Monitor for rust diseases and aphids. Harvest when grains are golden yellow."
        : lang === "hi"
          ? "गेहूं की खेती के लिए, नवंबर-दिसंबर में बुआई करें। प्रमाणित बीज का उपयोग करें, उचित जल निकासी सुनिश्चित करें, और बुआई के समय DAP उर्वरक डालें। रस्ट रोग और माहू के लिए निगरानी करें।"
          : "ਕਣਕ ਦੀ ਖੇਤੀ ਲਈ, ਨਵੰਬਰ-ਦਸੰਬਰ ਵਿੱਚ ਬੀਜਾਈ ਕਰੋ। ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਵਰਤੋ, ਸਹੀ ਪਾਣੀ ਨਿਕਾਸ ਯਕੀਨੀ ਬਣਾਓ, ਅਤੇ ਬੀਜਾਈ ਸਮੇਂ DAP ਖਾਦ ਪਾਓ।"
    }

    if (lowerInput.includes("rice") || lowerInput.includes("चावल") || lowerInput.includes("ਚਾਵਲ")) {
      return lang === "en"
        ? "Rice should be transplanted in June-July. Maintain 2-3 cm water level in fields. Use NPK fertilizer and zinc sulphate. Watch for brown plant hopper and stem borer. Harvest when 80% grains are golden."
        : lang === "hi"
          ? "चावल की रोपाई जून-जुलाई में करनी चाहिए। खेतों में 2-3 सेमी पानी का स्तर बनाए रखें। NPK उर्वरक और जिंक सल्फेट का उपयोग करें। भूरे पौधे फुदके और तना छेदक के लिए देखें।"
          : "ਚਾਵਲ ਦੀ ਰੋਪਾਈ ਜੂਨ-ਜੁਲਾਈ ਵਿੱਚ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ। ਖੇਤਾਂ ਵਿੱਚ 2-3 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਦਾ ਪੱਧਰ ਬਣਾਈ ਰੱਖੋ। NPK ਖਾਦ ਅਤੇ ਜ਼ਿੰਕ ਸਲਫੇਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।"
    }

    // Weather-related responses
    if (lowerInput.includes("weather") || lowerInput.includes("मौसम") || lowerInput.includes("ਮੌਸਮ")) {
      return lang === "en"
        ? "Current weather conditions show moderate temperature and humidity. For farming, monitor rainfall patterns and plan irrigation accordingly. Avoid spraying during windy conditions and high humidity."
        : lang === "hi"
          ? "वर्तमान मौसम की स्थिति मध्यम तापमान और आर्द्रता दिखाती है। खेती के लिए, वर्षा के पैटर्न की निगरानी करें और तदनुसार सिंचाई की योजना बनाएं।"
          : "ਮੌਜੂਦਾ ਮੌਸਮ ਦੀ ਸਥਿਤੀ ਮੱਧਮ ਤਾਪਮਾਨ ਅਤੇ ਨਮੀ ਦਿਖਾਉਂਦੀ ਹੈ। ਖੇਤੀ ਲਈ, ਬਰਸਾਤ ਦੇ ਪੈਟਰਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।"
    }

    // Pest control responses
    if (lowerInput.includes("pest") || lowerInput.includes("कीट") || lowerInput.includes("ਕੀਟ")) {
      return lang === "en"
        ? "For pest control, use integrated pest management. Monitor crops regularly, use pheromone traps, apply neem-based pesticides, and maintain field hygiene. Consult local agricultural extension officer for specific pest problems."
        : lang === "hi"
          ? "कीट नियंत्रण के लिए, एकीकृत कीट प्रबंधन का उपयोग करें। फसलों की नियमित निगरानी करें, फेरोमोन ट्रैप का उपयोग करें, नीम आधारित कीटनाशकों का प्रयोग करें।"
          : "ਕੀਟ ਨਿਯੰਤਰਣ ਲਈ, ਏਕੀਕ੍ਰਿਤ ਕੀਟ ਪ੍ਰਬੰਧਨ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਫਸਲਾਂ ਦੀ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ ਕਰੋ, ਫੇਰੋਮੋਨ ਟ੍ਰੈਪ ਵਰਤੋ।"
    }

    // Fertilizer responses
    if (lowerInput.includes("fertilizer") || lowerInput.includes("उर्वरक") || lowerInput.includes("ਖਾਦ")) {
      return lang === "en"
        ? "Use balanced fertilizers based on soil testing. Apply organic manure like FYM or compost. For chemical fertilizers, use NPK in recommended ratios. Apply micronutrients like zinc and boron as needed."
        : lang === "hi"
          ? "मिट्टी परीक्षण के आधार पर संतुलित उर्वरकों का उपयोग करें। FYM या कंपोस्ट जैसी जैविक खाद डालें। रासायनिक उर्वरकों के लिए, अनुशंसित अनुपात में NPK का उपयोग करें।"
          : "ਮਿੱਟੀ ਦੀ ਜਾਂਚ ਦੇ ਆਧਾਰ 'ਤੇ ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ। FYM ਜਾਂ ਕੰਪੋਸਟ ਵਰਗੀ ਜੈਵਿਕ ਖਾਦ ਪਾਓ।"
    }

    // Default response
    return lang === "en"
      ? "I understand your question about farming. For specific agricultural advice, I recommend consulting with local agricultural extension officers or visiting your nearest Krishi Vigyan Kendra. They can provide detailed guidance based on your local conditions."
      : lang === "hi"
        ? "मैं खेती के बारे में आपके प्रश्न को समझता हूं। विशिष्ट कृषि सलाह के लिए, मैं स्थानीय कृषि विस्तार अधिकारियों से सलाह लेने या अपने निकटतम कृषि विज्ञान केंद्र जाने की सिफारिश करता हूं।"
        : "ਮੈਂ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲ ਨੂੰ ਸਮਝਦਾ ਹਾਂ। ਖਾਸ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ, ਮੈਂ ਸਥਾਨਕ ਖੇਤੀਬਾੜੀ ਵਿਸਤਾਰ ਅਧਿਕਾਰੀਆਂ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦਾ ਹਾਂ।"
  }

  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN"
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsSpeaking(true)
        console.log(" Speech synthesis started")
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        console.log(" Speech synthesis ended")
      }

      utterance.onerror = (event) => {
        setIsSpeaking(false)
        console.log(" Speech synthesis error:", event.error)
      }

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    // Re-add welcome message
    const welcomeMessage: VoiceMessage = {
      id: Date.now().toString(),
      text: t.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      language: language,
    }
    setMessages([welcomeMessage])
  }

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
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToDashboard}
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-bold">{t.title}</h1>
                <p className="text-xs opacity-90">KRISHIMITRA</p>
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

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Title Section */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-primary mb-2">{t.title}</h2>
          <p className="text-muted-foreground text-pretty leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Voice Controls */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Mic className="h-5 w-5" />
              Voice Controls
            </CardTitle>
            <CardDescription>
              {isListening && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Mic className="h-3 w-3 mr-1 animate-pulse" />
                  {t.listening}
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                  {t.speaking}
                </Badge>
              )}
              {isProcessing && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {t.processing}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 justify-center">
              {!isListening ? (
                <Button
                  onClick={startListening}
                  size="lg"
                  className="h-16 px-8 text-base font-semibold"
                  disabled={isProcessing || isSpeaking}
                >
                  <Mic className="h-6 w-6 mr-2" />
                  {t.startListening}
                </Button>
              ) : (
                <Button
                  onClick={stopListening}
                  variant="destructive"
                  size="lg"
                  className="h-16 px-8 text-base font-semibold"
                >
                  <MicOff className="h-6 w-6 mr-2" />
                  {t.stopListening}
                </Button>
              )}

              {isSpeaking ? (
                <Button
                  onClick={stopSpeaking}
                  variant="outline"
                  size="lg"
                  className="h-16 px-8 text-base font-semibold bg-transparent"
                >
                  <VolumeX className="h-6 w-6 mr-2" />
                  Stop Speaking
                </Button>
              ) : (
                <Button
                  onClick={clearChat}
                  variant="outline"
                  size="lg"
                  className="h-16 px-8 text-base font-semibold bg-transparent"
                  disabled={isListening || isProcessing}
                >
                  <MessageSquare className="h-6 w-6 mr-2" />
                  {t.clearChat}
                </Button>
              )}
            </div>

            {currentTranscript && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current input:</p>
                <p className="font-medium">{currentTranscript}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MessageSquare className="h-5 w-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">{t.processing}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">How to Use Voice Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <p>• Click "Start Listening" and speak your question clearly</p>
              <p>• Ask about crops, farming techniques, weather, pest control, fertilizers</p>
              <p>• The assistant will respond with voice and text</p>
              <p>• Use your preferred language (English, Hindi, Punjabi)</p>
              <p>• Allow microphone access when prompted</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
