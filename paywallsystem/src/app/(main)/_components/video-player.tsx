'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useCheckPremium } from '@/lib/hooks/users/use-check-premium';

interface Video {
    guid: string;
    title: string;
    videoLibraryId: string;
    playbackUrl: string;
}

interface VideoPlayerProps {
    video: Video;
}

function VideoPlayer({ video }: VideoPlayerProps) {
    const { data: isPremium, isPending, isError } = useCheckPremium();

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    if (!isPremium) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[200px] bg-gray-100">
                <p className="text-lg font-semibold text-gray-600">Upgrade to premium to view this video</p>
                <Button
                    className="mt-4"
                    onClick={() => alert('Upgrade to premium!')}
                >
                    Upgrade
                </Button>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-[200px] bg-gray-100">
                <p className="text-lg text-red-500">Error loading video.</p>
            </div>
        );
    }

    return (
        <div className="relative aspect-w-16 aspect-h-9 flex align-middle justify-center">
            <iframe
                className="rounded-lg"
                src={`https://iframe.mediadelivery.net/embed/${video.videoLibraryId}/${video.guid}?autoplay=0`}
                title={video.title}
                allow="autoplay; fullscreen"
                allowFullScreen
            />
        </div>
    );
}

export default VideoPlayer;
