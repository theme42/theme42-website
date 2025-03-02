import { useState, useEffect } from "react";
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      // Create user in our backend if they don't exist
      if (result.user) {
        await apiRequest("POST", "/api/users", {
          email: result.user.email,
          name: result.user.displayName || "Anonymous",
          firebaseUid: result.user.uid,
        });
        toast({
          title: "Successfully signed in",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Successfully signed out",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}