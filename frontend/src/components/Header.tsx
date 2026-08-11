import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/auth/useAuth';
import { Link } from 'react-router';

const Header = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low">
      <Link to="/discover">
        <div className="flex items-center gap-2">
          <FaUsers size={24} className="text-primary" />
          <span className="text-xl font-bold text-primary">Commutal</span>
        </div>
      </Link>

      <Link to="/profile">
        <img
          src={user.avatar_url || 'https://placehold.co/200x200'}
          alt={user.display_name}
          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
        />
      </Link>
    </header>
  );
};

export default Header;
