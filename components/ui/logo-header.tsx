import Image from "next/image";

interface LogoHeaderProps {
  className?: string;
}

export function LogoHeader({ className = "" }: LogoHeaderProps) {
  return (
    <div className={`bg-white rounded-full pl-3 pr-10 py-3 inline-block ${className}`}>
      <Image 
        src="/img_assets/McCall BHN Full Color Logo.png"
        alt="McCall Behavioral Health Network"
        width={240}
        height={60}
        className="h-12 w-auto"
        priority
      />
    </div>
  );
}