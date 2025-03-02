import { useState, useEffect } from "react";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: user } = useQuery<User | null>({
    queryKey: [`/api/users/firebase/${firebaseUser?.uid}`],
    enabled: !!firebaseUser?.uid,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user in our backend if they don't exist
      if (result.user) {
        await apiRequest("POST", "/api/users", {
          email: result.user.email,
          name: result.user.displayName || "Anonymous",
          firebaseUid: result.user.uid,
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const signOut = () => firebaseSignOut(auth);

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}
