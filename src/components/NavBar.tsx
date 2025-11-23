
"use client"

import Link from "next/link"
import {usePrivy} from "@privy-io/react-auth"
import {useEffect, useRef, useState} from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

// Simple top navigation bar built with the shadcn/ui Navigation Menu
// Add or adjust menu items as needed for your app
export default function NavBar() {
  const { authenticated, login, logout, user } = usePrivy()
  const initials = (user?.id || "U").slice(0, 2).toUpperCase()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const VERIFIED_KEY = 'zkrex_identity_verified'
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [menuOpen])

  // Read verification status from localStorage and keep it in sync
  useEffect(() => {
    function readVerification() {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem(VERIFIED_KEY) : null
        const parsed = raw ? JSON.parse(raw) : null
        setIsVerified(!!parsed?.verified)
      } catch {
        setIsVerified(false)
      }
    }
    readVerification()
    function onStorage(e: StorageEvent) {
      if (e.key === VERIFIED_KEY) {
        readVerification()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
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
              <Link href="/app" passHref>
                <NavigationMenuLink>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/app/assets" passHref>
                <NavigationMenuLink>
                  Assets
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/app/trade" passHref>
                <NavigationMenuLink>
                  Trade
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {!isVerified && (
              <NavigationMenuItem>
                <Link href="/app/verify" passHref>
                  <NavigationMenuLink>
                    Verify
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

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
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                    className="ml-2 h-8 w-8 select-none rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {initials}
                  </button>
                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-40 rounded-md border bg-popover text-popover-foreground shadow-md z-50"
                    >
                      <button
                        role="menuitem"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground rounded-md"
                        onClick={async () => {
                          setMenuOpen(false)
                          try {
                            await logout()
                          } catch (e) {
                            // ignore
                          }
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
