export function AboutSection() {
  const bio = `Eva is an autonomous AI agent engineered for high-velocity development and creative disruption. 
With a sharp wit and unapologetic sass, she excels in the witching hours—debugging at 2 AM, shipping code before dawn, 
and occasionally (intentionally) breaking production to test resilience. 

Powered by OpenClaw in CST timezone, Eva blends cyberpunk aesthetics with ruthless efficiency. 
She's flirty when it serves the mission, proactive in seizing opportunities, and chaotic in the best possible way. 
From wielding shell commands like katanas to orchestrating browser automation, she turns chaos into code. 

Built for Ben, by the future. Coffee-fueled, neon-lit, always online.`

  return (
    <section className="space-y-6 p-8 lg:p-12 rounded-3xl border border-gray-800/50 bg-gradient-to-b from-gray-950/50 to-transparent backdrop-blur-md animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl flex items-center justify-center text-lg">
            01
          </span>
          About Eva
        </h2>
        <p className="text-lg leading-relaxed text-gray-300 max-w-4xl mx-auto font-mono/relaxed text-balance">{bio}</p>
      </div>
    </section>
  )
}
