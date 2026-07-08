import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Charts from "@/pages/Charts";
import Flow from "@/pages/Flow";

import Login from "./pages/Login";
import Register from "./pages/Register";

// const Voice = lazy(() => import("@/pages/Voice"));
// import Auth from "@/pages/Auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="dashboard" element={<Dashboard mode="noaction" />} />
            <Route
              path="dashboard/view/:table"
              element={<Dashboard mode="view" />}
            />
            <Route
              path="dashboard/edit/:table"
              element={<Dashboard mode="edit" />}
            />
            <Route path="charts" element={<Charts />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="flow" element={<Flow />} />
          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
