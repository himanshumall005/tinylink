'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDate, truncateUrl } from '@/lib/utils'

interface LinkData {
  id: string
  code: string
  url: string
  clicks: number
  createdAt: string
  lastClicked: string | null
}

export default function StatsPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const [link, setLink] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const shortUrl = `${baseUrl}/${code}`

  const fetchLink = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/links/${code}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found')
        } else {
          throw new Error('Failed to fetch link')
        }
        return
      }
      const data = await response.json()
      setLink(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [code])

  useEffect(() => {
    fetchLink()
  }, [fetchLink])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    // You could add a toast notification here
  }

  // Mock click data for visualization (in a real app, you'd fetch this from analytics)
  const getMockClickData = () => {
    if (!link || link.clicks === 0) return []
    const days = 7
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: Math.floor(Math.random() * (link.clicks / days) * 2),
      })
    }
    return data
  }

  const clickData = getMockClickData()
  const maxClicks = Math.max(...clickData.map((d) => d.clicks), 1)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading stats...</p>
        </div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error || 'Link not found'}</p>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h2 className="text-3xl font-bold text-gray-900">Link Statistics</h2>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short URL
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-primary-600">
              {shortUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              aria-label="Copy short URL"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target URL
          </label>
          <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm break-all">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              {link.url}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Total Clicks</div>
            <div className="text-2xl font-bold text-gray-900">{link.clicks}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Created</div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(link.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 mb-1">Last Clicked</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(link.lastClicked ? new Date(link.lastClicked) : null)}
            </div>
          </div>
        </div>

        {link.clicks > 0 && clickData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Clicks Over Time (Last 7 Days)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-end space-x-2 h-32">
                {clickData.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-full bg-primary-600 rounded-t transition-all"
                      style={{
                        height: `${(data.clicks / maxClicks) * 100}%`,
                        minHeight: data.clicks > 0 ? '4px' : '0',
                      }}
                      title={`${data.date}: ${data.clicks} clicks`}
                    />
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {data.date}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                * Mock data for visualization
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

