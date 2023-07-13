import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Analytics />
        </QueryClientProvider>
    );
}
