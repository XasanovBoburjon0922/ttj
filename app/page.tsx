"use client"
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import { useEffect, useState } from "react";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </>
  );
}

export default Home;
