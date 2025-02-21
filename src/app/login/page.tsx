import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import LoginButton from '@/components/LoginButton';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-8">
      <div className="text-[#1DB954] text-6xl">
        <FontAwesomeIcon icon={faSpotify} />
      </div>
      <LoginButton />
    </div>
  );
} 