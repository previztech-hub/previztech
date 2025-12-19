"use client";

import React, { useState, useRef, useEffect } from "react";
import FilmPlayer from "./components/FilmPlayer";
import {
  Play,
  X,
  Mail,
  Phone,
  MapPin,
  Menu,
  Info,
  Film,
  Monitor,
  Globe,
  Cpu,
  Palette,
  Video,
  ChevronRight,
} from "lucide-react";

// --- Mock Data ---

const services = [
  { title: "Previsuals", icon: <Film className="w-8 h-8" /> },
  { title: "Animation 2D/3D", icon: <Monitor className="w-8 h-8" /> },
  { title: "VFX & Virtual Production", icon: <Video className="w-8 h-8" /> },
  { title: "Concept Art & AI", icon: <Palette className="w-8 h-8" /> },
  { title: "Broadcasting (4K)", icon: <Globe className="w-8 h-8" /> },
  { title: "IT Solutions & Data", icon: <Cpu className="w-8 h-8" /> },
];

const videos = [
  {
    id: 1,
    title: "Showreel 1",
    thumbnail: "/1.png",
    url: "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/1.mp4",
  },
  {
    id: 2,
    title: "Showreel 2",
    thumbnail: "/2.png",
    url: "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/2.mp4",
  },
  {
    id: 3,
    title: "Showreel 3",
    thumbnail: "/3.png",
    url: "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/3.mp4",
  },
];

// Background videos (used behind hero)
const bgVideos = [
  "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/1.mp4",
  "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/2.mp4",
  "https://cdn.jsdelivr.net/gh/Anand-Anathur-Elangovan/previz-video-source@main/3.mp4",
];

