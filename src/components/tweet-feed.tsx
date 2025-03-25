import Tweet from "@/components/tweet"

async function getTweets() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock data
  return [
    {
      post: {
        id: "1",
        content: "Just launched my new website! Check it out at example.com #webdev #design",
        createdAt: "2h",
        likeCount: 28,
        commentCount: 5,
      },
      user: {
        id: "u1",
        fullName: "Jane Smith",
        username: "janesmith",
        profileImageUrl: "/placeholder.svg?height=48&width=48",
      },
      images: [
        {
          publicUrl:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2072&q=80",
        },
      ],
    },
    {
      post: {
        id: "2",
        content: "Working on a new project with React and Next.js. The App Router is amazing! #reactjs #nextjs",
        createdAt: "4h",
        likeCount: 152,
        commentCount: 8,
      },
      user: {
        id: "u2",
        fullName: "John Doe",
        username: "johndoe",
        profileImageUrl: "/placeholder.svg?height=48&width=48",
      },
      images: [],
    },
    {
      post: {
        id: "3",
        content:
          "Breaking: New AI model can generate realistic images from text descriptions with unprecedented accuracy. #AI #MachineLearning",
        createdAt: "6h",
        likeCount: 357,
        commentCount: 42,
      },
      user: {
        id: "u3",
        fullName: "Tech News",
        username: "technews",
        profileImageUrl: "/placeholder.svg?height=48&width=48",
      },
      images: [
        {
          publicUrl:
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2072&q=80",
        },
      ],
    },
    {
      post: {
        id: "4",
        content:
          "Just hiked to the top of Mount Rainier! The view is absolutely breathtaking. 🏔️ #hiking #nature #outdoors",
        createdAt: "8h",
        likeCount: 94,
        commentCount: 12,
      },
      user: {
        id: "u4",
        fullName: "Sarah Johnson",
        username: "sarahj",
        profileImageUrl: "/placeholder.svg?height=48&width=48",
      },
      images: [
        {
          publicUrl:
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80",
        },
      ],
    },
    {
      post: {
        id: "5",
        content:
          "Pro tip: Use React Server Components for data fetching and Suspense for loading states. Your app will feel much faster! #reactjs #webdev",
        createdAt: "10h",
        likeCount: 189,
        commentCount: 15,
      },
      user: {
        id: "u5",
        fullName: "Dev Tips",
        username: "devtips",
        profileImageUrl: "/placeholder.svg?height=48&width=48",
      },
      images: [],
    },
  ]
}

export default async function TweetFeed() {
  const tweets = await getTweets()

  return (
    <div className="space-y-6">
      {tweets.map((tweet) => (
        <Tweet key={tweet.post.id} tweet={tweet} />
      ))}
    </div>
  )
}

