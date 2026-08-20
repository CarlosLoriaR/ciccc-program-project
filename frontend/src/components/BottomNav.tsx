import { NavLink } from 'react-router';
import { FaRegUser } from 'react-icons/fa6';
import { PiCompassRose } from 'react-icons/pi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';
import { AiOutlineMessage } from 'react-icons/ai';

const BottomNav = () => {
  const navItems = [
    { to: '/discover', label: 'Discover', icon: <PiCompassRose size={22} /> },
    { to: '/map', label: 'Map', icon: <LiaMapMarkedAltSolid size={22} /> },
    {
      to: '/schedules',
      label: 'Schedules',
      icon: <FaRegCalendarAlt size={22} />,
    },
    { to: '/chats', label: 'Chats', icon: <AiOutlineMessage size={24} /> },
    { to: '/profile', label: 'Profile', icon: <FaRegUser size={20} /> },
  ];

  return (
    <nav className="flex justify-around items-center border-t border-outline-variant bg-surface-container-low py-2 md:flex-col md:justify-start md:items-stretch md:w-64 md:h-full md:border-t-0 md:border-r md:p-4 md:gap-2 shrink-0">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-sm md:flex-row md:gap-3 md:py-3 transition-colors ${isActive ? 'bg-primary-container font-bold text-on-surface' : 'text-primary hover:bg-surface-container-high'}`
          }
        >
          <span className="flex items-center justify-center w-6 h-6">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
