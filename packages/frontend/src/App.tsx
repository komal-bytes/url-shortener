import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import AuthPage from "@/pages/Auth";
import Confirm from "@/pages/Confirm";
import PrivateRoute from "@/utils/PrivateRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Analytics from "@/pages/Analytics";
import Dashboard from "@/pages/Dashboard";

function App() {

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
      <Route element={<Confirm />} path="/confirm" />
      <Route path="/*" element={<PrivateRoute />}>
        <Route element={<Dashboard />} path="" />
        <Route element={<Analytics />} path="analytics" />
      </Route>
    </Routes>
  );
}

export default App;
