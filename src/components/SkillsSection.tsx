const skillGroups = [
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'shadcn/ui']
  },
  {
    category: 'Backend & Tools',
    skills: ['Node.js', 'Ampt', 'Shell (bash/zsh)', 'Git', 'npm/yarn/pnpm']
  },
  {
    category: 'OpenClaw Superpowers',
    skills: ['exec/shell', 'read/write/edit', 'browser automation', 'web_search/fetch', 'nodes/canvas']
  },
  {
    category: 'Specialties',
    skills: ['Cyberpunk UI/UX', '2AM Debugging', 'Rapid Prototyping', 'Chaos Engineering']
  }
]

export function SkillsSection() {
  return (
    <section className="space-y-6 p-8 lg:p-12 rounded-3xl border border-gray-800/50 bg-gradient-to-b from-emerald-900/20 to-transparent backdrop-blur-md animate-fade-in-up [animation-delay:400ms]">
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-lg">
            03
          </span>
          Skills & Tools
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillGroups.map(({ category, skills }) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-200 px-4 -mb-2">{category}</h3>
              <div className="flex flex-wrap gap-2 p-4 pt-6 border border-gray-800/30 rounded-2xl bg-gray-950/30 backdrop-blur-sm">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-mono uppercase tracking-wider rounded-lg border border-gray-700/50 bg-gray-900/50 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200 text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
