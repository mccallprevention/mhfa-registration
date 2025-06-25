/* components/ui/logo-header.tsx */
"use client";

import Image from "next/image";

interface LogoHeaderProps {
  className?: string;
}

export function LogoHeader({ className = "" }: LogoHeaderProps) {
  return (
    /*  The className prop (for margins, etc.) sits on the <a>,
        so whatever you pass from the parent still works.          */
    <a
      href="https://mccallbhn.org/"
      className={`inline-block ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* screen-reader only: announces purpose of the link */}
      <span className="sr-only">McCall Behavioral Health Network home page</span>

      {/* Pill wrapper keeps its styling exactly as before */}
      <div className="bg-white rounded-full pl-3 pr-8 py-3">
        <Image
          src="/img_assets/McCall BHN Full Color Logo.png"
          alt="McCall Behavioral Health Network"
          width={240}
          height={60}
          className="w-auto h-auto max-h-12"
          priority
        />
      </div>
    </a>
  );
}
