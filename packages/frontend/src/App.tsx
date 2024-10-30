import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import AuthPage from "./pages/Auth";
import Confirm from "./pages/Confirm";
import Home from "./pages/Home";
import PrivateRoute from "./utils/PrivateRoute";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {

  const [session, setSession] = useState(null)

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   console.log(session, "here")
    //   setSession(session)
    // })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(()=>{})

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route element={<AuthPage />} path="/auth" />
      <Route element={<Confirm />} path="/confirm" />
      <Route path="/*" element={<PrivateRoute />}>
        <Route element={<Home />} path="" />
      </Route>
    </Routes>
  );
}

export default App;
