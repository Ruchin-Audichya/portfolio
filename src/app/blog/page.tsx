import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Thoughts on Cloud, Business, and Technology. Coming soon!
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
