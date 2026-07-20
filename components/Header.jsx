import Link from "next/link";
import Logo from "./Logo";
import { Cart } from "./Icons";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Unsere Weine", href: "/weine" },
  { label: "Regionen Italiens", href: "/regionen" },
  { label: "Magazin", href: "/magazin" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Header({ active }) {
  return (
    <header className="w-full border-b border-stone/60 bg-ivory">
      <div className="mx-auto max-w-content px-6 lg:px-10">
        <div className="relative flex h-24 items-center justify-between">
          <Link href="/" aria-label="Maria Maria — Startseite">
            <Logo className="w-[100px]" />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 text-[13px] tracking-wide md:flex">
            {NAV.map((item) =>
              item.label === active ? (
                <Link key={item.label} href={item.href} className="relative font-medium text-bordeaux">
                  {item.label}
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-bordeaux" />
                </Link>
              ) : (
                <Link key={item.label} href={item.href} className="text-charcoal/80 transition-colors hover:text-bordeaux">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <a href="#" className="flex items-center gap-2 text-[13px] tracking-wide text-champagne transition-colors hover:text-bordeaux">
            <Cart className="h-4 w-4" />
            Zum offiziellen Shop
          </a>
        </div>
      </div>
    </header>
  );
}
