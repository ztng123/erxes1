import { ApolloError, useMutation } from "@apollo/client"

import { useToast } from "@/components/ui/use-toast"

import { mutations } from "../graphql"
import { IFeedVariable } from "../types"

const useFeedMutation = ({
  callBack,
}: {
  callBack: (result: string) => void
}) => {
  const { toast } = useToast()

  const onError = (error: ApolloError) => {
    toast({ description: error.message, variant: "destructive" })
  }

  const [feedAdd, { loading }] = useMutation(mutations.addFeed, {
    refetchQueries: ["feed"],
    onError,
  })

  const [feedEdit, { loading: loadingEdit }] = useMutation(mutations.editFeed, {
    refetchQueries: ["feed", "exmFeedDetail"],
    onError,
  })

  const [feedDelete, { loading: loadingDelete }] = useMutation(
    mutations.deleteFeed,
    {
      refetchQueries: ["feed", "exmFeedDetail"],
      onError,
    }
  )

  const [feedPin, { loading: loadingPin }] = useMutation(mutations.pinFeed, {
    refetchQueries: ["feed", "exmFeedDetail"],
    onError,
  })

  const feedMutation = (variables: IFeedVariable, _id?: string) => {
    if (!_id) {
      feedAdd({
        variables,
      }).then(() => {
        callBack("success")
      })
    }

    if (_id) {
      feedEdit({
        variables: { _id, ...variables },
      }).then(() => {
        callBack("success")
      })
    }
  }

  const deleteFeed = (_id: string) => {
    feedDelete({
      variables: { _id },
    }).then(() => {
      callBack("success")

      return toast({
        description: `Successfully Deleted`,
      })
    })
  }

  const pinFeed = (_id: string) => {
    feedPin({
      variables: { _id },
    }).then(() => {
      callBack("success")

      return toast({
        description: `Successfully Pinned`,
      })
    })
  }

  return {
    feedMutation,
    deleteFeed,
    pinFeed,
    loading: loading || loadingEdit || loadingDelete || loadingPin,
  }
}

export default useFeedMutation
