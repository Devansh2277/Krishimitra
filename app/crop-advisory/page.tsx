"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Camera, Mic, MessageSquare, ArrowLeft, Upload, Brain, Sun, Moon, Send, Bot, User } from "lucide-react"
import { useTheme } from "next-themes"

interface CropRecommendation {
  crop: string
  suitability: string
  reason: string
  tips: string[]
}

interface ChatMessage {
  id: string
  type: "user" | "bot"
  message: string
  timestamp: Date
}

export default function CropAdvisory() {
  const [activeTab, setActiveTab] = useState("manual")
  const [language, setLanguage] = useState("en")
  const [soilType, setSoilType] = useState("")
  const [moistureLevel, setMoistureLevel] = useState("")
  const [cropType, setCropType] = useState("")
  const [cropIssue, setCropIssue] = useState("")
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const { theme, setTheme } = useTheme()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      window.location.href = "/"
      return
    }

    // Initialize chat with welcome message
    setChatMessages([
      {
        id: "1",
        type: "bot",
        message:
          language === "en"
            ? "Hello! I'm your AI farming assistant. Ask me about crops, diseases, or farming techniques."
            : language === "hi"
              ? "नमस्ते! मैं आपका एआई कृषि सहायक हूं। मुझसे फसलों, बीमारियों या कृषि तकनीकों के बारे में पूछें।"
              : "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਨੂੰ ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ ਜਾਂ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
        timestamp: new Date(),
      },
    ])
  }, [language])

  const handleManualAnalysis = () => {
    if (!soilType || !moistureLevel) return

    // Mock AI recommendations based on soil and moisture
    const mockRecommendations: CropRecommendation[] = [
      {
        crop: "Wheat",
        suitability: "Highly Suitable",
        reason: `${soilType} soil with ${moistureLevel} moisture is ideal for wheat cultivation`,
        tips: [
          "Plant during October-November",
          "Use 100-120 kg/hectare seed rate",
          "Apply balanced NPK fertilizer",
          "Ensure proper drainage",
        ],
      },
      {
        crop: "Rice",
        suitability: moistureLevel === "high" ? "Suitable" : "Moderately Suitable",
        reason: `${soilType} soil can support rice, moisture level affects yield`,
        tips: [
          "Requires consistent water supply",
          "Plant during monsoon season",
          "Use disease-resistant varieties",
          "Monitor for pest attacks",
        ],
      },
    ]

    setRecommendations(mockRecommendations)
  }

  const handleImageUpload = () => {
    // Mock image analysis
    const mockAnalysis = {
      crop: "Tomato",
      issue: "Early Blight Disease",
      confidence: "85%",
      treatment: "Apply copper-based fungicide, improve air circulation, remove affected leaves",
    }

    alert(
      `Image Analysis Result:\nCrop: ${mockAnalysis.crop}\nIssue: ${mockAnalysis.issue}\nConfidence: ${mockAnalysis.confidence}\nTreatment: ${mockAnalysis.treatment}`,
    )
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
        setChatInput(transcript)
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

  const handleChatSend = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Mock AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: generateBotResponse(chatInput),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, botResponse])
    }, 1000)

    setChatInput("")
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("wheat") || lowerInput.includes("गेहूं") || lowerInput.includes("ਕਣਕ")) {
      return language === "en"
        ? "Wheat grows best in well-drained loamy soil with pH 6.0-7.5. Plant in October-November. Use 100-120 kg seeds per hectare. Apply NPK fertilizer as per soil test."
        : language === "hi"
          ? "गेहूं अच्छी जल निकासी वाली दोमट मिट्टी में सबसे अच्छा उगता है जिसका pH 6.0-7.5 हो। अक्टूबर-नवंबर में बुआई करें। प्रति हेक्टेयर 100-120 किलो बीज का उपयोग करें।"
          : "ਕਣਕ ਚੰਗੀ ਨਿਕਾਸ ਵਾਲੀ ਮਿੱਟੀ ਵਿੱਚ ਸਭ ਤੋਂ ਵਧੀਆ ਉਗਦੀ ਹੈ ਜਿਸਦਾ pH 6.0-7.5 ਹੋਵੇ। ਅਕਤੂਬਰ-ਨਵੰਬਰ ਵਿੱਚ ਬੀਜੋ।"
    }

    if (lowerInput.includes("disease") || lowerInput.includes("बीमारी") || lowerInput.includes("ਬਿਮਾਰੀ")) {
      return language === "en"
        ? "Common crop diseases include fungal infections, bacterial blight, and viral diseases. Prevention is key - use disease-resistant varieties, proper spacing, and avoid overwatering."
        : language === "hi"
          ? "आम फसल रोगों में फंगल संक्रमण, बैक्टीरियल ब्लाइट और वायरल रोग शामिल हैं। रोकथाम महत्वपूर्ण है - रोग प्रतिरोधी किस्मों का उपयोग करें।"
          : "ਆਮ ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਵਿੱਚ ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ, ਬੈਕਟੀਰੀਅਲ ਬਲਾਈਟ ਅਤੇ ਵਾਇਰਲ ਬਿਮਾਰੀਆਂ ਸ਼ਾਮਲ ਹਨ।"
    }

    return language === "en"
      ? "I understand your question about farming. Could you be more specific about the crop or issue you're facing? I'm here to help with crop recommendations, disease identification, and farming techniques."
      : language === "hi"
        ? "मैं खेती के बारे में आपके प्रश्न को समझता हूं। क्या आप फसल या समस्या के बारे में अधिक विशिष्ट हो सकते हैं? मैं फसल सिफारिशों, रोग पहचान और कृषि तकनीकों में मदद के लिए यहां हूं।"
        : "ਮੈਂ ਖੇਤੀਬਾੜੀ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲ ਨੂੰ ਸਮਝਦਾ ਹਾਂ। ਕੀ ਤੁਸੀਂ ਫਸਲ ਜਾਂ ਸਮੱਸਿਆ ਬਾਰੇ ਹੋਰ ਖਾਸ ਹੋ ਸਕਦੇ ਹੋ?"
  }

  const translations = {
    en: {
      title: "Crop Advisory System",
      manual: "Manual Input",
      photo: "Photo Detection",
      voice: "Voice Input",
      chatbot: "AI Chatbot",
      soilType: "Soil Type",
      moistureLevel: "Moisture Level",
      cropType: "Crop Type",
      cropIssue: "Describe Issue",
      analyze: "Get AI Recommendations",
      uploadPhoto: "Upload Crop/Soil Photo",
      startVoice: "Start Voice Input",
      recommendations: "AI Recommendations",
      suitability: "Suitability",
      tips: "Growing Tips",
      chatPlaceholder: "Ask about crops, diseases, or farming techniques...",
      send: "Send",
      disclaimer:
        "All advisory in KRISHIMITRA is based on datasets and guidelines provided by Punjab Agricultural University (PAU).",
      back: "Back to Dashboard",
    },
    hi: {
      title: "फसल सलाह प्रणाली",
      manual: "मैनुअल इनपुट",
      photo: "फोटो डिटेक्शन",
      voice: "आवाज इनपुट",
      chatbot: "एआई चैटबॉट",
      soilType: "मिट्टी का प्रकार",
      moistureLevel: "नमी का स्तर",
      cropType: "फसल का प्रकार",
      cropIssue: "समस्या का वर्णन करें",
      analyze: "एआई सिफारिशें प्राप्त करें",
      uploadPhoto: "फसल/मिट्टी की फोटो अपलोड करें",
      startVoice: "आवाज इनपुट शुरू करें",
      recommendations: "एआई सिफारिशें",
      suitability: "उपयुक्तता",
      tips: "उगाने की युक्तियां",
      chatPlaceholder: "फसलों, बीमारियों या कृषि तकनीकों के बारे में पूछें...",
      send: "भेजें",
      disclaimer: "कृषिमित्र में सभी सलाह पंजाब कृषि विश्वविद्यालय (पीएयू) द्वारा प्रदान किए गए डेटासेट और दिशानिर्देशों पर आधारित है।",
      back: "डैशबोर्ड पर वापस",
    },
    pa: {
      title: "ਫਸਲ ਸਲਾਹ ਸਿਸਟਮ",
      manual: "ਮੈਨੁਅਲ ਇਨਪੁਟ",
      photo: "ਫੋਟੋ ਡਿਟੈਕਸ਼ਨ",
      voice: "ਆਵਾਜ਼ ਇਨਪੁਟ",
      chatbot: "ਏਆਈ ਚੈਟਬੋਟ",
      soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
      moistureLevel: "ਨਮੀ ਦਾ ਪੱਧਰ",
      cropType: "ਫਸਲ ਦੀ ਕਿਸਮ",
      cropIssue: "ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ",
      analyze: "ਏਆਈ ਸਿਫਾਰਸ਼ਾਂ ਪ੍ਰਾਪਤ ਕਰੋ",
      uploadPhoto: "ਫਸਲ/ਮਿੱਟੀ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
      startVoice: "ਆਵਾਜ਼ ਇਨਪੁਟ ਸ਼ੁਰੂ ਕਰੋ",
      recommendations: "ਏਆਈ ਸਿਫਾਰਸ਼ਾਂ",
      suitability: "ਉਪਯੁਕਤਤਾ",
      tips: "ਉਗਾਉਣ ਦੇ ਟਿਪਸ",
      chatPlaceholder: "ਫਸਲਾਂ, ਬਿਮਾਰੀਆਂ ਜਾਂ ਖੇਤੀਬਾੜੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
      send: "ਭੇਜੋ",
      disclaimer:
        "ਕ੍ਰਿਸ਼ਿਮਿਤ੍ਰਾ ਵਿੱਚ ਸਾਰੀ ਸਲਾਹ ਪੰਜਾਬ ਐਗਰੀਕਲਚਰਲ ਯੂਨੀਵਰਸਿਟੀ (ਪੀਏਯੂ) ਦੁਆਰਾ ਪ੍ਰਦਾਨ ਕੀਤੇ ਗਏ ਡੇਟਾਸੈਟ ਅਤੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ 'ਤੇ ਅਧਾਰਤ ਹੈ।",
      back: "ਡੈਸ਼ਬੋਰਡ ਵਾਪਸ",
    },
  }

  const t = translations[language as keyof typeof translations]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
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
              <Brain className="h-6 w-6" />
              <h1 className="text-xl font-bold">{t.title}</h1>
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

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "manual" ? "default" : "outline"}
            onClick={() => setActiveTab("manual")}
            className="flex items-center gap-2"
          >
            <Leaf className="h-4 w-4" />
            {t.manual}
          </Button>
          <Button
            variant={activeTab === "photo" ? "default" : "outline"}
            onClick={() => setActiveTab("photo")}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            {t.photo}
          </Button>
          <Button
            variant={activeTab === "voice" ? "default" : "outline"}
            onClick={() => setActiveTab("voice")}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            {t.voice}
          </Button>
          <Button
            variant={activeTab === "chatbot" ? "default" : "outline"}
            onClick={() => setActiveTab("chatbot")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {t.chatbot}
          </Button>
        </div>

        {/* Manual Input Tab */}
        {activeTab === "manual" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Manual Crop Analysis</CardTitle>
                <CardDescription>Enter your soil and crop details for AI recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="soil">{t.soilType}</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay / चिकनी मिट्टी / ਮਿੱਟੀ</SelectItem>
                      <SelectItem value="loamy">Loamy / दोमट / ਦੋਮਟ</SelectItem>
                      <SelectItem value="sandy">Sandy / रेतीली / ਰੇਤਲੀ</SelectItem>
                      <SelectItem value="black">Black / काली / ਕਾਲੀ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="moisture">{t.moistureLevel}</Label>
                  <Select value={moistureLevel} onValueChange={setMoistureLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select moisture level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low / कम / ਘੱਟ</SelectItem>
                      <SelectItem value="medium">Medium / मध्यम / ਮੱਧਮ</SelectItem>
                      <SelectItem value="high">High / उच्च / ਉੱਚ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crop">{t.cropType}</Label>
                  <Input
                    id="crop"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g., Wheat, Rice, Cotton"
                  />
                </div>
                <div>
                  <Label htmlFor="issue">{t.cropIssue}</Label>
                  <Textarea
                    id="issue"
                    value={cropIssue}
                    onChange={(e) => setCropIssue(e.target.value)}
                    placeholder="Describe any issues with your crop"
                    rows={3}
                  />
                </div>
                <Button onClick={handleManualAnalysis} className="w-full h-12 text-base font-semibold">
                  <Brain className="h-5 w-5 mr-2" />
                  {t.analyze}
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">{t.recommendations}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{rec.crop}</h3>
                        <Badge
                          variant={rec.suitability === "Highly Suitable" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {rec.suitability}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div>
                        <h4 className="font-medium text-sm mb-2">{t.tips}:</h4>
                        <ul className="text-sm space-y-1">
                          {rec.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Photo Detection Tab */}
        {activeTab === "photo" && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Camera className="h-5 w-5" />
                AI Photo Analysis
              </CardTitle>
              <CardDescription>Upload crop or soil images for instant AI-powered analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Camera className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                <p className="text-muted-foreground mb-4">
                  {language === "en"
                    ? "Upload an image of your crop or soil for AI analysis"
                    : language === "hi"
                      ? "एआई विश्लेषण के लिए अपनी फसल या मिट्टी की तस्वीर अपलोड करें"
                      : "ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਆਪਣੀ ਫਸਲ ਜਾਂ ਮਿੱਟੀ ਦੀ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ"}
                </p>
                <Button onClick={handleImageUpload} className="h-12 text-base font-semibold">
                  <Upload className="h-5 w-5 mr-2" />
                  {t.uploadPhoto}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Input Tab */}
        {activeTab === "voice" && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Mic className="h-5 w-5" />
                Voice Input System
              </CardTitle>
              <CardDescription>Speak your farming questions in Hindi, Punjabi, or English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div
                  className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                    isListening ? "bg-red-100 animate-pulse" : "bg-primary/10"
                  }`}
                >
                  <Mic className={`h-12 w-12 ${isListening ? "text-red-500" : "text-primary"}`} />
                </div>
                <p className="text-muted-foreground mb-4">
                  {isListening
                    ? language === "en"
                      ? "Listening... Speak now"
                      : language === "hi"
                        ? "सुन रहा हूं... अब बोलें"
                        : "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ"
                    : language === "en"
                      ? "Click the button and speak your farming question"
                      : language === "hi"
                        ? "बटन दबाएं और अपना कृषि प्रश्न बोलें"
                        : "ਬਟਨ ਦਬਾਓ ਅਤੇ ਆਪਣਾ ਖੇਤੀਬਾੜੀ ਸਵਾਲ ਬੋਲੋ"}
                </p>
                <Button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className="h-12 text-base font-semibold"
                  variant={isListening ? "destructive" : "default"}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  {isListening ? "Listening..." : t.startVoice}
                </Button>
              </div>
              {chatInput && (
                <div className="border rounded-lg p-4">
                  <Label>Voice Input Detected:</Label>
                  <p className="text-sm bg-muted p-2 rounded mt-2">{chatInput}</p>
                  <Button onClick={handleChatSend} className="mt-2 w-full">
                    Process Voice Input
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Chatbot Tab */}
        {activeTab === "chatbot" && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <MessageSquare className="h-5 w-5" />
                AI Farming Assistant
              </CardTitle>
              <CardDescription>Chat with our AI assistant for personalized farming advice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/20">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          message.type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === "user" ? "bg-primary" : "bg-secondary"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="h-4 w-4 text-primary-foreground" />
                          ) : (
                            <Bot className="h-4 w-4 text-secondary-foreground" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border text-card-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t.chatPlaceholder}
                    onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleVoiceInput} variant="outline" size="icon" disabled={isListening}>
                    <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
                  </Button>
                  <Button onClick={handleChatSend} disabled={!chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-yellow-800 dark:text-yellow-200 font-medium">{t.disclaimer}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
