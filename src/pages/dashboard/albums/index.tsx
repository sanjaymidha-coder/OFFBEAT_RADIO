import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AlbumsIndexPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/albums/published')
  }, [router])
  return null
} 