import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface BlogSearchProps {
  initialQuery?: string
}

export function BlogSearch({ initialQuery = '' }: BlogSearchProps) {
  const [, setSearchParams] = useSearchParams()
  const [value, setValue] = useState(initialQuery)

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value.trim()) {
            next.set('q', value.trim())
            next.delete('page')
          } else {
            next.delete('q')
          }
          return next
        },
        { replace: true },
      )
    }, 350)

    return () => clearTimeout(timer)
  }, [value, setSearchParams])

  return (
    <div className="form-field blog-search">
      <label htmlFor="blog-search">Search blogs</label>
      <input
        id="blog-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title, excerpt, or tags…"
      />
    </div>
  )
}
