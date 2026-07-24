import { FaUsers } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low">
      <div className="flex items-center gap-2">
        <FaUsers size={24} className="text-primary" />
        <span className="text-xl font-bold text-primary">Commutal</span>
      </div>

      <img
        src="https://placehold.co/200x200"
        alt="User avatar"
        className="w-10 h-10 rounded-full object-cover border border-outline-variant"
      />
    </header>
  );
};

export default Header;
