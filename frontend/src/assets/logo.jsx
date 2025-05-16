export const Logo = ({ className = "h-10 w-10" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="url(#paint0_linear)" />
      <path d="M70 35C70 35 60 25 50 25C40 25 30 35 30 35L50 65L70 35Z" fill="white" />
      <path d="M30 35C30 35 40 45 50 45C60 45 70 35 70 35L50 75L30 35Z" fill="white" fillOpacity="0.5" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
