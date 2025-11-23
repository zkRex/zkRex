
"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

// Simple top navigation bar built with the shadcn/ui Navigation Menu
// Add or adjust menu items as needed for your app
export default function NavBar() {
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
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink>
                  Docs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Dropdown example */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink className="rounded-md p-3 hover:bg-accent">
                      <div className="text-sm font-medium leading-none">Blog</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        Read updates and deep dives from the team.
                      </p>
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/changelog" legacyBehavior passHref>
                    <NavigationMenuLink className="rounded-md p-3 hover:bg-accent">
                      <div className="text-sm font-medium leading-none">Changelog</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        Track new features, fixes, and improvements.
                      </p>
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/support" legacyBehavior passHref>
                    <NavigationMenuLink className="rounded-md p-3 hover:bg-accent">
                      <div className="text-sm font-medium leading-none">Support</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        Get help or contact us.
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
