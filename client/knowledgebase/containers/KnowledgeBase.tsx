import gql from "graphql-tag";
import * as React from "react";
import { ChildProps, graphql } from "react-apollo";
import { setLocale } from "../../utils";
import { KnowledgeBase } from "../components";
import { connection } from "../connection";
import { IKbTopic } from "../types";
import { AppConsumer, AppProvider } from "./AppContext";
import queries from "./graphql";

type QueryResponse = {
  knowledgeBaseTopicsDetail: IKbTopic;
};

const Topic = (props: ChildProps<{}, QueryResponse>) => {
  const { data } = props;

  if (!data || data.loading || !data.knowledgeBaseTopicsDetail) {
    return null;
  }

  const { color, languageCode } = data.knowledgeBaseTopicsDetail;

  // set language
  setLocale(languageCode);

  return (
    <AppProvider>
      <AppConsumer>
        {({ activeRoute }) => {
          return (
            <KnowledgeBase {...props} color={color} activeRoute={activeRoute} />
          );
        }}
      </AppConsumer>
    </AppProvider>
  );
};

const TopicWithData = graphql<{}, QueryResponse>(gql(queries.getKbTopicQuery), {
  options: () => ({
    fetchPolicy: "network-only",
    variables: {
      topicId: connection.setting.topic_id
    }
  })
})(Topic);

export default TopicWithData;
