import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Activity } from './pages/Activity'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Calendar } from './pages/Calendar'
import { Dashboard } from './pages/Dashboard'
import { Memory } from './pages/Memory'
import { Profile } from './pages/Profile'
import { Sessions } from './pages/Sessions'
import { SystemHealth } from './pages/SystemHealth'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="memory" element={<Memory />} />
        <Route path="health" element={<SystemHealth />} />
        <Route path="activity" element={<Activity />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
