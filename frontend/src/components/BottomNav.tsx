import { NavLink } from 'react-router';
import { FaRegUser } from 'react-icons/fa6';
import { PiCompassRose } from 'react-icons/pi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { LiaMapMarkedAltSolid } from 'react-icons/lia';

const BottomNav = () => {
  return (
    <nav className="flex justify-around items-center border-t border-outline-variant bg-surface-container-low py-2">
      <NavLink
        to={'/discover'}
        className={({ isActive }) =>
          `flex flex-col items-center px-4 py-2 rounded-lg text-sm ${isActive ? 'bg-primary-container font-bold text-on-surface' : 'text-primary'}`
        }
      >
        <PiCompassRose size={21} />
        <span>Discover</span>
      </NavLink>

      <NavLink
        to={'/map'}
        className={({ isActive }) =>
          `flex flex-col items-center px-4 py-2 rounded-lg text-sm ${isActive ? 'bg-primary-container font-bold text-on-surface' : 'text-primary'}`
        }
      >
        <LiaMapMarkedAltSolid size={21} />
        <span>Map</span>
      </NavLink>

      <NavLink
        to={'/schedules'}
        className={({ isActive }) =>
          `flex flex-col items-center px-4 py-2 rounded-lg text-sm ${isActive ? 'bg-primary-container font-bold text-on-surface' : 'text-primary'}`
        }
      >
        <FaRegCalendarAlt size={20} />
        <span>Schedules</span>
      </NavLink>

      <NavLink
        to={'/profile'}
        className={({ isActive }) =>
          `flex flex-col items-center px-4 py-2 rounded-lg text-sm ${isActive ? 'bg-primary-container font-bold text-on-surface' : 'text-primary'}`
        }
      >
        <FaRegUser size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
