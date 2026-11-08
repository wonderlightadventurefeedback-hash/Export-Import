import React, { useState } from "react";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { PageHero } from "../../components/ui/PageHero";
import { Eyebrow } from "../../components/ui/Eyebrow";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Divider } from "../../components/ui/Divider";
import { Card } from "../../components/ui/Card";
import { ProductCard } from "../../components/ui/ProductCard";
import { CategoryTile } from "../../components/ui/CategoryTile";
import { ProcessStep } from "../../components/ui/ProcessStep";
import { FeatureItem } from "../../components/ui/FeatureItem";
import { Stat } from "../../components/ui/Stat";
import { Accordion } from "../../components/ui/Accordion";
import { Alert } from "../../components/ui/Alert";
import { Skeleton } from "../../components/ui/Skeleton";
import { Pagination } from "../../components/ui/Pagination";
import { Input, Select, Textarea, Checkbox } from "../../components/ui/FormFields";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_EXPORT_PROCESS_STEPS } from "../../services/mock";

export const DesignSystemPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full">
      <PageHero
        breadcrumbs={[{ label: "Design System" }]}
        eyebrow="Internal Component Library"
        title="Quiet Luxury Design System — Tokens & Atoms"
        subtitle="Art Direction: 'Quiet luxury, spice-route heritage'. Editorial trade journal meets private importer's showroom."
        tone="forest"
      />

      {/* 1. Color Palette Tokens */}
      <Section tone="ivory" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Color Tokens</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Brand Palette</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-[2px] bg-forest-800 text-ivory-100 flex flex-col justify-between h-32">
              <span className="text-xs uppercase font-eyebrow">Forest Green</span>
              <div>
                <div className="font-mono text-sm">#183D2C</div>
                <div className="text-[11px] opacity-80">Primary Brand</div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-forest-950 text-ivory-100 flex flex-col justify-between h-32">
              <span className="text-xs uppercase font-eyebrow">Forest 950</span>
              <div>
                <div className="font-mono text-sm">#0A1B13</div>
                <div className="text-[11px] opacity-80">Deep / Footer</div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-gold-500 text-forest-950 flex flex-col justify-between h-32">
              <span className="text-xs uppercase font-eyebrow">Spice Gold</span>
              <div>
                <div className="font-mono text-sm">#C49A45</div>
                <div className="text-[11px] opacity-80">Primary Accent</div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-ivory-200 text-charcoal border border-ivory-300 flex flex-col justify-between h-32">
              <span className="text-xs uppercase font-eyebrow">Warm Ivory</span>
              <div>
                <div className="font-mono text-sm">#F6F1E7</div>
                <div className="text-[11px] opacity-80">Base Canvas</div>
              </div>
            </div>

            <div className="p-4 rounded-[2px] bg-terracotta text-ivory-100 flex flex-col justify-between h-32">
              <span className="text-xs uppercase font-eyebrow">Terracotta</span>
              <div>
                <div className="font-mono text-sm">#9B452E</div>
                <div className="text-[11px] opacity-80">Rare Accent (~3%)</div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Typography Fluid Scales */}
      <Section tone="ivory-deep" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Typography Tokens</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Editorial Serif & Sans</h2>
          </div>

          <div className="space-y-6 bg-ivory-100 p-8 rounded-[2px] border border-ivory-300">
            <div>
              <span className="text-xs font-mono text-charcoal-muted">Display Clamp</span>
              <div className="font-display text-forest-900">
                The Essence of India. Delivered <span className="italic">Worldwide</span>.
              </div>
            </div>

            <Divider withOrnament={false} />

            <div>
              <span className="text-xs font-mono text-charcoal-muted">Heading 1</span>
              <div className="font-h1 text-forest-900">
                Direct Indian Farm Sourcing & Export
              </div>
            </div>

            <Divider withOrnament={false} />

            <div>
              <span className="text-xs font-mono text-charcoal-muted">Heading 2</span>
              <div className="font-h2 text-forest-900">
                End-to-End International Logistics
              </div>
            </div>

            <Divider withOrnament={false} />

            <div>
              <span className="text-xs font-mono text-charcoal-muted">Eyebrow Label</span>
              <div>
                <Eyebrow tone="gold">Odisha, India · B2B Spice Export</Eyebrow>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Button Variants */}
      <Section tone="ivory" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Action Atoms</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Buttons & States</h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-ivory-100 p-8 rounded-[2px] border border-ivory-300">
            <Button variant="primary">Primary Forest</Button>
            <Button variant="gold">Gold Action</Button>
            <Button variant="outline">Gold Outline</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="whatsapp">WhatsApp Button</Button>
            <Button variant="terracotta">Terracotta</Button>
            <Button variant="primary" isLoading>Loading State</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Container>
      </Section>

      {/* 4. Badges & Dividers */}
      <Section tone="ivory-deep" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Accents</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Badges & Dividers</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Badge variant="forest">Forest Badge</Badge>
            <Badge variant="gold">Gold Spec</Badge>
            <Badge variant="terracotta">Terracotta Rare</Badge>
            <Badge variant="neutral">Neutral Subdued</Badge>
            <Badge variant="outline">Outline 1px</Badge>
          </div>

          <Divider withOrnament={true} tone="gold" />
        </Container>
      </Section>

      {/* 5. Alerts & Notifications */}
      <Section tone="ivory" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Feedback Elements</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Alerts & Toasts</h2>
          </div>

          <div className="space-y-4 max-w-2xl">
            <Alert variant="info" title="Information Notice">
              Representative export samples are dispatched via DHL/FedEx with verified lot tracking.
            </Alert>
            <Alert variant="success" title="Quotation Confirmed">
              Your inquiry reference ISE-2026-00102 has been catalogued by our export desk.
            </Alert>
            <Alert variant="warning" title="Crop Season Warning">
              Cardamom auction prices are currently experiencing seasonal fluctuations in Idukki.
            </Alert>
            <Alert variant="error" title="Validation Note">
              Please provide a valid corporate business email to receive proforma documents.
            </Alert>
          </div>
        </Container>
      </Section>

      {/* 6. Form Fields */}
      <Section tone="ivory-deep" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Input Atoms</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Form Controls</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-ivory-100 p-8 rounded-[2px] border border-ivory-300 max-w-3xl">
            <Input label="Text Input" placeholder="Standard text" hint="Helpful hint below input" />
            <Input label="With Error" placeholder="Enter value" error="This field is required" defaultValue="Invalid" />
            <Select
              label="Select Dropdown"
              options={[
                { label: "Option 1 - Whole Spices", value: "1" },
                { label: "Option 2 - Ground Powder", value: "2" },
              ]}
            />
            <Textarea label="Textarea Field" rows={3} placeholder="Provide technical notes..." />
            <div className="md:col-span-2">
              <Checkbox label="I agree to the verified commercial quotation terms." />
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Product Card & Process Step Preview */}
      <Section tone="ivory" padding="compact">
        <Container>
          <div className="mb-8">
            <Eyebrow tone="gold">Composite Molecules</Eyebrow>
            <h2 className="font-h2 text-forest-900 font-normal mt-2">Product Card & Process Step</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ProductCard product={MOCK_PRODUCTS[0]} />
            </div>
            <div>
              <ProcessStep step={MOCK_EXPORT_PROCESS_STEPS[0]} />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};
