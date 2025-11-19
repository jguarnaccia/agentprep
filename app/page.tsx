"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  Brain, 
  Target, 
  BookOpen, 
  Sparkles, 
  TrendingUp,
  Award,
  ChevronRight,
  Layers,
  Users,
  CheckCircle2,
  Play
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const heroStats = [
    { value: "1,000+", label: "CBA Questions Answered" },
    { value: "3,500", label: "Flashcards Created" },
    { value: "500+", label: "Future NBA Agents" },
  ];

  const stats = [
    { value: "3,060", label: "AI Flashcards", icon: <Layers className="h-6 w-6" /> },
    { value: "832", label: "Practice Questions", icon: <Target className="h-6 w-6" /> },
    { value: "42", label: "CBA Articles", icon: <BookOpen className="h-6 w-6" /> },
    { value: "190+", label: "Real Scenarios", icon: <Users className="h-6 w-6" /> },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Smart Flashcards",
      description: "Memorize every article and clause of the CBA with AI-assisted flashcards.",
      href: "/flashcards",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Tutor",
      description: "Ask complex CBA questions and get instant, accurate explanations.",
      href: "/ai-generator",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Real Scenarios",
      description: "Apply your knowledge through interactive negotiation and test simulations.",
      href: "/scenarios",
    },
  ];

  const testimonials = [
    {
      quote: "StadiumU made studying the CBA simple and engaging.",
      author: "Michael D.",
    },
    {
      quote: "The AI tutor feels like having an actual mentor.",
      author: "Jasmine L.",
    },
    {
      quote: "It's the first tool that made the CBA make sense.",
      author: "Ryan S.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0B0C10] text-gray-100" style={{ scrollBehavior: "smooth" }}>
      {/* Fixed Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-900/50 bg-[#0B0C10]/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-16 w-16 transition-transform group-hover:scale-110 flex items-center justify-center">
                <img 
                  src="/stadium-logo.png" 
                  alt="StadiumU Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-blue-400 bg-clip-text text-transparent">
                StadiumU
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveTab(item.name.toLowerCase())}
                  className="group relative px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeTab === item.name.toLowerCase() && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg bg-gray-800/50 border border-blue-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="absolute inset-0 rounded-lg bg-blue-500/0 transition-all group-hover:bg-blue-500/10 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="hidden sm:flex text-gray-400 hover:text-white hover:bg-gray-800/50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all hover:scale-105"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity hover:opacity-100" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Animated Background with Parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F293720_1px,transparent_1px),linear-gradient(to_bottom,#1F293720_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient Orbs with Parallax */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-blue-500/20 blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" 
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-blue-400/10 blur-[80px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-5xl text-center"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants} 
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl transition-all hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Empowering Teams, Agents & Athletes</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="mb-8 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Learn, Lead, and{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Perform
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -bottom-3 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-blue-600 blur-sm"
                />
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="mx-auto mb-12 max-w-3xl text-xl text-gray-400 sm:text-2xl leading-relaxed"
            >
              Sports intelligence meets modern learning.{" "}
              <span className="text-gray-300 font-semibold">Train smarter, manage better</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-10 py-7 text-lg font-semibold text-white transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group border-gray-700 bg-gray-900/50 px-10 py-7 text-lg font-semibold text-gray-300 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-gray-800/50 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Hero Stats - Fade in after 1s */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {heroStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-center justify-center gap-3 rounded-lg border border-gray-800 bg-gray-900/30 p-4 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:bg-gray-900/50"
                >
                  <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <ChevronRight className="h-5 w-5 rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-6xl"
          >
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 shadow-2xl backdrop-blur-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group text-center"
                    >
                      <div className="mb-3 flex justify-center text-blue-400 transition-all group-hover:scale-110 group-hover:text-blue-300">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-white sm:text-4xl">
                        {stat.value}
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-500">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24" id="features">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-gray-400">
              Built for aspiring agents who want to master the CBA
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <Card className="group h-full cursor-pointer border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl transition-all hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-4 text-blue-400 ring-1 ring-blue-500/20 transition-all group-hover:bg-blue-500/20 group-hover:ring-blue-500/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        {feature.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mb-4 text-gray-400">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-blue-400 transition-all group-hover:gap-2">
                        Learn more
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-6xl"
          >
            <Card className="overflow-hidden border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 shadow-2xl backdrop-blur-xl">
              <CardContent className="p-8 lg:p-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className="flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        See how it works
                      </h2>
                      <p className="mb-8 text-lg text-gray-400">
                        Explore a real-time training environment that breaks down the CBA like never before.
                      </p>
                    </motion.div>
                    <div className="space-y-4">
                      {[
                        { icon: BookOpen, title: "Comprehensive Coverage", desc: "Every article, section, and clause explained" },
                        { icon: TrendingUp, title: "Track Your Progress", desc: "Smart analytics show your improvement" },
                        { icon: Award, title: "Pass with Confidence", desc: "Join hundreds of successful agents" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                          className="flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4 transition-all hover:border-blue-500/30 hover:bg-gray-900/50"
                        >
                          <div className="rounded-lg bg-blue-500/10 p-2 ring-1 ring-blue-500/20">
                            <item.icon className="h-5 w-5 flex-shrink-0 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black shadow-2xl">
                      <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
                        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-[0_0_50px_rgba(59,130,246,0.4)]">
                          <BookOpen className="h-24 w-24 text-white" />
                          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl" />
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-semibold text-white">
                            Interactive Study Experience
                          </p>
                          <p className="mt-2 text-sm text-gray-400">
                            Master the CBA with our comprehensive tools
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)] [animation-delay:0.2s]" />
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)] [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What students are saying
            </h2>
            <p className="text-lg text-gray-400">
              Real feedback from aspiring agents
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-xl transition-all hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="mb-6 text-blue-400">
                      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="mb-6 text-lg leading-relaxed text-gray-300">
                      {testimonial.quote}
                    </p>
                    <p className="font-semibold text-white">
                      — {testimonial.author}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-[0_0_60px_rgba(59,130,246,0.4)]">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20 animate-pulse" />
              
              {/* Decorative elements */}
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
              
              <CardContent className="relative p-12 text-center lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Join hundreds of future agents preparing smarter
                  </h2>
                  <p className="mb-8 text-lg text-blue-100">
                    Start your journey to becoming a certified NBA agent today
                  </p>
                  <Link href="/auth/signup">
                    <Button 
                      size="lg" 
                      className="group relative overflow-hidden bg-white px-10 py-7 text-lg font-semibold text-blue-600 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                    >
                      <span className="relative z-10 flex items-center">
                        Start Free
                        <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-900 bg-black/50 py-16 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">StadiumU</h3>
              <p className="text-sm text-gray-500">
                The comprehensive study platform for aspiring NBA agents.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="text-gray-500 transition-colors hover:text-blue-400">Home</Link></li>
                <li><Link href="/flashcards" className="text-gray-500 transition-colors hover:text-blue-400">Flashcards</Link></li>
                <li><Link href="/study" className="text-gray-500 transition-colors hover:text-blue-400">Practice</Link></li>
                <li><Link href="/ai-generator" className="text-gray-500 transition-colors hover:text-blue-400">AI Tutor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-gray-500 transition-colors hover:text-blue-400">About</Link></li>
                <li><Link href="/contact" className="text-gray-500 transition-colors hover:text-blue-400">Contact</Link></li>
                <li><Link href="/terms" className="text-gray-500 transition-colors hover:text-blue-400">Terms</Link></li>
                <li><Link href="/privacy" className="text-gray-500 transition-colors hover:text-blue-400">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/guide" className="text-gray-500 transition-colors hover:text-blue-400">Study Guide</Link></li>
                <li><Link href="/scenarios" className="text-gray-500 transition-colors hover:text-blue-400">Scenarios</Link></li>
                <li><Link href="/dashboard" className="text-gray-500 transition-colors hover:text-blue-400">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-900 pt-8">
            <p className="text-center text-sm text-gray-600">
              © 2025 StadiumU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
