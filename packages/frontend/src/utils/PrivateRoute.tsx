// PrivateRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DefaultLayout from '@/layouts/default';

const PrivateRoute: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState("dashboard")
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

    if (isLoading) return null;

    return <DefaultLayout page={page} setPage={setPage}><Outlet /></DefaultLayout>;
};

export default PrivateRoute;
