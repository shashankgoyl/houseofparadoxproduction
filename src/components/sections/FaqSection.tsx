import SectionHeading from "@/components/ui/SectionHeading";
import { FAQS } from "@/content/faqs";

// Server component: every question and answer is in the HTML, which is what
// search engines and AI answer engines read. <details> works without JavaScript.
export default function FaqSection() {
  return (
    <section id="faq" className="section-padding relative overflow-hidden" aria-labelledby="faq-heading">
      <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading
          id="faq-heading"
          eyebrow="Good To Know"
          title="Frequently Asked Questions"
          subtitle="Quick answers about our studio, services and how to work with us."
          centered
          className="mb-12 md:mb-16"
        />

        <div className="border-t border-gold/15">
          {FAQS.map((item, i) => (
            <details key={item.q} className="faq-item group border-b border-gold/15" open={i === 0}>
              <summary className="flex items-start justify-between gap-6 py-5 md:py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-cinzel text-base md:text-lg font-semibold text-ivory/90 group-open:text-gold transition-colors leading-snug">
                  {item.q}
                </h3>
                <span
                  className="relative mt-1.5 w-4 h-4 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-gold after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-gold after:transition-transform group-open:after:scale-y-0"
                  aria-hidden
                />
              </summary>
              <p className="font-montserrat text-sm md:text-base text-ivory/70 font-light leading-relaxed pb-6 pr-10">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
