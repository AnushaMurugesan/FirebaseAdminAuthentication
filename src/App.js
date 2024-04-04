import logo from './logo.svg';
import './App.css';
import { auth } from './pages/FirebaseConfig';
import { Routes, Route} from "react-router-dom"
import { AuthProvider } from './pages/authcontext';
import Emailverify from './pages/Userlist/userlist';
import EmailLogin from './pages/Login/login';
import ProtectiveRoute from './pages/Routes/protectiveroute';
import Emaildetails from './pages/Userdetails/userdetails';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<EmailLogin />} />
        <Route path="/" element={<ProtectiveRoute auth={auth} />}>
          <Route path="/" element={<Emailverify />} />
          <Route path="/empdetails/:id" element={<Emaildetails />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
