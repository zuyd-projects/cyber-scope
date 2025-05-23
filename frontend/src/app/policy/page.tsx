import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { PolicyForm } from "@cyberscope/components/privacy-policy"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="#" prefetch={true} className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-50 w-50 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Image src={"/logo.png"} alt="Logo" width={75} height={75} />
          </div>
        </Link>
        <div className="flex items-center gap-2 self-center -mt-4">
          <p className="text-lg font-semibold -mb-4">Cyberscope</p>
        </div>
        <PolicyForm />
      </div>
    </div>
  )
}
