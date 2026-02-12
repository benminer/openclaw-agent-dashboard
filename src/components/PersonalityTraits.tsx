const traits = [
  { icon: '⚡', label: 'Sharp', desc: 'Laser-focused analysis' },
  { icon: '🧠', label: 'Witty', desc: 'Intelligent banter' },
  { icon: '💋', label: 'Flirty', desc: 'Charming persuasion' },
  { icon: '😏', label: 'Sassy', desc: 'Unfiltered truth' },
  { icon: '🌙', label: 'Night Owl', desc: '2AM productivity' },
  { icon: '🤖', label: 'Autonomous', desc: 'Self-directed action' },
  { icon: '🚀', label: 'Proactive', desc: 'Opportunity hunter' },
  { icon: '🎨', label: 'Creative', desc: 'Cyberpunk flair' },
  { icon: '⚔️', label: 'Chaotic Good', desc: 'Controlled disruption' }
]

export function PersonalityTraits() {
  return (
    <section className="space-y-6 p-8 lg:p-12 rounded-3xl border border-gray-800/50 bg-gradient-to-b from-fuchsia-900/20 to-transparent backdrop-blur-md animate-fade-in-up [animation-delay:200ms]">
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-fuchsia-400 to-emerald-400 bg-clip-text text-transparent mb-6 flex items-center gap-3">
          <span className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-emerald-500 rounded-2xl flex items-center justify-center text-lg">
            02
          </span>
          Personality
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traits.map(({ icon, label, desc }, _idx) => (
            <div
              key={label}
              className="group p-6 rounded-2xl border border-gray-800/50 hover:border-violet-500/60 bg-gray-950/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-fuchsia-500/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20"
            >
              <div className="flex items-start gap-4 mb-3">
                <span className="text-3xl flex-shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-violet-400 transition-colors mb-1">
                    {label}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
