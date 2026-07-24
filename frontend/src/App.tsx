import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PageLayout from './layouts/PageLayout';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Map from './pages/Map';
import Discover from './pages/Discover';
import Schedules from './pages/Schedules';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Public Routes */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="onboarding" element={<Onboarding />} />

        {/* Private Routes */}
        <Route element={<PageLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="map" element={<Map />} />
          <Route path="discover" element={<Discover />} />
          <Route path="schedules" element={<Schedules />} />
        </Route>
        {/* </Route> */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
