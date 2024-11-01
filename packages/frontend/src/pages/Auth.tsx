import React, { useEffect, useState } from 'react';
import { Input, Button, Tabs, Tab, Spacer, Spinner } from '@nextui-org/react';
import { signUpWithEmail, signInWithEmail, signInWithGitHub } from '../utils/auth';
import { FaGoogle, FaGithub } from "react-icons/fa";
import Snackbar from '@/components/common/Snackbar';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {

  const navigate = useNavigate()
  const { isOpen, type, message, openSnackbar, closeSnackbar } = useSnackbar();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [tab, setTab] = useState("LogIn")
  const [loading, setLoading] = useState<Boolean | string>(false)

  const handleloginEmailAuth = async () => {
    if (tab === "LogIn") {
      setLoading("login")
      const { error } = await signInWithEmail(loginEmail, loginPassword);
      if (error) openSnackbar(`Error Logging In. ${error.message}`, "error");
      else openSnackbar(`Logged in successfully`, "success");
    } else {
      setLoading("signup")
      const { error } = await signUpWithEmail(signupEmail, signupPassword);
      if (error) openSnackbar(`Error Signing Up. ${error.message}`, "error");
      else openSnackbar(`Signed up successfully. \n Check your mail for User confirmation.`, "success");
    }
    setLoading(false)
  };




  const handleGitHubAuth = async () => {
    setLoading("github")
    const { error } = await signInWithGitHub();
    if (error) openSnackbar(`GitHub auth error. ${error.message}`, "error");
    else {
      openSnackbar("Successfully Signed In", "success")
      navigate('/')
    }
  };



  return (

    <>
      <div className="flex flex-col justify-start items-center h-screen bg-gray-50 p-5">
        <h1 className='text-left w-full mb-10 px-3 text-primary logo select-none'>QuickLink</h1>
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <p className="text-center mb-4 text-xl">Welcome!</p>
          <p className="text-center mb-8 text-gray-500">
            Log in to your account or create a new one to get started.
          </p>

          <Tabs
            aria-label="Options"
            selectedKey={tab}
            onSelectionChange={() => {
              setTab(tab === "LogIn" ? "CreateAccount" : "LogIn")
            }}
            className='w-full'
            classNames={{
              tabList: "gap-6 p-1 w-full bg-gray-300 rounded-lg",
              tab: `w-2/3 p-1`,
              tabContent: "w-full text-md group-data-[selected=true]:text-black rounded-lg text-center"
            }}
          >
            <Tab title="Log In" key="LogIn" className='relative'>
              <Input
                type='Email'
                label="Email"
                placeholder='Provide an email'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Input
                type='password'
                label="Password"
                placeholder='Provide a password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Button onClick={handleloginEmailAuth} color='primary' fullWidth>
                {loading === "login" ? <Spinner size='sm' color='default' /> : "Log In"}
              </Button>
              <Spacer y={0.5} />
              <Button onClick={handleGitHubAuth} endContent={loading === "github" ? <Spinner size='sm' color='primary' /> : <FaGithub />} fullWidth>
                Sign In with GitHub
              </Button>
              <Spacer y={0.5} />
              <Button endContent={loading === "google" ? <Spinner size='sm' color='primary' /> : <FaGoogle />} fullWidth className=''>
                Sign In with Google
              </Button>
            </Tab>

            <Tab title="Create Account" key="CreateAccount" className='relative'>
              <Input
                type='Email'
                label="Email"
                placeholder='Provide an email'
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Input
                type='password'
                label="Password"
                placeholder='Provide a password'
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                fullWidth
                className="mb-4"
              />
              <Button onClick={handleloginEmailAuth} color="primary" fullWidth>
                {loading === "signup" ? <Spinner size='sm' color='default' /> : "Create"}
              </Button>
              <Spacer y={0.5} />
              <Button onClick={handleGitHubAuth} endContent={loading === "github" ? <Spinner size='sm' color='primary' /> : <FaGithub />} fullWidth>
                Sign Up with GitHub
              </Button>
              <Spacer y={0.5} />
              <Button endContent={loading === "google" ? <Spinner size='sm' color='primary' /> : <FaGoogle />} fullWidth>
                Sign Up with Google
              </Button>
            </Tab>
          </Tabs>

        </div>
      </div>

      {isOpen && <Snackbar message={message} onClose={closeSnackbar} type={type} />}
    </>

  );
};

export default AuthPage;