import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {{
  useReactQueryDevTools(queryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <Stack/>
    </QueryClientProvider>
  );
}}