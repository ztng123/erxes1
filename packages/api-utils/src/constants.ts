export const EMAIL_DELIVERY_STATUS = {
  PENDING: 'pending',
  RECEIVED: 'received',
  ALL: ['pending', 'received'],
};

export const WEBHOOK_TYPES = {
  CUSTOMER: 'customer',
  COMPANY: 'company',
  CONVERSATION: 'conversation',
  USER_MESSAGES: 'userMessages',
  CUSTOMER_MESSAGES: 'customerMessages',
  FORM_SUBMITTED: 'popupSubmitted',
  KNOWLEDGEBASE: 'knowledgeBaseArticle',
  CAMPAIGN: 'engageMessages',
  DEAL: 'deal',
  TASK: 'task',
  TICKET: 'ticket',
  ALL: [
    'customer',
    'company',
    'conversation',
    'userMessages',
    'customerMessages',
    'popupSubmitted',
    'knowledgeBaseArticle',
    'engageMessages',
    'deal',
    'task',
    'ticket',
  ],
};

export const MODULE_NAMES = {
  BOARD: 'board',
  BOARD_DEAL: 'dealBoards',
  BOARD_TASK: 'taskBoards',
  BOARD_TICKET: 'ticketBoards',
  BOARD_GH: 'growthHackBoards',
  PIPELINE_DEAL: 'dealPipelines',
  PIPELINE_TASK: 'taskPipelines',
  PIPELINE_TICKET: 'ticketPipelines',
  PIPELINE_GH: 'growthHackPipelines',
  STAGE_DEAL: 'dealStages',
  STAGE_TASK: 'taskStages',
  STAGE_TICKET: 'ticketStages',
  STAGE_GH: 'growthHackStages',
  CHECKLIST: 'checklist',
  CHECKLIST_ITEM: 'checkListItem',
  BRAND: 'brand',
  CHANNEL: 'channel',
  COMPANY: 'company',
  CUSTOMER: 'customer',
  DEAL: 'deal',
  EMAIL_TEMPLATE: 'emailTemplate',
  IMPORT_HISTORY: 'importHistory',
  PRODUCT: 'product',
  PRODUCT_CATEGORY: 'productCategory',
  RESPONSE_TEMPLATE: 'responseTemplate',
  CONVERSATION: 'conversation',
  TAG: 'tag',
  TASK: 'task',
  TICKET: 'ticket',
  PERMISSION: 'permission',
  USER: 'user',
  KB_TOPIC: 'knowledgeBaseTopic',
  KB_CATEGORY: 'knowledgeBaseCategory',
  KB_ARTICLE: 'knowledgeBaseArticle',
  USER_GROUP: 'userGroup',
  INTERNAL_NOTE: 'internalNote',
  PIPELINE_LABEL: 'pipelineLabel',
  PIPELINE_TEMPLATE: 'pipelineTemplate',
  GROWTH_HACK: 'growthHack',
  INTEGRATION: 'integration',
  SEGMENT: 'segment',
  ENGAGE: 'engage',
  SCRIPT: 'script',
  FIELD: 'field',
  AUTOMATION: 'automation',
  FIELD_GROUP: 'fieldGroup',
  WEBHOOK: 'webhook',
  DASHBOARD: 'dashboard',
  DASHBOARD_ITEM: 'dashboardItem'
};

export const CONTENT_TYPES = {
  CUSTOMER: 'customer',
  LEAD: 'lead',
  VISITOR: 'visitor',
  COMPANY: 'company',
  DEAL: 'deal',
  TASK: 'task',
  TICKET: 'ticket',
  CONVERSATION: 'conversation',
  USER: 'user',

  ALL: [
    'customer',
    'lead',
    'visitor',
    'company',
    'deal',
    'task',
    'ticket',
    'conversation',
    'user'
  ]
};

export const RABBITMQ_QUEUES = {
  PUT_LOG: 'putLog',
  RPC_API_TO_INTEGRATIONS: 'rpc_queue:api_to_integrations',
  RPC_API_TO_WORKERS: 'rpc_queue:api_to_workers',
  RPC_API_TO_WEBHOOK_WORKERS: 'rpc_queue:api_to_webhook_workers',
  WORKERS: 'workers',
  VISITOR_LOG: 'visitorLog',
  RPC_VISITOR_LOG: 'rpc_queue:visitorLog',
  AUTOMATIONS_TRIGGER: 'erxes-automations:trigger',
  LOG_DELETE_OLD: 'log:delete:old'
};
