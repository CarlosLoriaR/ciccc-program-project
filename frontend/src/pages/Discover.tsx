import ProfileCard from '../components/ProfileCard';
import type { User } from '../types/user';
import type { Commute } from '../types/commute';

const mockUser: User = {
  _id: '1',
  email: 'alex@example.com',
  full_name: 'Alex González',
  display_name: 'Alex González',
  avatar_url:
    'https://img.magnific.com/foto-gratis/estilo-vida-emociones-gente-concepto-casual-confiado-agradable-sonriente-mujer-asiatica-brazos-cruzados-pecho-seguro-listo-ayudar-escuchando-companeros-trabajo-participando-conversacion_1258-59335.jpg?semt=ais_hybrid&w=740&q=80',
  home_location: { type: 'Point', coordinates: [0, 0] },
  work_location: { type: 'Point', coordinates: [0, 0] },
  preferred_modes: [],
  rating_avg: 4.8, // para que dispare el badge "Top Commuter"
  rating_count: 20,
  role: 'user',
  status: 'active',
  created_at: '16/jul/26',
  updated_at: '17/jul/26',
  bio: 'Me gustan los perritos y el fútbol.',
  interests: ['Perritos', 'Gatitos', 'Fútbol'],
  total_rides: 46,
};

const mockCommute: Commute = {
  _id: 'c1',
  user_id: '1', // mismo _id que mockUser, para mantener la relación coherente
  title: 'Downtown to Burnaby',
  mode: 'transit',
  origin: {
    type: 'Point',
    coordinates: [-123.1207, 49.2827], // coords aprox. de Downtown Vancouver
    label: 'Downtown',
  },
  destination: {
    type: 'Point',
    coordinates: [-122.9805, 49.2488], // coords aprox. de Burnaby
    label: 'Burnaby',
  },
  waypoints: [],
  transit_lines: [],
  departure_time: '8:30 AM',
  return_time: '5:30 PM',
  days_of_week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  direction: 'to_work',
  seats_available: 0,
  is_active: true,
  created_at: '16/jul/2026',
  updated_at: '17/jul/2026',
};

const Discover = () => {
  return (
    <div className="p-4">
      <ProfileCard
        user={mockUser}
        commute={mockCommute}
        onSkip={() => console.log('Skipped')}
        onConnect={() => console.log('Connected')}
      />
    </div>
  );
};

export default Discover;
