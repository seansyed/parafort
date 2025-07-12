import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache results
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
  });
  
  return {
    user: data || null,
    isLoading,
    isAuthenticated: !!data,
  };
}