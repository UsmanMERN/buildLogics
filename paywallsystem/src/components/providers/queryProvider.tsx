'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const queryclient = new QueryClient()
    return (
        <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
    )
}