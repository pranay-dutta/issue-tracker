"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { Box } from "@radix-ui/themes";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Issues", href: "/issues" },
];

const Navbar = () => {
  const { status, data: session } = useSession();
  const currentPath = usePathname();

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <AiFillBug />
      </Link>
      <ul className="flex space-x-6">
        {links.map(({ href, label }, i) => {
          return (
            <li key={i}>
              <Link
                className={classNames({
                  "hover:text-zinc-800 transition-colors": true,
                  "text-zinc-900": currentPath === href,
                  "text-zinc-500": currentPath !== href,
                })}
                href={href}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <Box>
        {status == "authenticated" && (
          <Link href="/api/auth/signout">Log out</Link>
        )}
        {status == "unauthenticated" && (
          <Link href="/api/auth/signin">Login</Link>
        )}
      </Box>
    </nav>
  );
};

export default Navbar;
