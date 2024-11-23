'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from './_components/video-player';

// Define types for video and API response
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

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (!session) {
          router.push('/api/auth/signin');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed.');
      }
    };
    checkAuth();
  }, [router]);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/streams`);
        if (!response.ok) throw new Error(`Failed to fetch videos: ${response.status}`);
        const data: ApiResponse = await response.json();
        setVideos(data.videos || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching videos.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Our Videos</h1>
      {videos.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No videos available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.guid}
              className="rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow"
            >
              <VideoPlayer video={video} />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-center text-gray-700">{video.title}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
