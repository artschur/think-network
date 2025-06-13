import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

async function getTrendingTopics() {
  
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    { id: 1, category: "Technology", name: "Next.js 15", posts: "125K" },
    { id: 2, category: "Sports", name: "#WorldCup", posts: "95K" },
    { id: 3, category: "Entertainment", name: "New Movie Release", posts: "85K" },
    { id: 4, category: "Business", name: "Stock Market", posts: "45K" },
    { id: 5, category: "Politics", name: "Election Updates", posts: "200K" },
  ]
}

export default async function TrendingTopics() {
  const topics = await getTrendingTopics()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trending</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {topics.map((topic, index) => (
          <div key={topic.id}>
            <div className="px-6 py-3 hover:bg-accent transition-all cursor-pointer">
              <div className="text-xs text-muted-foreground">{topic.category}</div>
              <div className="font-medium mt-1 text-foreground">{topic.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{topic.posts} posts</div>
            </div>
            {index < topics.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-0">
        <a href="#" className="block w-full p-4 text-primary hover:bg-accent transition-all text-center">
          Show more
        </a>
      </CardFooter>
    </Card>
  )
}

