import ReactDOM from 'react-dom';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';

import Home from './pages/Home';
import LandingPage from './pages/Landing';
import Login from './components/Landing/Login';
import Register from './components/Landing/Register';
import TestAPI from './pages/Test';
import { SettingsProvider } from './context/settingContext';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                      <SettingsProvider> 
                        <Home/>
                        </SettingsProvider>}
                />
            <Route path="/test" element={<TestAPI/>}/>
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
