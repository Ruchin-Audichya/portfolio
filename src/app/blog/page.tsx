import { getAllPosts } from "@/lib/mdx";
import { BlogList } from "@/components/BlogList";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata = {
  title: "Blog | Ruchin Audichya",
  description: "Thoughts on engineering, design, and the future of digital experiences.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <ScrollReveal width="100%">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Transmission <span className="text-accent">Log</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Documenting the journey of building inevitable digital artifacts.
            Engineering insights, design philosophy, and technical deep dives.
          </p>
        </header>
      </ScrollReveal>

      <BlogList posts={posts} />
    </div>
  );
}
