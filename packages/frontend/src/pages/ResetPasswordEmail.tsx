import React, { useEffect, useState } from 'react';
import { Input, Button, Tabs, Tab, Spacer, Spinner, Card } from '@nextui-org/react';
import { signUpWithEmail, signInWithEmail, signInWithGitHub } from '../utils/auth';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { supabase } from '@/supabaseClient';

const ResetPasswordEmail: React.FC = () => {

    const navigate = useNavigate()
    const [resetEmail, setResetEmail] = useState('');
    const [loading, setLoading] = useState<Boolean | string>(false)

    async function sendPasswordResetEmail() {
        setLoading(true);

        const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: import.meta.env.VITE_APP_STAGE === "production" ? `${import.meta.env.VITE_APP_URL}/reset-password` : 'http://127.0.0.1:5173/reset-password',
        });

        console.log(data, "data")

        if (error) {
            console.error('Error sending password reset email:', error.message);
            toast(`Error sending password reset email: ${error.message}`)
            // return { success: false, message: error.message };
        } else {
            console.log('Password reset email sent successfully');
            toast('Password reset email sent successfully')
            // return { success: true, message: 'Password reset email sent successfully' };
        }

        setLoading(false);
    }



    return (

        <>
            <div className="flex flex-col justify-start items-center h-screen bg-gray-50 p-5">
                <h1 className='text-left w-full mb-10 px-3 text-primary logo select-none'>QuickLink</h1>
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    <p className="text-center mb-4 text-xl">Reset Password</p>
                    <p className="text-center mb-8 text-gray-500">
                        Provide the email to send the Reset Password link
                    </p>

                    <div className='relative'>
                        <Input
                            type='Email'
                            label="Email"
                            placeholder='Provide an email'
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            fullWidth
                            className="mb-4"
                            isRequired={true}
                        />
                        <Button onClick={sendPasswordResetEmail} color='primary' fullWidth>
                            {loading === true ? <Spinner size='sm' color='default' /> : "Send Link"}
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ResetPasswordEmail;