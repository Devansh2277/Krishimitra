"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ArrowLeft,
  Sun,
  Moon,
  MessageSquare,
  ThumbsUp,
  Star,
  Droplets,
  Wheat,
  Sprout,
  AlertTriangle,
  Send,
  Plus,
} from "lucide-react"
import { useTheme } from "next-themes"

interface Review {
  id: string
  farmerName: string
  location: string
  rating: number
  category: "crops" | "soil" | "flood"
  title: string
  content: string
  likes: number
  date: string
  experience: string
}

interface Question {
  id: string
  farmerName: string
  location: string
  question: string
  answers: Answer[]
  date: string
  category: string
}

interface Answer {
  id: string
  farmerName: string
  answer: string
  likes: number
  date: string
}

export default function Community() {
  const [language, setLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("reviews")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    const savedLanguage = sessionStorage.getItem("language")

    if (!isLoggedIn) {
      window.location.href = "/"
      return
    }

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const getReviewsData = (lang: string) => {
    const reviewsData = {
      en: [
        {
          id: "1",
          farmerName: "Rajesh Singh",
          location: "Ludhiana, Punjab",
          rating: 5,
          category: "crops" as const,
          title: "Excellent Wheat Variety - HD-3086",
          content:
            "I've been growing HD-3086 wheat variety for 3 years now. It gives excellent yield even in less water conditions. Highly recommend for Punjab farmers. Average yield: 45 quintals per acre.",
          likes: 24,
          date: "2024-01-15",
          experience: "15 years farming",
        },
        {
          id: "2",
          farmerName: "Gurpreet Kaur",
          location: "Amritsar, Punjab",
          rating: 4,
          category: "soil" as const,
          title: "Clay Soil Management Tips",
          content:
            "For clay soil, I add organic compost and sand mixture. This improves drainage significantly. Also, avoid working the soil when it's too wet. Best time is when soil crumbles in your hand.",
          likes: 18,
          date: "2024-01-12",
          experience: "12 years farming",
        },
        {
          id: "3",
          farmerName: "Hardeep Singh",
          location: "Patiala, Punjab",
          rating: 5,
          category: "flood" as const,
          title: "Flood Management - Saved My Crop",
          content:
            "During 2023 floods, I created drainage channels around my fields. Also planted trees on boundaries to prevent soil erosion. Lost only 10% crop compared to neighbors who lost 60%.",
          likes: 32,
          date: "2024-01-10",
          experience: "20 years farming",
        },
        {
          id: "4",
          farmerName: "Simran Kaur",
          location: "Jalandhar, Punjab",
          rating: 4,
          category: "crops" as const,
          title: "Basmati Rice - Best Practices",
          content:
            "For premium basmati, maintain 2-3 cm water level. Use SRI method for better root development. Harvest at 80% maturity for best aroma and grain quality.",
          likes: 21,
          date: "2024-01-08",
          experience: "8 years farming",
        },
        {
          id: "5",
          farmerName: "Jasbir Singh",
          location: "Bathinda, Punjab",
          rating: 5,
          category: "soil" as const,
          title: "Sandy Soil Improvement",
          content:
            "Added vermicompost and cow dung regularly. Now my sandy soil retains moisture better. Crop yield increased by 30% in 2 years. Key is consistent organic matter addition.",
          likes: 27,
          date: "2024-01-05",
          experience: "18 years farming",
        },
      ],
      hi: [
        {
          id: "1",
          farmerName: "राजेश सिंह",
          location: "लुधियाना, पंजाब",
          rating: 5,
          category: "crops" as const,
          title: "उत्कृष्ट गेहूं किस्म - HD-3086",
          content:
            "मैं 3 साल से HD-3086 गेहूं की किस्म उगा रहा हूं। यह कम पानी की स्थिति में भी उत्कृष्ट उत्पादन देती है। पंजाब के किसानों के लिए अत्यधिक अनुशंसित। औसत उत्पादन: 45 क्विंटल प्रति एकड़।",
          likes: 24,
          date: "2024-01-15",
          experience: "15 साल की खेती",
        },
        {
          id: "2",
          farmerName: "गुरप्रीत कौर",
          location: "अमृतसर, पंजाब",
          rating: 4,
          category: "soil" as const,
          title: "चिकनी मिट्टी प्रबंधन सुझाव",
          content:
            "चिकनी मिट्टी के लिए, मैं जैविक कंपोस्ट और रेत का मिश्रण मिलाती हूं। इससे जल निकासी में काफी सुधार होता है। मिट्टी बहुत गीली होने पर काम न करें। सबसे अच्छा समय तब है जब मिट्टी हाथ में भुरभुरी हो।",
          likes: 18,
          date: "2024-01-12",
          experience: "12 साल की खेती",
        },
        {
          id: "3",
          farmerName: "हरदीप सिंह",
          location: "पटियाला, पंजाब",
          rating: 5,
          category: "flood" as const,
          title: "बाढ़ प्रबंधन - मेरी फसल बचाई",
          content:
            "2023 की बाढ़ के दौरान, मैंने अपने खेतों के चारों ओर जल निकासी चैनल बनाए। सीमाओं पर पेड़ भी लगाए मिट्टी के कटाव को रोकने के लिए। पड़ोसियों के 60% नुकसान की तुलना में केवल 10% फसल का नुकसान हुआ।",
          likes: 32,
          date: "2024-01-10",
          experience: "20 साल की खेती",
        },
        {
          id: "4",
          farmerName: "सिमरन कौर",
          location: "जालंधर, पंजाब",
          rating: 4,
          category: "crops" as const,
          title: "बासमती चावल - सर्वोत्तम प्रथाएं",
          content:
            "प्रीमियम बासमती के लिए, 2-3 सेमी पानी का स्तर बनाए रखें। बेहतर जड़ विकास के लिए SRI विधि का उपयोग करें। सर्वोत्तम सुगंध और दाने की गुणवत्ता के लिए 80% परिपक्वता पर कटाई करें।",
          likes: 21,
          date: "2024-01-08",
          experience: "8 साल की खेती",
        },
        {
          id: "5",
          farmerName: "जसबीर सिंह",
          location: "बठिंडा, पंजाब",
          rating: 5,
          category: "soil" as const,
          title: "रेतीली मिट्टी में सुधार",
          content:
            "नियमित तौर 'तੇ वर्मीकंपोस्ट अਤੇ गਊ ਦੇ ਗੋਬਰ ਦੀ ਖਾਦ ਮਿਲਾਈ। ਹੁਣ ਮੇਰੀ ਰੇਤਲੀ ਮਿੱਟੀ ਬਿਹਤਰ ਨਮੀ ਬਣਾਈ ਰੱਖਦੀ ਹੈ। 2 ਸਾਲਾਂ ਵਿੱਚ ਫਸਲ ਦੀ ਪੈਦਾਵਾਰ 30% ਵਧ ਗई। ਮੁੱਖ ਗੱਲ ਲਗਾਤਾਰ ਜੈਵਿਕ ਪਦਾਰਥ ਮਿਲਾਉਣਾ ਹੈ।",
          likes: 27,
          date: "2024-01-05",
          experience: "18 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
      ],
      pa: [
        {
          id: "1",
          farmerName: "ਰਾਜੇਸ਼ ਸਿੰਘ",
          location: "ਲੁਧਿਆਣਾ, ਪੰਜਾਬ",
          rating: 5,
          category: "crops" as const,
          title: "ਸ਼ਾਨਦਾਰ ਕਣਕ ਦੀ ਕਿਸਮ - HD-3086",
          content:
            "ਮੈਂ 3 ਸਾਲਾਂ ਤੋਂ HD-3086 ਕਣਕ ਦੀ ਕਿਸਮ ਉਗਾ ਰਿਹਾ ਹਾਂ। ਇਹ ਘੱਟ ਪਾਣੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਵੀ ਸ਼ਾਨਦਾਰ ਪੈਦਾਵਾਰ ਦਿੰਦੀ ਹੈ। ਪੰਜਾਬ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਬਹੁਤ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਔਸਤ ਪੈਦਾਵਾਰ: 45 ਕੁਇੰਟਲ ਪ੍ਰਤੀ ਏਕੜ।",
          likes: 24,
          date: "2024-01-15",
          experience: "15 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
        {
          id: "2",
          farmerName: "ਗੁਰਪ੍ਰੀਤ ਕੌਰ",
          location: "ਅਮ੍ਰਿਤਸਰ, ਪੰਜਾਬ",
          rating: 4,
          category: "soil" as const,
          title: "ਮਿੱਟੀ ਪ੍ਰਬੰਧਨ ਸੁਝਾਅ",
          content:
            "ਚਿਕਨੀ ਮਿੱਟੀ ਲਈ, ਮੈਂ ਜੈਵਿਕ ਕੰਪੋਸਟ ਅਤੇ ਰੇਤ ਦਾ ਮਿਸ਼ਰਣ ਮਿਲਾਉਂਦੀ ਹਾਂ। ਇਸ ਨਾਲ ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਵਿੱਚ ਕਾਫੀ ਸੁਧਾਰ ਹੁੰਦਾ ਹੈ। ਮਿੱਟੀ ਬਹੁਤ ਗਿੱਲੀ ਹੋਣ 'ਤੇ ਕੰਮ ਨਾ ਕਰੋ। ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਉਦੋਂ ਹੈ ਜਦੋਂ ਮਿੱਟੀ ਹੱਥ ਵਿੱਚ ਭੁਰਭੁਰੀ ਹੋਵੇ।",
          likes: 18,
          date: "2024-01-12",
          experience: "12 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
        {
          id: "3",
          farmerName: "ਹਰਦੀਪ ਸਿੰਘ",
          location: "ਪਟਿਆਲਾ, ਪੰਜਾਬ",
          rating: 5,
          category: "flood" as const,
          title: "ਹੜ੍ਹ ਪ੍ਰਬੰਧਨ - ਮੇਰੀ ਫਸਲ ਬਚਾਈ",
          content:
            "2023 ਦੇ ਹੜ੍ਹਾਂ ਦੌਰਾਨ, ਮੈਂ ਆਪਣੇ ਖੇਤਾਂ ਦੇ ਚਾਰੇ ਪਾਸੇ ਪਾਣੀ ਨਿਕਾਸੀ ਚੈਨਲ ਬਣਾਏ। ਮਿੱਟੀ ਦੇ ਕਟਾਅ ਨੂੰ ਰੋਕਣ ਲਈ ਸੀਮਾਵਾਂ 'ਤੇ ਰੁੱਖ ਵੀ ਲਗਾਏ। ਗੁਆਂਢੀਆਂ ਦੇ 60% ਨੁਕਸਾਨ ਦੇ ਮੁਕਾਬਲੇ ਸਿਰਫ 10% ਫਸਲ ਦਾ ਨੁਕਸਾਨ ਹੋਇਆ।",
          likes: 32,
          date: "2024-01-10",
          experience: "20 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
        {
          id: "4",
          farmerName: "ਸਿਮਰਨ ਕੌਰ",
          location: "ਜਲੰਧਰ, ਪੰਜਾਬ",
          rating: 4,
          category: "crops" as const,
          title: "ਬਾਸਮਤੀ ਚਾਵਲ - ਸਰਵੋਤਮ ਅਭਿਆਸ",
          content:
            "ਪ੍ਰੀਮੀਅਮ ਬਾਸਮਤੀ ਲਈ, 2-3 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਦਾ ਪੱਧਰ ਬਣਾਈ ਰੱਖੋ। ਬਿਹਤਰ ਜੜ੍ਹ ਵਿਕਾਸ ਲਈ SRI ਵਿਧੀ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਸਰਵੋਤਮ ਸੁਗੰਧ ਅਤੇ ਦਾਣੇ ਦੀ ਗੁਣਵੱਤਾ ਲਈ 80% ਪਰਿਪੱਕਤਾ 'ਤੇ ਵਾਢੀ ਕਰੋ।",
          likes: 21,
          date: "2024-01-08",
          experience: "8 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
        {
          id: "5",
          farmerName: "ਜਸਬੀਰ ਸਿੰਘ",
          location: "ਬਠਿੰਡਾ, ਪੰਜਾਬ",
          rating: 5,
          category: "soil" as const,
          title: "ਰੇਤਲੀ ਮਿੱਟੀ ਵਿੱਚ ਸੁਧਾਰ",
          content:
            "ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਵਰਮੀਕੰਪੋਸਟ ਅਤੇ ਗਊ ਦੇ ਗੋਬਰ ਦੀ ਖਾਦ ਮਿਲਾਈ। ਹੁਣ ਮੇਰੀ ਰੇਤਲੀ ਮਿੱਟੀ ਬਿਹਤਰ ਨਮੀ ਬਣਾਈ ਰੱਖਦੀ ਹੈ। 2 ਸਾਲਾਂ ਵਿੱਚ ਫਸਲ ਦੀ ਪੈਦਾਵਾਰ 30% ਵਧ ਗई। ਮੁੱਖ ਗੱਲ ਲਗਾਤਾਰ ਜੈਵਿਕ ਪਦਾਰਥ ਮਿਲਾਉਣਾ ਹੈ।",
          likes: 27,
          date: "2024-01-05",
          experience: "18 ਸਾਲ ਦੀ ਖੇਤੀ",
        },
      ],
    }

    return reviewsData[lang as keyof typeof reviewsData] || reviewsData.en
  }

  const reviews: Review[] = getReviewsData(language)

  const questions: Question[] = [
    {
      id: "1",
      farmerName: "Manpreet Singh",
      location: "Moga, Punjab",
      question: "What's the best time to sow wheat in Punjab? Climate is changing and I'm confused about timing.",
      answers: [
        {
          id: "1",
          farmerName: "Rajesh Singh",
          answer:
            "Best time is still mid-November to early December. Don't go too early as temperature might be high. I sow around 20th November every year.",
          likes: 12,
          date: "2024-01-16",
        },
        {
          id: "2",
          farmerName: "Gurdeep Singh",
          answer:
            "I agree with Rajesh. Also check soil temperature - it should be around 18-20°C. Use weather apps to track temperature trends.",
          likes: 8,
          date: "2024-01-16",
        },
      ],
      date: "2024-01-15",
      category: "crops",
    },
    {
      id: "2",
      farmerName: "Kuldeep Kaur",
      location: "Ferozepur, Punjab",
      question: "How to manage pink bollworm in cotton? Tried many pesticides but problem persists.",
      answers: [
        {
          id: "3",
          farmerName: "Harpreet Singh",
          answer:
            "Use pheromone traps and Bt cotton varieties. Also, destroy crop residue after harvest. Integrated pest management works better than just pesticides.",
          likes: 15,
          date: "2024-01-14",
        },
      ],
      date: "2024-01-13",
      category: "pest",
    },
  ]

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return
    // Mock functionality - in real app, would save to database
    alert(`Question posted: ${newQuestion}`)
    setNewQuestion("")
  }

  const handleAnswerQuestion = (questionId: string) => {
    if (!newAnswer.trim()) return
    // Mock functionality - in real app, would save to database
    alert(`Answer posted for question ${questionId}: ${newAnswer}`)
    setNewAnswer("")
    setSelectedQuestionId(null)
  }

  const filteredReviews = selectedCategory === "all" ? reviews : reviews.filter((r) => r.category === selectedCategory)

  const translations = {
    en: {
      title: "Farmer Community",
      reviews: "Farmer Reviews",
      questions: "Ask & Answer",
      allCategories: "All Categories",
      crops: "Crops",
      soil: "Soil Management",
      flood: "Flood Management",
      askQuestion: "Ask a Question",
      questionPlaceholder: "Ask your farming question here...",
      postQuestion: "Post Question",
      answerPlaceholder: "Share your answer or experience...",
      postAnswer: "Post Answer",
      likes: "likes",
      answers: "answers",
      experience: "Experience",
      back: "Back to Dashboard",
      yearsExp: "years experience",
      answer: "Answer",
      cancel: "Cancel",
    },
    hi: {
      title: "किसान समुदाय",
      reviews: "किसान समीक्षाएं",
      questions: "पूछें और जवाब दें",
      allCategories: "सभी श्रेणियां",
      crops: "फसलें",
      soil: "मिट्टी प्रबंधन",
      flood: "बाढ़ प्रबंधन",
      askQuestion: "प्रश्न पूछें",
      questionPlaceholder: "यहां अपना कृषि प्रश्न पूछें...",
      postQuestion: "प्रश्न पोस्ट करें",
      answerPlaceholder: "अपना उत्तर या अनुभव साझा करें...",
      postAnswer: "उत्तर पोस्ट करें",
      likes: "पसंद",
      answers: "उत्तर",
      experience: "अनुभव",
      back: "डैशबोर्ड पर वापस",
      yearsExp: "साल का अनुभव",
      answer: "उत्तर",
      cancel: "रद्द करें",
    },
    pa: {
      title: "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
      reviews: "ਕਿਸਾਨ ਸਮੀਖਿਆਵਾਂ",
      questions: "ਪੁੱਛੋ ਅਤੇ ਜਵਾਬ ਦਿਓ",
      allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
      crops: "ਫਸਲਾਂ",
      soil: "ਮਿੱਟੀ ਪ੍ਰਬੰਧਨ",
      flood: "ਹੜ੍ਹ ਪ੍ਰਬੰਧਨ",
      askQuestion: "ਸਵਾਲ ਪੁੱਛੋ",
      questionPlaceholder: "ਇੱਥੇ ਆਪਣਾ ਖੇਤੀਬਾੜੀ ਸਵਾਲ ਪੁੱਛੋ...",
      postQuestion: "ਸਵਾਲ ਪੋਸਟ ਕਰੋ",
      answerPlaceholder: "ਆਪਣਾ ਜਵਾਬ ਜਾਂ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ...",
      postAnswer: "ਜਵਾਬ ਪੋਸਟ ਕਰੋ",
      likes: "ਪਸੰਦ",
      answers: "ਜਵਾਬ",
      experience: "ਤਜਰਬਾ",
      back: "ਡੈਸ਼ਬੋਰਡ ਵਾਪਸ",
      yearsExp: "ਸਾਲ ਦਾ ਤਜਰਬਾ",
      answer: "ਜਵਾਬ",
      cancel: "ਰੱਦ ਕਰੋ",
    },
  }

  const t = translations[language as keyof typeof translations]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crops":
        return <Wheat className="h-4 w-4" />
      case "soil":
        return <Sprout className="h-4 w-4" />
      case "flood":
        return <Droplets className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "crops":
        return "bg-green-100 text-green-700"
      case "soil":
        return "bg-brown-100 text-brown-700"
      case "flood":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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
              <Users className="h-6 w-6" />
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
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {t.reviews}
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {t.questions}
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                {t.allCategories}
              </Button>
              <Button
                variant={selectedCategory === "crops" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("crops")}
                className="flex items-center gap-2"
              >
                <Wheat className="h-4 w-4" />
                {t.crops}
              </Button>
              <Button
                variant={selectedCategory === "soil" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("soil")}
                className="flex items-center gap-2"
              >
                <Sprout className="h-4 w-4" />
                {t.soil}
              </Button>
              <Button
                variant={selectedCategory === "flood" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("flood")}
                className="flex items-center gap-2"
              >
                <Droplets className="h-4 w-4" />
                {t.flood}
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {review.farmerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="font-medium">{review.farmerName}</span>
                            <span>•</span>
                            <span>{review.location}</span>
                            <span>•</span>
                            <span>{review.experience}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(review.category)}>
                          {getCategoryIcon(review.category)}
                          <span className="ml-1 capitalize">{review.category}</span>
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed mb-4">{review.content}</p>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 hover:text-primary">
                          <ThumbsUp className="h-4 w-4" />
                          <span>
                            {review.likes} {t.likes}
                          </span>
                        </button>
                      </div>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-6">
            {/* Ask Question */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Plus className="h-5 w-5" />
                  {t.askQuestion}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder={t.questionPlaceholder}
                  rows={3}
                />
                <Button onClick={handleAskQuestion} disabled={!newQuestion.trim()} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {t.postQuestion}
                </Button>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id} className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {question.farmerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardDescription className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{question.farmerName}</span>
                          <span>•</span>
                          <span>{question.location}</span>
                          <span>•</span>
                          <span>{new Date(question.date).toLocaleDateString()}</span>
                        </CardDescription>
                        <p className="text-sm leading-relaxed">{question.question}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Answers */}
                    {question.answers.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {answer.farmerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{answer.farmerName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(answer.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed mb-2">{answer.answer}</p>
                                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                                  <ThumbsUp className="h-3 w-3" />
                                  <span>
                                    {answer.likes} {t.likes}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer Form */}
                    {selectedQuestionId === question.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                          placeholder={t.answerPlaceholder}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAnswerQuestion(question.id)}
                            disabled={!newAnswer.trim()}
                            size="sm"
                          >
                            {t.postAnswer}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedQuestionId(null)
                              setNewAnswer("")
                            }}
                            size="sm"
                          >
                            {t.cancel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedQuestionId(question.id)}
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {t.answer}
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {question.answers.length} {t.answers}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
