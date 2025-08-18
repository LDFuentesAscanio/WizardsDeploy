interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'email' | 'google';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const base = 'rounded-xl font-semibold transition-colors';

  const variants = {
    primary:
      'w-full bg-[#67ff94] text-[#2c3d5a] py-3 rounded-xl font-semibold hover:bg-[#8effd2] transition-colors disabled:opacity-50',
    secondary:
      'border-2 border-[#67ff94] text-[#67ff94] py-3 rounded-xl font-semibold hover:bg-[#67ff94]/10 transition-colors disabled:opacity-50',
    email:
      'bg-[#2a2f45] text-white px-6 py-3 hover:bg-[#3b425e] shadow-[0_4px_24px_rgba(0,0,0,0.3)] w-fit',
    google:
      'bg-[#2a2f45] text-white px-7 py-[14px] hover:bg-[#3b425e] shadow-[0_4px_24px_rgba(0,0,0,0.3)] w-fit mx-auto',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
