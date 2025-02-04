import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/Layout";

// Tema temporário - depois moveremos para arquivo separado
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Componentes temporários para desenvolvimento
const Dashboard = () => <div>Dashboard Page</div>;
const Login = () => <div>Login Page</div>;
const Threats = () => <div>Threats Page</div>;
const Logs = () => <div>Logs Page</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
