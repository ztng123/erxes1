import { currentPaymentTypeAtom, modeAtom, refetchOrderAtom } from "@/store"
import { useMutation } from "@apollo/client"
import { useAtomValue, useSetAtom } from "jotai"

import { useToast } from "@/components/ui/use-toast"

import { mutations } from "../graphql"

const useAddPayment = (options?: { onError?: (errors: any) => void }) => {
  const mode = useAtomValue(modeAtom)
  const setType = useSetAtom(currentPaymentTypeAtom)
  const setRefetchOrder = useSetAtom(refetchOrderAtom)
  const { onError } = options || {}
  const { onError: error } = useToast()

  const [addPayment, { loading }] = useMutation(mutations.ordersAddPayment, {
    onCompleted() {
      mode === "main" && setType("")
      setRefetchOrder(true)
    },
    refetchQueries: ["orderDetail"],
    onError: (e) => {
      error(e)
      onError && onError(e)
    },
  })
  return { addPayment, loading }
}

export default useAddPayment
