async function getTrendingTopics() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data
  return [
    { id: 1, category: "Technology", name: "Next.js 15", tweets: "125K" },
    { id: 2, category: "Sports", name: "#WorldCup", tweets: "95K" },
    { id: 3, category: "Entertainment", name: "New Movie Release", tweets: "85K" },
    { id: 4, category: "Business", name: "Stock Market", tweets: "45K" },
    { id: 5, category: "Politics", name: "Election Updates", tweets: "200K" },
  ]
}

export default async function TrendingTopics() {
  const topics = await getTrendingTopics()

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter">
      <h2 className="text-xl font-medium p-5 border-b border-white/20 dark:border-slate-700/20">Trending</h2>

      <div>
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="px-5 py-4 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all cursor-pointer"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400">{topic.category}</div>
            <div className="font-medium mt-1">{topic.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{topic.tweets} posts</div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="block p-5 text-blue-500 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all border-t border-white/20 dark:border-slate-700/20"
      >
        Show more
      </a>
    </div>
  )
}

