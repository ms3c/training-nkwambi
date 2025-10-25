"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Reservations", href: "/reservations", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      <div
        className={cn(
          "flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed lg:relative z-50",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64",
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-6 justify-between">
          {!isCollapsed && <h1 className="text-lg font-semibold text-sidebar-foreground">Training Portal</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5 lg:hidden" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center",
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true)
                  }
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
