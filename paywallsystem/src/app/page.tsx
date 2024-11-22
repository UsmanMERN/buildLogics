'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

// Define types in a separate interface
interface Video {
  guid: string;
  title: string;
  videoLibraryId: string;
  playbackUrl: string;
}

interface ApiResponse {
  videos: Video[];
}

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session: Session | null = await response.json();

        if (!session) {
          router.push('/api/auth/signin');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication error');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/streams`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setVideos(data.videos || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch videos';
        setError(errorMessage);
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Videos</h1>

      {videos.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No videos available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <article
              key={video.guid}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://iframe.mediadelivery.net/embed/${video.videoLibraryId}/${video.guid}?autoplay=0`}
                  title={video.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-center">{video.title}</h2>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}