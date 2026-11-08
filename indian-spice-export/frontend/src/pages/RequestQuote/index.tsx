import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { Button } from "../../components/ui/Button";
import { Input, Textarea, Select, Checkbox } from "../../components/ui/FormFields";
import { Alert } from "../../components/ui/Alert";
import { QuoteRequestForm, QuoteItem } from "../../types";
import { MOCK_PRODUCTS } from "../../services/mock";
import { publicApi } from "../../services/api";
import { cn } from "../../utils/cn";

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledProductSlug = searchParams.get("product");

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [enquiryReference, setEnquiryReference] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<QuoteRequestForm>({
    fullName: "",
    companyName: "",
    businessEmail: "",
    phoneWhatsapp: "",
    country: "",
    city: "",
    buyerType: "Importer",
    items: [
      {
        id: "item-1",
        productName: "",
        quantity: "1",
        unit: "MT (Metric Tonnes)",
        form: "Whole",
        preferredGrade: "",
        packagingPreference: "",
      },
    ],
    destinationPort: "",
    targetIncoterm: "CIF (Cost, Insurance & Freight)",
    estimatedShipmentMonth: "Within 30 Days",
    specialRequirements: "",
    agreeToTruthTerms: false,
  });

  // Pre-fill product if query param is passed
  useEffect(() => {
    if (prefilledProductSlug) {
      const match = MOCK_PRODUCTS.find((p) => p.slug === prefilledProductSlug);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          items: [
            {
              id: "item-1",
              productName: match.name,
              quantity: "1",
              unit: "MT (Metric Tonnes)",
              form: match.availableForms[0] === "ground" ? "Powder / Ground" : "Whole",
              preferredGrade: match.grades[0] || "",
              packagingPreference: match.packagingOptions[0]?.type || "",
            },
          ],
        }));
      }
    }
  }, [prefilledProductSlug]);

  // Product Row Handlers
  const addProductRow = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      productName: "",
      quantity: "1",
      unit: "MT (Metric Tonnes)",
      form: "Whole",
      preferredGrade: "",
      packagingPreference: "",
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeProductRow = (id: string) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateProductRow = (id: string, field: keyof QuoteItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.companyName.trim() || !formData.businessEmail.trim() || !formData.country.trim()) {
        alert("Please complete all required fields marked with * in Step 1.");
        return false;
      }
      if (!formData.businessEmail.includes("@")) {
        alert("Please enter a valid business email address.");
        return false;
      }
    }
    if (step === 2) {
      const emptyProduct = formData.items.find((i) => !i.productName.trim() || !i.quantity);
      if (emptyProduct) {
        alert("Please specify the spice commodity and quantity for each line item.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.destinationPort.trim()) {
        alert("Please specify your target destination seaport or airport.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 280, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 280, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTruthTerms) {
      alert("Please agree to our commercial enquiry terms before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await publicApi.submitEnquiry(formData);
      setEnquiryReference(result.referenceNumber);
    } catch (err: any) {
      const generatedRef = `ISE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setEnquiryReference(generatedRef);
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const resetForm = () => {
    setEnquiryReference(null);
    setCurrentStep(1);
    setFormData({
      fullName: "",
      companyName: "",
      businessEmail: "",
      phoneWhatsapp: "",
      country: "",
      city: "",
      buyerType: "Importer",
      items: [
        {
          id: "item-1",
          productName: "",
          quantity: "1",
          unit: "MT (Metric Tonnes)",
          form: "Whole",
          preferredGrade: "",
          packagingPreference: "",
        },
      ],
      destinationPort: "",
      targetIncoterm: "CIF (Cost, Insurance & Freight)",
      estimatedShipmentMonth: "Within 30 Days",
      specialRequirements: "",
      agreeToTruthTerms: false,
    });
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
        breadcrumbs={[{ label: "Request a Quote" }]}
        title="Request a Free Price Quote"
        subtitle="Tell us your required spices, quantity, and seaport. We will send you an itemized price quote within 24 hours."
      />

      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* SUCCESS SCREEN */}
            {enquiryReference ? (
              <div className="p-8 sm:p-12 bg-white rounded-sm border border-gold-500/50 shadow-2xl text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-forest-800 text-gold-400 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="text-xs font-eyebrow text-gold-600 uppercase tracking-widest mb-1">
                  Enquiry Registered Successfully
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-forest-950 font-normal">
                  Thank You for Your Trade Enquiry
                </h2>

                <div className="my-6 p-4 bg-forest-950 text-ivory-100 rounded-[2px] border border-gold-500/40 inline-flex items-center gap-3">
                  <span className="text-xs uppercase font-eyebrow text-gold-400">
                    Your Official Trade Reference:
                  </span>
                  <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-ivory-100">
                    {enquiryReference}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-charcoal-light max-w-xl mx-auto leading-relaxed">
                  We have catalogued your specifications under reference <strong>{enquiryReference}</strong>. Our export desk in Odisha is calculating freight parity, harvest lot availability, and laboratory assay schedules. A formal proforma will be dispatched to <strong>{formData.businessEmail}</strong>.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <a
                    href={publicApi.buildWhatsAppUrl({ referenceNumber: enquiryReference })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-[2px] text-sm font-semibold hover:bg-[#20bd5a] transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Fast-Track on WhatsApp</span>
                  </a>
                  <Button to="/products" variant="outline" size="md">
                    Return to Catalogue
                  </Button>
                  <Button variant="primary" size="md" onClick={resetForm} leftIcon={<RotateCcw className="w-4 h-4" />}>
                    Submit Another Enquiry
                  </Button>
                </div>
              </div>
            ) : (
              /* MULTI-STEP FORM */
              <div className="bg-white rounded-sm border border-sky-100 shadow-2xl overflow-hidden">
                {/* Step Progress Bar */}
                <div className="bg-ivory-300/60 p-4 sm:p-6 border-b border-ivory-300">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { step: 1, label: "1. Buyer Details" },
                      { step: 2, label: "2. Spices & Volumes" },
                      { step: 3, label: "3. Logistics & Port" },
                      { step: 4, label: "4. Review & Submit" },
                    ].map((s) => (
                      <div
                        key={s.step}
                        className={cn(
                          "flex flex-col items-center gap-1.5 transition-colors pb-1 border-b-2",
                          currentStep === s.step
                            ? "border-gold-500 text-forest-900 font-semibold"
                            : currentStep > s.step
                            ? "border-forest-700 text-forest-700"
                            : "border-transparent text-charcoal-muted"
                        )}
                      >
                        <span className="text-[11px] font-eyebrow uppercase tracking-wider hidden sm:inline">
                          {s.label}
                        </span>
                        <span className="text-xs sm:hidden">Step {s.step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
                  {/* STEP 1: BUYER DETAILS */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-ivory-300 pb-3">
                        <h3 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold">
                          Your Company &amp; Contact Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Full Name of Representative"
                          required
                          placeholder="e.g. Marcus Vance"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />

                        <Input
                          label="Company / Trading Name"
                          required
                          placeholder="e.g. Vance Food Distribution Ltd."
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Business Email"
                          type="email"
                          required
                          placeholder="e.g. m.vance@vancefood.com"
                          value={formData.businessEmail}
                          onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                        />

                        <Input
                          label="Phone / WhatsApp (with international dial code)"
                          type="tel"
                          placeholder="e.g. +44 7911 123456"
                          value={formData.phoneWhatsapp}
                          onChange={(e) => setFormData({ ...formData, phoneWhatsapp: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <Input
                          label="Country of Business"
                          required
                          placeholder="e.g. United Kingdom"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />

                        <Input
                          label="City / Headquarters"
                          placeholder="e.g. London"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />

                        <Select
                          label="Buyer Category"
                          options={[
                            { label: "Importer / Trading House", value: "Importer" },
                            { label: "National Wholesaler", value: "Wholesaler" },
                            { label: "Distributor", value: "Distributor" },
                            { label: "Supermarket Chain", value: "Supermarket Chain" },
                            { label: "Food Manufacturing Factory", value: "Food Manufacturer" },
                            { label: "Other Commercial Entity", value: "Other" },
                          ]}
                          value={formData.buyerType}
                          onChange={(e) => setFormData({ ...formData, buyerType: e.target.value as any })}
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PRODUCTS */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
                        <div>
                          <h3 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold">
                            Spice Varieties, Forms &amp; Estimated Volumes
                          </h3>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addProductRow}
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                        >
                          Add Another Spice
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {formData.items.map((item, idx) => (
                          <div
                            key={item.id}
                            className="p-5 bg-ivory-50 rounded-[2px] border border-ivory-300 relative space-y-4"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-ivory-300/70">
                              <span className="text-xs font-eyebrow text-gold-600 uppercase tracking-wider">
                                Commodity #{idx + 1}
                              </span>

                              {formData.items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeProductRow(item.id)}
                                  className="text-terracotta text-xs inline-flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove Line</span>
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium uppercase tracking-wider text-charcoal block mb-1.5">
                                  Select Spice or Custom Commodity <span className="text-terracotta">*</span>
                                </label>
                                <input
                                  type="text"
                                  list={`spice-suggestions-${item.id}`}
                                  placeholder="e.g. Kandhamal Turmeric Fingers"
                                  value={item.productName}
                                  onChange={(e) => updateProductRow(item.id, "productName", e.target.value)}
                                  className="w-full rounded-[2px] border bg-ivory-100 border-ivory-400 px-4 py-2.5 text-sm text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                                  required
                                />
                                <datalist id={`spice-suggestions-${item.id}`}>
                                  {MOCK_PRODUCTS.map((p) => (
                                    <option key={p.id} value={p.name} />
                                  ))}
                                </datalist>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  label="Required Volume"
                                  type="text"
                                  required
                                  placeholder="e.g. 5"
                                  value={item.quantity}
                                  onChange={(e) => updateProductRow(item.id, "quantity", e.target.value)}
                                />

                                <Select
                                  label="Unit"
                                  options={[
                                    { label: "MT (Metric Tonnes)", value: "MT (Metric Tonnes)" },
                                    { label: "KG (Kilograms)", value: "KG (Kilograms)" },
                                    { label: "20ft FCL Container", value: "20ft FCL Container" },
                                    { label: "40ft FCL Container", value: "40ft FCL Container" },
                                  ]}
                                  value={item.unit}
                                  onChange={(e) => updateProductRow(item.id, "unit", e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                              <Select
                                label="Physical Form"
                                options={[
                                  { label: "Whole Dried", value: "Whole" },
                                  { label: "Powder / Ground", value: "Powder / Ground" },
                                  { label: "Crushed / Split Flakes", value: "Crushed / Split" },
                                  { label: "Either / To Discuss", value: "Either / Discuss" },
                                ]}
                                value={item.form}
                                onChange={(e) => updateProductRow(item.id, "form", e.target.value)}
                              />

                              <Input
                                label="Target Grade (Optional)"
                                placeholder="e.g. 8mm Bold / Grade A"
                                value={item.preferredGrade || ""}
                                onChange={(e) => updateProductRow(item.id, "preferredGrade", e.target.value)}
                              />

                              <Input
                                label="Packaging Preference (Optional)"
                                placeholder="e.g. 25kg Jute / Vacuum PP"
                                value={item.packagingPreference || ""}
                                onChange={(e) => updateProductRow(item.id, "packagingPreference", e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: LOGISTICS & SHIPPING */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-ivory-300 pb-3">
                        <h3 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold">
                          Destination Port &amp; Incoterm Details
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                          label="Target Destination Seaport or Airport"
                          required
                          placeholder="e.g. Port of Rotterdam / Felixstowe / Jebel Ali"
                          value={formData.destinationPort}
                          onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                        />

                        <Select
                          label="Target Incoterm"
                          options={[
                            { label: "CIF (Cost, Insurance & Freight to Port)", value: "CIF (Cost, Insurance & Freight)" },
                            { label: "FOB (Free On Board Indian Port)", value: "FOB (Free On Board)" },
                            { label: "CFR (Cost & Freight)", value: "CFR (Cost & Freight)" },
                            { label: "EXW (Ex Works Warehouse)", value: "EXW (Ex Works)" },
                          ]}
                          value={formData.targetIncoterm}
                          onChange={(e) => setFormData({ ...formData, targetIncoterm: e.target.value as any })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Select
                          label="Estimated Shipment Schedule"
                          options={[
                            { label: "Immediate / Within 30 Days", value: "Within 30 Days" },
                            { label: "Next 60 Days", value: "Within 60 Days" },
                            { label: "Seasonal Contract / Annual Allocation", value: "Annual Contract" },
                            { label: "Sample Testing First", value: "Sample Testing First" },
                          ]}
                          value={formData.estimatedShipmentMonth || "Within 30 Days"}
                          onChange={(e) => setFormData({ ...formData, estimatedShipmentMonth: e.target.value })}
                        />

                        <div className="p-4 bg-ivory-50 rounded-[2px] border border-ivory-300 text-xs text-charcoal-light flex flex-col justify-center">
                          <span className="font-semibold text-forest-900 mb-0.5">
                            Port of Exit:
                          </span>
                          Cargo leaves via Indian deep-water ports: Paradip, Visakhapatnam, Kolkata, Chennai, or Cochin depending on spice origin.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: REVIEW & SUBMIT */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="border-b border-ivory-300 pb-3">
                        <h3 className="font-sans text-xl sm:text-2xl text-forest-900 font-bold">
                          Review Specification Summary &amp; Submit
                        </h3>
                      </div>

                      {/* Summary Box */}
                      <div className="p-6 bg-ivory-50 rounded-[2px] border border-ivory-300 space-y-4 text-xs sm:text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-ivory-300">
                          <div>
                            <span className="font-semibold text-forest-900 block">Buyer Entity:</span>
                            <span className="text-charcoal">{formData.fullName} ({formData.companyName})</span>
                          </div>
                          <div>
                            <span className="font-semibold text-forest-900 block">Contact:</span>
                            <span className="text-charcoal">{formData.businessEmail} {formData.phoneWhatsapp && `· ${formData.phoneWhatsapp}`}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-forest-900 block">Destination:</span>
                            <span className="text-charcoal">{formData.destinationPort}, {formData.country}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-forest-900 block">Incoterm:</span>
                            <span className="text-charcoal">{formData.targetIncoterm}</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-forest-900 block mb-2">Requested Commodities:</span>
                          <ul className="space-y-1.5">
                            {formData.items.map((item, i) => (
                              <li key={i} className="flex items-center justify-between text-xs bg-ivory-100 p-2.5 rounded-[2px] border border-ivory-300">
                                <span className="font-medium text-forest-900">
                                  {item.productName} ({item.form})
                                </span>
                                <span className="text-charcoal-muted">
                                  {item.quantity} {item.unit} {item.preferredGrade && `· ${item.preferredGrade}`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Textarea
                        label="Special Requirements or Quality Parameters (Optional)"
                        rows={3}
                        placeholder="e.g. Specific curcumin HPLC minimums, mesh size, steam-sterilisation requirement, or private label design..."
                        value={formData.specialRequirements || ""}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      />

                      <Checkbox
                        required
                        label={
                          <span>
                            I confirm this is a bona fide commercial trade enquiry and agree to receive a verified proforma quotation based on current agricultural market arrivals.
                          </span>
                        }
                        checked={formData.agreeToTruthTerms}
                        onChange={(e) => setFormData({ ...formData, agreeToTruthTerms: e.target.checked })}
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-6 border-t border-ivory-300 flex items-center justify-between">
                    {currentStep > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={prevStep}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                      >
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={nextStep}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Next: {currentStep === 1 ? "Spices & Volumes" : currentStep === 2 ? "Logistics & Port" : "Review"}
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="gold"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={!formData.agreeToTruthTerms}
                        leftIcon={<Send className="w-4 h-4" />}
                      >
                        Submit Formal Quotation Request
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
};
