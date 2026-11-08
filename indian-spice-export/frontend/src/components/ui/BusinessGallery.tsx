import React, { useState, useEffect } from "react";
import { Container } from "./Container";
import { Section } from "./Section";
import { X, ZoomIn } from "lucide-react";

export interface GalleryPhoto {
  id: string;
  image: string;
  alt: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "gal-1",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=85",
    alt: "Kandhamal turmeric curing and sun drying",
  },
  {
    id: "gal-2",
    image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=85",
    alt: "Assorted Indian export spices in traditional market bowls",
  },
  {
    id: "gal-3",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=1200&q=85",
    alt: "Bold green cardamom pods and spice testing",
  },
  {
    id: "gal-4",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=85",
    alt: "Maritime port container stuffing and bulk spice dispatch",
  },
  {
    id: "gal-5",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=85",
    alt: "Tellicherry bold black peppercorns and vibrant red chillies",
  },
  {
    id: "gal-6",
    image: "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?auto=format&fit=crop&w=1200&q=85",
    alt: "Eastern Ghats organic highlands grower harvest",
  },
];

export const BusinessGallery: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // Check Admin Panel toggle from localStorage
  useEffect(() => {
    const checkVisibility = () => {
      const stored = localStorage.getItem("site_gallery_visible");
      if (stored === "false") {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    checkVisibility();

    window.addEventListener("storage", checkVisibility);
    window.addEventListener("gallery-visibility-change", checkVisibility);
    return () => {
      window.removeEventListener("storage", checkVisibility);
      window.removeEventListener("gallery-visibility-change", checkVisibility);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="gallery" className="scroll-mt-28 sm:scroll-mt-32">
      <Section tone="ivory" padding="compact" className="py-8 sm:py-12">
        <Container>
          {/* Centered Single Header: Business Gallery */}
          <div className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight">
              Business Gallery
            </h2>
          </div>

          {/* Visual Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {GALLERY_PHOTOS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Subtle hover overlay with quick zoom icon */}
                <div className="absolute inset-0 bg-forest-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5 text-sky-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Lightbox Modal — Clean enlarged photo view only */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-forest-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-sky-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Only */}
            <div className="relative aspect-[16/10] bg-slate-900">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.alt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
