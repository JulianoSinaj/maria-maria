/* eslint-disable @next/next/no-img-element */
export default function Logo({ className = "w-[104px]" }) {
  return <img src="/img/logo.png" alt="Maria Maria" className={`${className} h-auto`} />;
}

export function Stemma({ className = "w-16" }) {
  return <img src="/img/stemma.png" alt="Stemma Manduria" className={`${className} h-auto`} />;
}
