import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { CompanyPage } from "./pages/Company";
import { KeyPersonPage } from "./pages/KeyPerson";
import { CertificationsPage } from "./pages/Certifications";
import { FAQPage } from "./pages/FAQ";
import { ProductsPage } from "./pages/Products";
import { ProductDetailPage } from "./pages/ProductDetail";
import { ServicesPage } from "./pages/Services";
import { ExportProcessPage } from "./pages/ExportProcess";
import { ContactPage } from "./pages/Contact";
import { RequestQuotePage } from "./pages/RequestQuote";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { TermsPage } from "./pages/Terms";
import { DesignSystemPage } from "./pages/DesignSystem";
import { NotFoundPage } from "./pages/NotFound";

// Lazy load the admin bundle to keep public bundle small & decoupled
const AdminApp = lazy(() => import("./pages/Admin"));

const AdminLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0d2b1d] flex flex-col items-center justify-center text-ivory-100">
    <div className="w-10 h-10 border-3 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="font-serif text-lg tracking-wide text-gold-300">Indian Spice Export</p>
    <p className="font-sans text-xs text-ivory-300 tracking-widest uppercase mt-1">
      Loading Control Room...
    </p>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Control Room - Isolated Lazy Chunk */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminApp />
            </Suspense>
          }
        />

        {/* Public Storefront Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="key-person" element={<KeyPersonPage />} />
          <Route path="key-people" element={<Navigate to="/key-person" replace />} />
          <Route path="team" element={<Navigate to="/key-person" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="certificates" element={<Navigate to="/certifications" replace />} />
          <Route path="certification" element={<Navigate to="/certifications" replace />} />
          <Route path="faqs" element={<FAQPage />} />
          <Route path="faq" element={<Navigate to="/faqs" replace />} />
          <Route path="f-and-q" element={<Navigate to="/faqs" replace />} />
          <Route path="export-process" element={<ExportProcessPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="request-quote" element={<RequestQuotePage />} />
          <Route path="quote" element={<Navigate to="/request-quote" replace />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="design" element={<DesignSystemPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;