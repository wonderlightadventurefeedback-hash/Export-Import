import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-32 bg-ivory-200">
      <Container>
        <div className="max-w-xl mx-auto text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-600 flex items-center justify-center mb-6">
            <Compass className="w-8 h-8" />
          </div>

          <span className="font-serif text-sm tracking-widest text-gold-600 uppercase">
            Error 404 · Uncharted Route
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-forest-950 mt-2 mb-4">
            Spice Route Not Found
          </h1>

          <p className="text-sm sm:text-base text-charcoal-light leading-relaxed mb-8">
            The commodity record or trade documentation page you are seeking does not exist or may have been relocated in our export catalogue.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/" variant="primary" size="md">
              Return to Trade Homepage
            </Button>
            <Button
              to="/products"
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Spice Catalogue
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
