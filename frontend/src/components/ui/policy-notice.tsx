"use client"

import Link from "next/link"

export function PolicyNotice() {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
      By signing up, you agree to our{" "}
      <Link
        href="/policy"
        prefetch={true}
        rel="noopener noreferrer"
        className="underline underline-offset-4 cursor-pointer"
      >
        Privacy Policy
      </Link>.
    </div>
  )
}