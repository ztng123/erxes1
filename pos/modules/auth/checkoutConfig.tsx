import {
  allowTypesAtom,
  banFractionsAtom,
  setPermissionConfigAtom,
} from "@/store/config.store"
import { orderTypeAtom } from "@/store/order.store"
import { useQuery } from "@apollo/client"
import { useAtom, useSetAtom } from "jotai"

import Loader from "@/components/ui/loader"

import queries from "./graphql/queries"

const CheckoutConfig = ({ children }: { children: React.ReactNode }) => {
  const [allowTypes, setAllowTypes] = useAtom(allowTypesAtom)
  const setType = useSetAtom(orderTypeAtom)
  const setBanFractions = useSetAtom(banFractionsAtom)
  const setPermissionConfig = useSetAtom(setPermissionConfigAtom)

  const { loading } = useQuery(queries.getCheckoutConfig, {
    onCompleted(data) {
      const { allowTypes, banFractions, permissionConfig } =
        data?.currentConfig || {}
      setAllowTypes(allowTypes)
      if (allowTypes.length > 0) {
        setType(allowTypes[0])
        setBanFractions(banFractions)
      }
      setPermissionConfig(permissionConfig)
    },
    skip: !!allowTypes,
  })

  if (loading) return <Loader />

  return <>{children}</>
}

export default CheckoutConfig
