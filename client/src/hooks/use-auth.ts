import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthResponse {
  user: SupabaseUser;
  session: any;
}

interface User {
  id: string;
  email?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);

  // Check if user is logged in
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        return null;
      }

      return user ? ({ id: user.id, email: user.email } as User) : null;
    },
    retry: false,
  });

  // Set up auth state listener
  useEffect(() => {
    let mounted = true;

    // Initialize as ready after initial query
    if (!isLoadingUser) {
      setIsReady(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        if (session?.user) {
          queryClient.setQueryData(["auth", "me"], {
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          queryClient.setQueryData(["auth", "me"], null);
        }
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [queryClient, isLoadingUser]);

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(["auth", "me"], {
          id: data.user.id,
          email: data.user.email,
        });
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(["auth", "me"], {
          id: data.user.id,
          email: data.user.email,
        });
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries();
    },
  });

  return {
    user: user || null,
    isLoading: isLoadingUser || !isReady,
    isAuthenticated: !!user,
    register: registerMutation,
    login: loginMutation,
    logout: logoutMutation,
  };
}
