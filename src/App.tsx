import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { Dashboard } from './pages/Dashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
      </Route>
    </Routes>
  )
}
