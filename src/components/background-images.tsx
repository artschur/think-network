export default function BackgroundImages() {
  return (
    <>
      {/* Abstract colorful shapes for background */}
      <div className="fixed inset-0 z-0 opacity-20 dark:opacity-10">
        {/* Top right colorful blob */}
        <div className="absolute top-[-300px] right-[-300px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 dark:from-purple-600 dark:via-blue-600 dark:to-pink-600 blur-3xl" />

        {/* Bottom left colorful blob */}
        <div className="absolute bottom-[-300px] left-[-300px] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-300 via-green-300 to-yellow-300 dark:from-blue-600 dark:via-green-600 dark:to-yellow-600 blur-3xl" />

        {/* Center small accent */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-pink-300 to-blue-300 dark:from-pink-600 dark:to-blue-600 blur-3xl opacity-30" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 z-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1520769945061-0a448c463865?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-repeat" />

      {/* Fluted glass effect - vertical lines */}
      <div
        className="fixed inset-0 z-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
          backgroundSize: '8px 100%',
        }}
      />
    </>
  );
}
