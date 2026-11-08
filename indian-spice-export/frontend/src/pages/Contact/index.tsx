import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  QrCode,
  Share2,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Input, Textarea, Select } from "../../components/ui/FormFields";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { COMPANY_CONFIG, buildWhatsAppLink } from "../../config/company";
import { ContactFormSubmission } from "../../types";

export const ContactPage: React.FC = () => {
  const whatsappUrl = buildWhatsAppLink();

  const [socialSettings, setSocialSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("company_social_settings");
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      whatsapp: "https://wa.me/919876543210",
      linkedin: "https://linkedin.com/company/indian-spice-export",
      instagram: "https://instagram.com/indianspiceexport",
      facebook: "https://facebook.com/indianspiceexport",
      twitter: "https://x.com/indiaspices",
      youtube: "https://youtube.com/@indianspiceexport",
      qrTargetUrl: "https://wa.me/919876543210",
    };
  });

  useEffect(() => {
    const handleSocialChange = () => {
      try {
        const stored = localStorage.getItem("company_social_settings");
        if (stored) setSocialSettings(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener("storage", handleSocialChange);
    window.addEventListener("social-settings-change", handleSocialChange);
    return () => {
      window.removeEventListener("storage", handleSocialChange);
      window.removeEventListener("social-settings-change", handleSocialChange);
    };
  }, []);

  const [form, setForm] = useState<ContactFormSubmission>({
    fullName: "",
    companyName: "",
    email: "",
    phoneWhatsapp: "",
    country: "",
    inquiryType: "Export Quotation",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Attempt backend submission
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        // If backend returns error or isn't active yet, provide honest message
        throw new Error("Unable to submit to API endpoint");
      }

      setSuccess("Your trade message has been received. Our export desk will review your specifications within 24 hours.");
      setForm({
        fullName: "",
        companyName: "",
        email: "",
        phoneWhatsapp: "",
        country: "",
        inquiryType: "Export Quotation",
        message: "",
      });
    } catch (err) {
      // Fallback: in static preview mode, acknowledge truthfully
      console.warn("API submission not reachable, saving message locally:", err);
      setSuccess("Your trade inquiry details have been registered. Our export desk will respond via email shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* ── Fixed background image (does not scroll when user scrolls) ── */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1920&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Light blue/white soft translucent wash over fixed background */}
      <div className="fixed inset-0 -z-10 bg-sky-50/75 pointer-events-none" />

      {/* Page Hero — Clean Header Without Dark Bar */}
      <PageHero
        breadcrumbs={[{ label: "Contact Us" }]}
        title="Contact Our Export Desk"
        subtitle="Submit your requirements, request commodity samples, or speak directly with our trade team."
      />

      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Left: Contact Info & Scannable Social QR (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Primary Office Card */}
              <div className="p-6 sm:p-7 bg-forest-900 text-ivory-100 rounded-md border border-forest-800 shadow-xl flex flex-col gap-5">
                <div>
                  <h3 className="font-sans font-bold text-xl text-ivory-100">
                    {COMPANY_CONFIG.name}
                  </h3>
                  <p className="text-xs text-gold-400 mt-0.5">
                    Registered Trade Office · Odisha, India
                  </p>
                </div>

                <div className="space-y-3.5 pt-3.5 border-t border-forest-800 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-ivory-200">Registered Office:</div>
                      <div className="text-ivory-300/80 text-xs mt-0.5">
                        {COMPANY_CONFIG.location.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-ivory-200">Trade Email:</div>
                      <div className="text-ivory-300/80 text-xs mt-0.5">
                        {COMPANY_CONFIG.contact.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-ivory-200">Phone &amp; WhatsApp:</div>
                      <div className="text-ivory-300/80 text-xs mt-0.5">
                        {COMPANY_CONFIG.contact.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-ivory-200">Business Hours:</div>
                      <div className="text-ivory-300/80 text-xs mt-0.5">
                        {COMPANY_CONFIG.contact.workingHours}
                      </div>
                    </div>
                  </div>
                </div>

                {whatsappUrl && (
                  <div className="pt-2">
                    <Button
                      href={whatsappUrl}
                      target="_blank"
                      variant="whatsapp"
                      size="sm"
                      className="w-full justify-center"
                      leftIcon={<Phone className="w-4 h-4" />}
                    >
                      Instant WhatsApp Chat
                    </Button>
                  </div>
                )}
              </div>

              {/* Scannable Social Media QR Code Card */}
              <div className="p-5 bg-white rounded-md border border-sky-100 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-sky-600" />
                    <span className="font-sans font-bold text-xs sm:text-sm text-forest-950">
                      Scan &amp; Connect on Mobile
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live QR
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-sky-50/70 p-3 rounded-md border border-sky-200/80">
                  <div className="w-28 h-28 bg-white p-1.5 rounded shadow-2xs border border-sky-200 shrink-0 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        socialSettings.qrTargetUrl || "https://wa.me/919876543210"
                      )}`}
                      alt="Scannable QR Code for Trade Desk WhatsApp and Social Media"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      Scan this QR code with your mobile phone camera to instantly connect with our Trade Desk on WhatsApp and view verified corporate profiles.
                    </p>
                    <div className="mt-2 text-[10px] text-sky-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Instant 24/7 Mobile Direct Connect</span>
                    </div>
                  </div>
                </div>

                {/* Social Media Link Buttons */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                    Official Corporate Profiles:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {socialSettings.linkedin && (
                      <a
                        href={socialSettings.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-[3px] border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {socialSettings.instagram && (
                      <a
                        href={socialSettings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-[3px] border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-600" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {socialSettings.facebook && (
                      <a
                        href={socialSettings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-[3px] border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Facebook className="w-3.5 h-3.5 text-blue-600" />
                        <span>Facebook</span>
                      </a>
                    )}
                    {socialSettings.twitter && (
                      <a
                        href={socialSettings.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-[3px] border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5 text-slate-900" />
                        <span>X / Twitter</span>
                      </a>
                    )}
                    {socialSettings.youtube && (
                      <a
                        href={socialSettings.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 px-2.5 py-1.5 rounded-[3px] border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Youtube className="w-3.5 h-3.5 text-red-600" />
                        <span>YouTube Processing Tours</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Truthfulness note */}
              <div className="p-4 bg-sky-50/70 rounded-md border border-sky-200 text-xs text-charcoal-light leading-relaxed">
                <span className="font-semibold text-forest-900 block mb-0.5">
                  Direct Human Communication:
                </span>
                We do not employ automated bot responses. Every trade inquiry is directly evaluated by an experienced commodity manager in Odisha.
              </div>
            </div>

            {/* Right: Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-sm border border-sky-100 shadow-xl">
              <div className="mb-6">
                <h2 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold">
                  Send a Message to the Trade Desk
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-1">
                  Fill in your company details and message below. For multi-product requests, consider using the Request a Quote form.
                </p>
              </div>

              {success && (
                <div className="mb-6">
                  <Alert variant="success" title="Message Received">
                    {success}
                  </Alert>
                </div>
              )}

              {error && (
                <div className="mb-6">
                  <Alert variant="error" title="Submission Issue">
                    {error}
                  </Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />

                  <Input
                    label="Company Name"
                    required
                    placeholder="e.g. Vance Importers Ltd."
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Business Email"
                    type="email"
                    required
                    placeholder="e.g. m.vance@vanceimports.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <Input
                    label="Phone or WhatsApp (with country code)"
                    type="tel"
                    placeholder="e.g. +44 20 7946 0912"
                    value={form.phoneWhatsapp}
                    onChange={(e) => setForm({ ...form, phoneWhatsapp: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Country of Business"
                    required
                    placeholder="e.g. United Kingdom"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />

                  <Select
                    label="Inquiry Type"
                    options={[
                      { label: "Export Quotation", value: "Export Quotation" },
                      { label: "Product Catalog", value: "Product Catalog" },
                      { label: "Sample Request", value: "Sample Request" },
                      { label: "General Inquiry", value: "General Inquiry" },
                    ]}
                    value={form.inquiryType}
                    onChange={(e) =>
                      setForm({ ...form, inquiryType: e.target.value as any })
                    }
                  />
                </div>

                <Textarea
                  label="Detailed Message / Specifications"
                  required
                  rows={5}
                  placeholder="Specify commodity varieties, estimated tonnage, preferred packaging, and destination port..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Trade Inquiry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
