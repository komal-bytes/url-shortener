import React, { useEffect, useState } from 'react';
import { Input, Button, Tabs, Tab, Spacer, Spinner, Card } from '@nextui-org/react';
import { signUpWithEmail, signInWithEmail, signInWithGitHub } from '../utils/auth';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { supabase } from '@/supabaseClient';

const ResetPassword: React.FC = () => {

    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState<Boolean | string>(false)

    async function updatePassword() {
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            toast(`Error: ${error.message}`);
            setLoading(false);
        } else {
            toast('Password updated successfully');
            setLoading("done")
        }
    }



    return (

        <>
            <div className="flex flex-col justify-start items-center h-screen p-5">
                {/* <h1 className='text-left w-full mb-10 px-3 text-primary logo select-none'>QuickLink</h1> */}

                {
                    loading === "done"
                        ?
                        <Button color='primary' onClick={() => {
                            navigate("/")
                        }}>Back to Site</Button>
                        :
                        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                            <p className="text-center mb-4 text-xl">Change Password</p>
                            <p className="text-center mb-8 text-gray-500">
                                Provide the new password for your account
                            </p>

                            <div className='relative'>
                                <Input
                                    type='password'
                                    label="New Password"
                                    placeholder='Provide a password'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    className="mb-4"
                                    isRequired={true}
                                />
                                <Button onClick={updatePassword} color='primary' fullWidth>
                                    {loading === true ? <Spinner size='sm' color='default' /> : "Update Password"}
                                </Button>
                            </div>
                        </div>
                }

            </div>
        </>

    );
};

export default ResetPassword;