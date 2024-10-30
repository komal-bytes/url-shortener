import React, { useState } from 'react';
import { Input, Button, Tabs, Tab, Spacer } from '@nextui-org/react';
import { signUpWithEmail, signInWithEmail, signInWithGitHub } from '../utils/auth';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState("LogIn")

  const handleEmailAuth = async () => {
    if (tab === "LogIn") {
      const { error } = await signInWithEmail(email, password);
      if (error) alert(`Login error: ${error.message}`);
      else alert(`Logged in successfully`);
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) alert(`Sign up error: ${error.message}`);
      else alert(`Signed up successfully. Check you mail for confirmation`);
    }
  };


  const handleGitHubAuth = async () => {
    const { error } = await signInWithGitHub();
    if (error) alert(`GitHub auth error: ${error.message}`);
  };

  console.log(tab)
  const [selectedTab, setSelectedTab] = useState("");


  return (
    <div className="flex flex-col justify-start items-center h-screen bg-gray-50 p-5">
      <h1 className='text-left w-full mb-10 px-3 text-primary logo select-none'>QuickLink</h1>
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <p className="text-center mb-4 text-xl">Welcome!</p>
        <p className="text-center mb-8 text-gray-500">
          Log in to your account or create a new one to get started.
        </p>

        {/* <Tabs
          aria-label="Options"
          selectedKey={tab}
          onSelectionChange={() => {
            setTab(tab === "LogIn" ? "CreateAccount" : "LogIn")
          }}
          className='w-full'
          classNames={{
            tabList: "gap-6 p-1 w-full bg-gray-300 rounded-lg",
            // cursor: "w-2/3 bg-primary",
            tab: `w-2/3 p-0.2 [data-selected]:bg-black text-white`,
            tabContent: "py-0.5 group-data-[selected=true]:text-white group-data-[selected=true]:bg-black w-full rounded-lg text-center"
          }}
        >
          <Tab title="Log In" key="LogIn" className='relative'>
            <Input
              type='email'
              label="Email"
              placeholder='Provide an email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="mb-4"
            />
            <Input
              type='password'
              label="Password"
              placeholder='Provide a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="mb-4"
            />
            <Button onClick={handleEmailAuth} color="primary" fullWidth>
              Log In
            </Button>
            <Spacer y={0.5} />
            <Button onClick={handleGitHubAuth} color="secondary" endContent={<i className="fab fa-github" />} fullWidth>
              Sign In with GitHub
            </Button>
            <Spacer y={0.5} />
            <Button color="primary" endContent={<i className="fab fa-google" />} fullWidth>
              Sign In with Google
            </Button>
          </Tab>

          <Tab title="Create Account" key="CreateAccount" className='relative'>
            <Input
              type='email'
              label="Email"
              placeholder='Provide an email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="mb-4"
            />
            <Input
              type='password'
              label="Password"
              placeholder='Provide a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="mb-4"
            />
            <Button onClick={handleEmailAuth} color="primary" fullWidth>
              Create
            </Button>
            <Spacer y={0.5} />
            <Button onClick={handleGitHubAuth} color="secondary" endContent={<i className="fab fa-github" />} fullWidth>
              Sign Up with GitHub
            </Button>
            <Spacer y={0.5} />
            <Button endContent={<i className="fab fa-google" />} fullWidth>
              Sign Up with Google
            </Button>
          </Tab>
        </Tabs> */}

        <Tabs
          aria-label="Options"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
          className='w-[90%]'
          classNames={{
            tabList: "gap-6 w-full bg-gray-300",
            // cursor: "w-full bg-[#22d3ee]",
            // tab: "w-2/3 border border-red-500",
            tabContent: "group-data-[selected=true]:text-gray-400 text-center"
          }}
        >
          <Tab key="Calender View" title="Calender View" className='relative'>
            {/* <Calendar habitLog={habitLog} /> */}
          </Tab>
          <Tab key="Graph View" title="Graph View" className='relative'>
            {/* <Graph selectedHabit={selectedHabit} /> */}
          </Tab>
        </Tabs>

      </div>
    </div>
  );
};

export default AuthPage;