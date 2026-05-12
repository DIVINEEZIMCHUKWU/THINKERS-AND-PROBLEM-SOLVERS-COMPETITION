import { CheckCircle2 } from "lucide-react";
import HeroSlider from '@/components/common/HeroSlider';

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <div className="mb-4 md:mb-6 inline-block py-1.5 px-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md">
              Founded 1990 — International Platform
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">ABOUT CONTEST</h1>
            <p className="text-base md:text-xl lg:text-2xl text-foreground font-serif italic max-w-3xl mx-auto">
              "Raising Creative Thinkers and Problem Solvers for the Future"
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
          <div className="bg-primary/5 p-6 md:p-8 rounded-3xl border border-primary/20 hover:shadow-lg transition-all">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-primary">Our Vision</h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              To build a generation of innovative, intelligent, and creative young leaders worldwide — empowered to make a difference in their communities and beyond.
            </p>
          </div>
          
          <div className="bg-muted/50 p-6 md:p-8 rounded-3xl border hover:shadow-lg transition-all">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 md:mb-6">Our Mission</h2>
            <ul className="space-y-3 md:space-y-4">
              {[
                "Promote creativity and academic excellence among students",
                "Discover hidden talents in arts and languages",
                "Provide international exposure for young learners",
                "Inspire students toward innovation and problem-solving",
                "Build international educational relationships across borders"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="prose prose-lg px-4 max-w-none dark:prose-invert">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-center">An International Platform</h2>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Thinkers and Problem Solvers Competition operates across three continents and is actively expanding its reach to bring quality educational competition opportunities to students in every corner of the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 not-prose">
            {[
              { region: "United Kingdom", desc: "London serves as one of our key European hubs, connecting students and schools across the UK to the international competition platform." },
              { region: "Canada", desc: "Canadian students and schools participate in both the art and language categories, with growing participation year over year." },
              { region: "Ireland", desc: "Ireland's vibrant academic community contributes a strong contingent of language and art competitors each competition cycle." },
              { region: "Africa", desc: "Nigeria, Cameroon, Ghana, and South Africa form the backbone of the competition's African presence — rich in talent, culture, and creative energy." },
              { region: "United States & Europe", desc: "Participants across the United States and broader Europe continue to grow, reflecting the competition's truly global educational mission." }
            ].map((location, idx) => (
              <div key={location.region} className="p-6 border rounded-2xl bg-card hover:shadow-md transition-all shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 text-xl font-bold">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-lg mb-2">{location.region}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{location.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
