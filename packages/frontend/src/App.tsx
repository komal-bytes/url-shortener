import { Outlet, Route, Routes } from "react-router-dom";
import AuthPage from "@/pages/Auth";
import Confirm from "@/pages/Confirm";
import PrivateRoute from "@/utils/PrivateRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Analytics from "@/pages/Analytics";
import Dashboard from "@/pages/Dashboard";
import Stats from "@/pages/Stats";
import ResetPassword from "@/pages/ResetPassword";
import ResetPasswordEmail from "@/pages/ResetPasswordEmail";



function App() {

  console.log(import.meta.env.VITE_API_URL)

  const [session, setSession] = useState(null)

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   console.log(session, "here")
    //   setSession(session)
    // })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => { })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route element={<AuthPage />} path="/auth" />
      <Route element={<ResetPasswordEmail />} path="/reset-email-link" />
      <Route element={<Confirm />} path="/confirm" />
      <Route path="/*" element={<PrivateRoute />}>
        <Route element={<ResetPassword />} path="reset-password" />
        <Route element={<Dashboard />} path="" />
        <Route path="analytics">
          <Route path="" element={<Analytics />} />
          <Route path=":id" element={<Stats />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
