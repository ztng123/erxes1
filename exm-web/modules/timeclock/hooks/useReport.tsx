"use client"

import { currentUserAtom } from "@/modules/JotaiProiveder"
import { useQuery, useSubscription } from "@apollo/client"
import { useAtomValue } from "jotai"

import { queries } from "../graphql"
import { IReport } from "../types"
import { isCurrentUserAdmin } from "../utils"

export interface IUseReports {
  loading: boolean
  error: any
  reportsList: IReport[]
  reportsTotalCount: number
}

export const useReports = (
  page: number,
  perPage: number,
  startDate: string,
  endDate: string
): IUseReports => {
  const currentUser = useAtomValue(currentUserAtom)

  const { data, loading, error } = useQuery(queries.timeclockReports, {
    variables: {
      page,
      perPage,
      startDate,
      endDate,
      isCurrentUserAdmin: isCurrentUserAdmin(currentUser),
    },
  })

  const reportsList = (data || {}).timeclockReports
    ? (data || {}).timeclockReports.list
    : []

  const reportsTotalCount = (data || {}).timeclockReports
    ? (data || {}).timeclockReports.totalCount
    : 0

  return {
    reportsList,
    reportsTotalCount,
    loading,
    error,
  }
}
