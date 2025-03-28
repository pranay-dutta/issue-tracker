"use client";
import { Skeleton } from "@/app/components";
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
import { usePathname, useRouter } from "next/navigation";
import { AiFillBug } from "react-icons/ai";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link
              href="/"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <AiFillBug />
            </Link>
            <NavLinks />
          </Flex>
          <Flex>
            <AuthStatus />
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
};
const NavLinks = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];
  return (
    <ul className="flex space-x-6">
      {links.map(({ href, label }, i) => {
        return (
          <li key={i}>
            <Link
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
              className={classNames({
                "nav-link": true,
                "!text-zinc-900": currentPath === href,
              })}
              href={href}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status == "loading") return <Skeleton width="3rem" />;
  if (status == "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
        Login
      </Link>
    );

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar
            className="cursor-pointer"
            src={session!.user!.image!}
            radius="full"
            size="2"
            fallback="?"
            referrerPolicy="no-referrer"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <Text size="2">{session!.user?.email}</Text>
          </DropdownMenu.Label>
          <DropdownMenu.Item>
            <Link href="/api/auth/signout">Log out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};
export default Navbar;
