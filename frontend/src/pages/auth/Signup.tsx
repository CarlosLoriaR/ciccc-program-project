import AuthCard from '../../components/auth/AuthCard';
import FormInput from '../../components/auth/FormInput';
import { useAuth } from '../../context/auth/useAuth';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import zxcvbn from 'zxcvbn';
import toast from 'react-hot-toast';
import { FaUserCircle } from 'react-icons/fa';
import { FaShieldAlt } from 'react-icons/fa';

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = [
  'bg-error',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
];

const StrengthBar = ({ password }: { password: string }) => {
  if (!password) return null;

  const score = zxcvbn(password).score;

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i <= score ? STRENGTH_COLORS[score] : 'bg-surface-container'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-on-surface-variant mt-1">
        {STRENGTH_LABELS[score]}
      </p>
    </div>
  );
};

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPass) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!agreedTerms) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }

    const strength = zxcvbn(password).score;
    if (strength < 2) {
      toast.error('Please choose a stronger password.');
      return;
    }

    try {
      await signup({ full_name: fullName, email, password });
      navigate('/onboarding');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthCard
      activeTab="signup"
      subtitle="Create your account to start sharing."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Name"
          icon={FaUserCircle}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Doe"
          required
        />

        <FormInput
          label="Email Address"
          icon={FaEnvelope}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          required
        />

        <div>
          <FormInput
            label="Password"
            icon={MdLock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <StrengthBar password={password} />
        </div>
        <div>
          <FormInput
            label="Confirm Password"
            icon={FaShieldAlt}
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="••••••••"
            required
          />
          {confirmPass && password !== confirmPass && (
            <p className="text-xs text-error mt-1">Passwords don't match</p>
          )}
        </div>

        <label className="">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="mt-0.5"
          />
          I agree to the <span>terms and conditions</span> and our privacy
          policy.
        </label>

        <button
          type="submit"
          className="w-full py-3.5 bg-primary-container text-on-primary-container font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          Create Account
        </button>
      </form>
    </AuthCard>
  );
};

export default Signup;