export default function PrevizApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [showDevAlert, setShowDevAlert] = useState(true);
  const contactRef = useRef(null);
  const bgVideoRef = useRef(null);
  const heroRef = useRef(null);
  const sliderRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  // Form state and validation
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const emailValid = validateEmail(emailInput);
    const phoneValid = validatePhone(phoneInput);
    // Require either a valid email or phone, and require name & message
    setIsFormValid(
      (emailValid || phoneValid) &&
        nameInput.trim().length > 0 &&
        messageInput.trim().length > 0
    );
  }, [emailInput, phoneInput, nameInput, messageInput]);

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(
        () => setToast((s) => ({ ...s, visible: false })),
        5000
      );
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  // Cycle background videos continuously
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;

    const handleEnded = () => {
      setBgIndex((i) => (i + 1) % bgVideos.length);
    };

    v.addEventListener("ended", handleEnded);
    // ensure the current video plays when source changes
    const handleCanPlay = () => v.play().catch(() => {});
    v.addEventListener("canplay", handleCanPlay);

    return () => {
      v.removeEventListener("ended", handleEnded);
      v.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Ensure background video reloads and plays whenever the index changes
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.src = bgVideos[bgIndex];
      v.load();
      v.play().catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [bgIndex]);

  // Slider pointer drag handlers
  const handlePointerDown = (e) => {
    const s = sliderRef.current;
    if (!s) return;
    isDownRef.current = true;
    startXRef.current = e.clientX;
    scrollLeftRef.current = s.scrollLeft;
    s.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const s = sliderRef.current;
    if (!s || !isDownRef.current) return;
    const x = e.clientX;
    const walk = (startXRef.current - x) * 1; // scroll-fast multiplier
    s.scrollLeft = scrollLeftRef.current + walk;
  };

  const handlePointerUp = (e) => {
    const s = sliderRef.current;
    if (s) {
      try {
        s.releasePointerCapture(e.pointerId);
      } catch (e) {}
    }
    isDownRef.current = false;
  };

  const handlePointerLeave = () => {
    isDownRef.current = false;
  };

  // Use vertical wheel to scroll horizontally when hovering the slider
  const handleWheel = (e) => {
    const s = sliderRef.current;
    if (!s) return;
    // prefer vertical wheel to move horizontally
    const delta = e.deltaY || e.wheelDelta;
    if (Math.abs(delta) > 0) {
      s.scrollLeft += delta;
      e.preventDefault();
    }
  };

  // Parallax effect: move background video slightly on mouse move over hero
  const rafRef = useRef(null);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height;
      const tx = (x - 0.5) * 16; // left/right movement
      const ty = (y - 0.5) * 10; // up/down movement

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (bgVideoRef.current) {
          bgVideoRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
        }
      });
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (bgVideoRef.current)
          bgVideoRef.current.style.transform = "translate3d(0,0,0) scale(1.03)";
      });
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [heroRef, bgVideoRef]);

  function validateEmail(email) {
    if (!email) return false;
    // simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    if (!phone) return false;
    // accept digits, spaces, + and -; require 7+ digits
    const digits = phone.replace(/[^0-9]/g, "");
    return digits.length >= 7;
  }

  // Scroll handler
  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Open modal and pause background video
  const openModal = (video) => {
    setActiveVideo(video);
    try {
      bgVideoRef.current?.pause();
    } catch (e) {}
  };

  // Close modal and resume background video
  const closeModal = () => {
    setActiveVideo(null);
    try {
      bgVideoRef.current?.play().catch(() => {});
    } catch (e) {}
  };

  // Close development alert
  const closeAlert = () => setShowDevAlert(false);

  // Handle Form Submit - send to server API which will email the recipients
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) {
      setToast({
        visible: true,
        message:
          "Please provide a valid email or phone and fill name & message.",
        type: "error",
      });
      return;
    }

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToast({
          visible: true,
          message:
            "Thank you — your enquiry was sent. Our team will call you shortly.",
          type: "success",
        });
        e.target.reset();
        setEmailInput("");
        setPhoneInput("");
        setNameInput("");
        setMessageInput("");
      } else {
        const err = await res.json();
        setToast({
          visible: true,
          message: "Failed to send enquiry: " + (err?.error || res.statusText),
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setToast({
        visible: true,
        message: "An error occurred while sending your enquiry.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-yellow-200">
      {/* Toast notification (top-right) */}
      {toast.visible && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`max-w-sm w-full rounded-lg shadow-lg overflow-hidden border ${
              toast.type === "success" ? "border-green-200" : "border-red-200"
            } bg-white`}
          >
            <div
              className={`p-4 flex items-start gap-3 ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-green-50 to-green-100"
                  : "bg-gradient-to-r from-red-50 to-red-100"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  toast.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {toast.type === "success" ? "✓" : "!"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">
                  {toast.type === "success" ? "Message Sent" : "Error"}
                </p>
                <p className="text-sm text-gray-600 mt-1">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast((s) => ({ ...s, visible: false }))}
                className="text-gray-400 hover:text-gray-600 ml-3"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Development Alert (Top Banner) --- */}
      {showDevAlert && (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-4 py-3 shadow-md relative z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 animate-pulse" />
              <span className="font-medium text-sm md:text-base">
                Site Under Development: Some features may be limited.
              </span>
            </div>
            <button
              onClick={closeAlert}
              className="hover:bg-yellow-700/50 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- Header --- */}
      {/* Submitting overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white/95 p-6 rounded-xl flex items-center gap-4 shadow-lg">
            <svg
              className="w-8 h-8 animate-spin text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <div>
              <p className="font-semibold text-gray-900">
                Sending your enquiry...
              </p>
              <p className="text-sm text-gray-600">
                Please wait while we contact our team.
              </p>
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg shadow-yellow-500/30 flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                PRE<span className="text-yellow-600">VIZ</span>
              </h1>
              <p className="text-xs text-gray-500 tracking-wider uppercase">
                Private Limited
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-medium hover:text-yellow-600 transition"
            >
              Home
            </a>
            <a
              href="#services"
              className="text-sm font-medium hover:text-yellow-600 transition"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-sm font-medium hover:text-yellow-600 transition"
            >
              About
            </a>
            <button
              onClick={scrollToContact}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              Contact Us <ChevronRight className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4">
            <a
              href="#"
              className="text-gray-700 font-medium p-2 hover:bg-gray-50 rounded"
            >
              Home
            </a>
            <a
              href="#services"
              className="text-gray-700 font-medium p-2 hover:bg-gray-50 rounded"
            >
              Services
            </a>
            <button
              onClick={scrollToContact}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold"
            >
              Contact Us
            </button>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section
        ref={heroRef}
        className="relative py-12 md:py-16 overflow-hidden"
      >
        {/* Background video container */}
        <div className="absolute inset-0">
          <video
            ref={bgVideoRef}
            src={bgVideos[bgIndex]}
            poster={videos[bgIndex]?.thumbnail}
            muted
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover parallax-transition"
            style={{ transform: "translate3d(0,0,0) scale(1.03)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-left md:text-center">
          <div className="mx-auto max-w-3xl p-4 md:py-12">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-black/40 text-white text-xs font-semibold tracking-wider mb-4 backdrop-blur-sm">
                WELCOME TO THE FUTURE OF VISUALS
              </span>

              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
                Bringing Your Imagination to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600">
                  Reality
                </span>
              </h2>
            </div>

            <div className="flex justify-start md:justify-center gap-4">
              <button
                onClick={scrollToContact}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold shadow-lg hover:scale-105 transform transition animate-cta"
              >
                Get Started
              </button>
              <a
                href="#videos"
                className="px-5 py-2 bg-white/20 text-white border border-white/25 rounded-full font-semibold hover:bg-white/30 transition shadow-sm flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Showreel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Video Slider Section --- */}
      <section id="videos" className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Featured Works</h3>
            <div className="flex gap-2">
              {/* Decorative arrows could go here */}
            </div>
          </div>

          {/* Horizontal Scroll Slider */}
          <div
            ref={sliderRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onWheel={handleWheel}
            className="flex overflow-x-auto pb-8 gap-6 snap-x scrollbar-hide touch-pan-x"
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="snap-center shrink-0 w-[85vw] md:w-[400px] group cursor-pointer relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                onClick={() => openModal(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white">
                  <p className="font-semibold text-sm">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Video Modal Overlay --- */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
              <h4 className="font-semibold">{activeVideo.title}</h4>
              <button
                onClick={() => closeModal()}
                className="hover:text-yellow-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative pt-[56.25%] bg-black">
              {activeVideo.iframeSrc ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={activeVideo.iframeSrc}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                />
              ) : (
                <video
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  autoPlay
                  src={activeVideo.url}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Services Section --- */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900">Our Expertise</h3>
            <p className="text-gray-500 mt-2">
              Comprehensive digital solutions under one roof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-200 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-gray-500 text-sm">
                  Professional grade solutions delivered with precision and
                  creativity.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact & Info Section --- */}
      <section
        ref={contactRef}
        className="py-20 bg-white relative overflow-hidden"
      >
        {/* Background Decorative Blob */}
        <div className="absolute right-0 bottom-0 w-1/3 h-full bg-yellow-50/50 skew-x-12 translate-x-20 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Get In Touch
              </h3>
              <p className="text-gray-600 mb-8">
                Ready to start your project? Fill out the form below and we will
                get back to you immediately.
              </p>

              <form
                onSubmit={handleContactSubmit}
                className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      name="name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      type="text"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      type="tel"
                      placeholder="+91 98765 43210"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    type="email"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    required
                    rows="4"
                    placeholder="Tell us about your project requirements..."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  aria-disabled={!isFormValid || isSubmitting}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/25 transition-all transform active:scale-95 ${
                    isFormValid && !isSubmitting
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                      : "bg-gray-300 cursor-not-allowed opacity-70"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        className="w-5 h-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Enquiry"
                  )}
                </button>
              </form>
            </div>

            {/* Address & Info */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-yellow-600" /> Location
                </h4>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    <strong>Prakash Previz</strong>
                    <br />
                    7/20, Kandhan Kudil Apartment,
                    <br />
                    Neithal Street, Fathima Nagar,
                    <br />
                    Valasaravakkam,
                    <br />
                    Chennai - 600087
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="text-yellow-600" /> Contact Info
                </h4>
                <div className="space-y-4">
                  <a
                    href="tel:7395961056"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-yellow-300 transition group"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white transition">
                      <Phone size={18} />
                    </div>
                    <span className="font-semibold text-gray-700">
                      7395961056 (Prakash)
                    </span>
                  </a>

                  <div className="flex flex-col gap-2">
                    {[
                      "previz2013@gmail.com",
                      "previzprivatelimited2022@gmail.com",
                      "previzsysadm@gmail.com",
                    ].map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-sm text-gray-600"
                      >
                        <Mail size={16} className="text-gray-400" />
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black">
                  P
                </div>
                <h2 className="text-2xl font-bold">Prakash Previz</h2>
              </div>
              <p className="text-gray-400 max-w-sm mb-6">
                Leading the industry in pre-visualization, digital production,
                and high-end broadcasting solutions.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition cursor-pointer">
                  <Monitor size={20} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-yellow-500">
                Quick Links
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-yellow-500">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Previz Private Limited. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
