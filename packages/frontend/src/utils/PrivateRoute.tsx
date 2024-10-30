// PrivateRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            const { data, error } = await supabase.auth.getUser(session?.session?.access_token);
            if (data?.user) {
                setIsLoading(false);
            } else {
                navigate('/auth');
            }
        };

        checkSession();
    }, [navigate]);

    if (isLoading) return null; // Or a loading spinner if you prefer

    return <><Outlet /></>;
};

export default PrivateRoute;
