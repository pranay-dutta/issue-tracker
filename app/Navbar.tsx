"use client";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillBug } from "react-icons/ai";

const links = [
  { label: "Dashboard", href: "/" },
  { label: "Issues", href: "/issues" },
];

const Navbar = () => {
  const { status, data: session } = useSession();
  const currentPath = usePathname();
  console.log();

  return (
    <nav className="border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
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
          </Flex>

          <Flex>
            <Box>
              {status == "authenticated" && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Avatar
                      src={session.user!.image!}
                      radius="full"
                      size="2"
                      fallback="?"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Label>
                      <Text size="2">{session.user?.email}</Text>
                    </DropdownMenu.Label>
                    <DropdownMenu.Item>
                      <Link href="/api/auth/signout">Log out</Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
              {status == "unauthenticated" && (
                <Link href="/api/auth/signin">Login</Link>
              )}
            </Box>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};

export default Navbar;
