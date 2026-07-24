import AuthCard from '../../components/auth/AuthCard';
import FormInput from '../../components/auth/FormInput';
import { useAuth } from '../../context/auth/useAuth';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/discover');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthCard activeTab="login" subtitle="Welcome back! Sign in to continue.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Email Address"
          icon={FaEnvelope}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          required
        />

        <FormInput
          label="Password"
          icon={MdLock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <button
          type="submit"
          className="w-full py-3.5 bg-primary-container text-on-primary-container font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Log In
        </button>
      </form>
    </AuthCard>
  );
};

export default Login;
