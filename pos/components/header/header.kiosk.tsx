"use client"

import { useRouter } from "next/navigation"
import { queries } from "@/modules/auth/graphql"
import { setInitialAtom } from "@/store/order.store"
import { useQuery } from "@apollo/client"
import { useSetAtom } from "jotai"

import Image from "@/components/ui/image"

import { AspectRatio } from "../ui/aspect-ratio"
import Loader from "../ui/loader"
import { useToast } from "../ui/use-toast"

const Header = () => {
  const { onError } = useToast()
  const router = useRouter()
  const { data, loading } = useQuery(queries.uiOptions, {
    onError,
  })
  const setInitialState = useSetAtom(setInitialAtom)
  const { uiOptions } = data?.currentConfig || {}

  const reset = () => {
    setInitialState()
    router.push("/")
  }

  if (loading) return <Loader className="h-full" />

  return (
    <div className="grid grid-cols-4 shadow-lg shadow-stone-200 flex-none">
      <AspectRatio ratio={1}>
        <Image
          src={uiOptions?.logo || "/logo-dark.png"}
          alt=""
          className="object-contain p-3"
          sizes={"25vw"}
          onClick={reset}
        />
      </AspectRatio>
      <div className="col-span-3 rounded-bl-3xl overflow-hidden">
        <AspectRatio ratio={3 / 1}>
          <Image
            src="https://scontent.fuln6-2.fna.fbcdn.net/v/t39.30808-6/286434538_488730733026531_7295981423454812952_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=05bb41&_nc_ohc=IbS_M8nfmy8AX_5oJiO&_nc_ht=scontent.fuln6-2.fna&oh=00_AfCtIYnM_ANa6gLonWB3p-HY4f9hNUAHEqXehC75ejtFBQ&oe=6516B77C"
            alt=""
            quality={100}
            className="object-cover"
            sizes={"75vw"}
          />
        </AspectRatio>
      </div>
    </div>
  )
}

export default Header
