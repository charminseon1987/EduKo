import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);
    const [authError, setAuthError] = useState(null);

    const loginWithGoogle = async () => {
        if (!supabase) {
            setAuthError("Supabase connection not initialized. Check your credentials.");
            return;
        }
        setAuthError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError("Login failed. Check Supabase configuration.");
        }
    };

    const logout = () => supabase?.auth.signOut();

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            setAuthError("Critical: Supabase environment variables are missing.");
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkPremiumStatus(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkPremiumStatus(session.user.id);
            } else {
                setIsPremium(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkPremiumStatus = async (userId) => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('tier')
                .eq('id', userId)
                .single();

            if (data) {
                setIsPremium(data.tier === 'pro');
            } else if (error && error.code === 'PGRST116') {
                // Profile doesn't exist, create it
                const { data: userData } = await supabase.auth.getUser();
                if (userData?.user) {
                    await supabase.from('profiles').upsert({
                        id: userId,
                        email: userData.user.email,
                        tier: 'free'
                    });
                }
            }
        } catch (e) {
            console.error("Error checking premium status:", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isPremium, setIsPremium, loginWithGoogle, logout, authError }}>
            {children}
        </AuthContext.Provider>
    );
};
