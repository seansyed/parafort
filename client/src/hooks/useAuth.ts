import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: true,
    retryOnMount: false,
    queryFn: async () => {
      const response = await fetch('/api/auth/user', {
        cache: 'no-store',
        credentials: 'include', // Include session cookies
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('=== RAW API RESPONSE ===');
      console.log('Full response:', JSON.stringify(data, null, 2));
      console.log('ClientId in response:', data.clientId);
      console.log('Response headers:', response.headers.get('X-Debug-ClientId'));
      return data;
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
