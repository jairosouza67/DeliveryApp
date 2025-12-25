import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-external";

export const useAuthRole = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthAndRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                setIsAuthenticated(true);

                const { data, error } = await supabase
                    .from("user_roles")
                    .select("role")
                    .eq("user_id", user.id)
                    .eq("role", "admin")
                    .maybeSingle();

                if (error) {
                    console.error("Error checking user role:", error);
                    setIsAdmin(false);
                } else {
                    setIsAdmin(!!data);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsAuthenticated(false);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndRole();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            checkAuthAndRole();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { isAdmin, isAuthenticated, loading };
};
