
"use client"

import Link from "next/link"
import {usePrivy} from "@privy-io/react-auth"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

// Simple top navigation bar built with the shadcn/ui Navigation Menu
// Add or adjust menu items as needed for your app
export default function NavBar() {
  const { authenticated, login, user } = usePrivy()
  const initials = (user?.id || "U").slice(0, 2).toUpperCase()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        {/* Brand */}
        <Link href="/" className="font-semibold text-foreground hover:opacity-90">
          ZKREX
        </Link>

        {/* Main navigation */}
        <NavigationMenu className="ml-auto">
          <NavigationMenuList>
            {/* Simple links */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/app/assets" legacyBehavior passHref>
                <NavigationMenuLink>
                  Assets
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/app/trade" legacyBehavior passHref>
                <NavigationMenuLink>
                  Trade
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/app/verify" legacyBehavior passHref>
                <NavigationMenuLink>
                  Verify
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Auth */}
            {!authenticated ? (
              <NavigationMenuItem>
                <button
                  onClick={login}
                  className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Login
                </button>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <div className="ml-2 h-8 w-8 select-none rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                  {initials}
                </div>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
