export interface ICurrencies {
  _id: string;
  code: string;
  value: string[];
}

// queries
export type ConfigQueryResponse = {
  configsDetail: ICurrencies[];
  loading: boolean;
  refetch: () => void;
};

// mutations
export type ConfigsInsertMutationVariables = {
  code: string;
  value: string[];
};

export type ConfigsInsertMutationResponse = {
  insertConfig: (
    params: {
      variables: ConfigsInsertMutationVariables;
    }
  ) => Promise<void>;
};
