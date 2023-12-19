"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import EbarimtMain from "@/modules/checkout/components/ebarimt/ebarimt.main"
import PaymentSheet from "@/modules/checkout/components/paymentType/paymentSheet"
import OrderDetail from "@/modules/orders/OrderDetail"
import {
  activeOrderIdAtom,
  paidAmountsAtom,
  paidOrderIdAtom,
} from "@/store/order.store"
import { useAtomValue, useSetAtom } from "jotai"

import Detail from "./components/Detail"
import Payment from "./components/Payment.main"

const Checkout = () => {
  const searchValue = useSearchParams()
  const _id = searchValue.get("orderId")
  const setActiveOrderId = useSetAtom(activeOrderIdAtom)
  const setPaidAmounts = useSetAtom(paidAmountsAtom)
  const paidOrderId = useAtomValue(paidOrderIdAtom)

  useEffect(() => {
    if (_id) {
      setActiveOrderId(_id)
      paidOrderId !== _id && setPaidAmounts([])
    }
  }, [_id, paidOrderId, setActiveOrderId, setPaidAmounts])

  return (
    <>
      <OrderDetail>
        <div className="flex max-h-screen min-h-[600px] w-auto min-w-[880px] flex-auto items-stretch">
          <Payment />
          <div className="w-5/12 rounded-3xl bg-white p-5 text-black flex flex-col">
            <Detail />
            <EbarimtMain />
          </div>
        </div>
      </OrderDetail>
      <PaymentSheet />
    </>
  )
}

export default Checkout
