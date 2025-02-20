import { useRouter } from 'next/navigation';

interface ContinueButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  nextPage?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  nextPage = '/',
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (!isLoading && !disabled) {
      onClick();
      router.push(nextPage);
    }
  };

  return (
    <button
      className="w-full max-w-[400px] h-[50px] mx-auto bg-[#00C853] text-white rounded-[10px] flex items-center justify-center text-xl font-semibold disabled:opacity-50 md:max-w-full md:h-[60px] md:rounded-[10px]"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Loading...' : 'CONTINUE'}
    </button>
  );
};

export default ContinueButton;
