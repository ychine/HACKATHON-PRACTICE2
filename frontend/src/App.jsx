import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    axios.get("/api/health").then((res) => setStatus(res.data.status));
  }, []);

  return <h1>Server status: {status}</h1>;
}