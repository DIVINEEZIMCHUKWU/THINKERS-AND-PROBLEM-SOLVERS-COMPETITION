import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeroSlider from '@/components/common/HeroSlider'

export default function Categories() {
  const categories = [
    {
      title: "Art Drawing & Painting",
      description: "A celebration of visual creativity at every skill level. Show the world your unique perspective.",
      items: ["Pencil Drawing", "Colour Painting", "Creative Illustration", "Nature Drawing", "Cultural Art", "Abstract Art", "Digital Art"],
      ageGroups: ["Nursery", "Primary", "Junior Secondary", "Senior Secondary"]
    },
    {
      title: "French Spelling Bee & Writing",
      description: "Mastery of the French language through rigorous and expressive written and spoken competitions.",
      items: ["Spelling", "Pronunciation", "Vocabulary Development", "Essay Writing", "Creative Writing", "Dictation"],
      ageGroups: ["Nursery", "Primary", "Junior Secondary", "Senior Secondary"]
    },
    {
      title: "Creative Problem Solving",
      description: "Testing logic, innovation, and critical thinking to resolve complex real-world or theoretical challenges.",
      items: ["Innovation Projects", "Critical Thinking Tests", "STEM Creativity", "Logical Challenges"],
      ageGroups: ["Junior Secondary", "Senior Secondary"]
    }
  ]

  return (
    <div className="flex flex-col w-full min-h-screen">
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden bg-slate-900 border-b-[6px] border-transparent [border-image:linear-gradient(to_right,var(--color-destructive),var(--color-accent),var(--color-primary))_1]">
        <HeroSlider />
        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="bg-background/95 p-6 md:p-12 rounded-[2rem] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#D32F2F] via-[#F57F17] to-[#388E3C] bg-clip-text text-transparent pb-2 inline-block">COMPETITION CATEGORIES</h1>
            <p className="text-base md:text-xl text-foreground">Discover where your talents shine brightest.</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <p className="text-base md:text-xl text-muted-foreground">
            Thinkers and Problem Solvers Competition offers distinct pathways for students to showcase their unique talents on an international stage.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{cat.title}</CardTitle>
              <CardDescription className="text-base mt-2">{cat.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <h4 className="font-semibold text-sm tracking-uppercase text-muted-foreground mb-3 tracking-wider uppercase">Focus Areas</h4>
                <ul className="space-y-2">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm tracking-uppercase text-muted-foreground mb-3 tracking-wider uppercase">Age Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.ageGroups.map(age => (
                    <Badge key={age} variant="secondary">{age}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </div>
  )
}
