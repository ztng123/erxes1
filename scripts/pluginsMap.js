module.exports = {
  inbox: {
    ui: {
      name: 'inbox',
      scope: 'inbox',
      exposes: {
        './routes': './src/routes.tsx',
        './activityLog': './src/activityLogs/activityLog.tsx',
        './automation': './src/automations/automation.tsx',
        './unreadCount': './src/inbox/containers/UnreadCount.tsx',
        './actionForms': './src/settings/integrations/containers/ActionForms'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-inbox-ui/remoteEntry.js',
        scope: 'inbox',
        module: './routes'
      },
      activityLog: './activityLog',
      automation: './automation',
      actionForms: './actionForms',
      menus: [
        {
          text: 'Team Inbox',
          url: '/inbox',
          icon: 'icon-chat',
          location: 'mainNavigation',
          permission: 'showConversations'
        },
        {
          text: 'Bookings',
          url: '/bookings',
          icon: 'icon-paste',
          location: 'mainNavigation',
          permission: 'showIntegrations'
        },
        {
          text: 'Forms',
          url: '/forms',
          icon: 'icon-laptop',
          location: 'mainNavigation',
          permission: 'showForms'
        },
        {
          text: 'Skills',
          to: '/settings/skills',
          image: '/images/icons/erxes-29.png',
          location: 'settings',
          scope: 'inbox',
          action: 'skillTypesAll',
          permissions: [
            'getSkillTypes',
            'getSkill',
            'getSkills',
            'manageSkills',
            'manageSkillTypes'
          ]
        },
        {
          text: 'Channels',
          to: '/settings/channels',
          image: '/images/icons/erxes-05.svg',
          location: 'settings',
          scope: 'inbox',
          action: 'channelsAll',
          permissions: ['showChannels', 'manageChannels']
        },
        {
          text: 'Integrations',
          to: '/settings/integrations',
          image: '/images/icons/erxes-04.svg',
          location: 'settings',
          scope: 'inbox',
          action: 'integrationsAll',
          permissions: [
            'showIntegrations',
            'integrationsCreateMessengerIntegration',
            'integrationsEditMessengerIntegration',
            'integrationsSaveMessengerAppearanceData',
            'integrationsSaveMessengerConfigs',
            'integrationsCreateLeadIntegration',
            'integrationsEditLeadIntegration',
            'integrationsRemove',
            'integrationsArchive',
            'integrationsEdit'
          ]
        },
        {
          text: 'Integrations config',
          to: '/settings/integrations-config',
          image: '/images/icons/erxes-24.svg',
          location: 'settings',
          scope: 'inbox',
          action: 'generalSettingsAll',
          permissions: ['manageGeneralSettings', 'showGeneralSettings']
        },
        {
          text: 'Responses',
          to: '/settings/response-templates',
          image: '/images/icons/erxes-10.svg',
          location: 'settings',
          scope: 'inbox',
          action: 'responseTemplatesAll',
          permissions: ['manageResponseTemplate', 'showResponseTemplates']
        },
        {
          text: 'Widget Script Manager',
          to: '/settings/scripts',
          image: '/images/icons/erxes-34.png',
          location: 'settings',
          scope: 'inbox',
          action: 'scriptsAll',
          permissions: ['manageScripts', 'showScripts']
        }
      ],
      customNavigationLabel: [
        { text: 'unreadCount', component: './unreadCount', scope: 'inbox' }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-inbox-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        inbox: {
          name: 'inbox',
          description: 'Inbox',
          actions: [
            {
              name: 'inboxAll',
              description: 'All',
              use: [
                'showConversations',
                'changeConversationStatus',
                'assignConversation',
                'conversationMessageAdd',
                'conversationResolveAll'
              ]
            },
            { name: 'showConversations', description: 'Show conversations' },
            {
              name: 'changeConversationStatus',
              description: 'Change conversation status'
            },
            { name: 'assignConversation', description: 'Assign conversation' },
            {
              name: 'conversationMessageAdd',
              description: 'Add conversation message'
            },
            {
              name: 'conversationResolveAll',
              description: 'Resolve all converstaion'
            }
          ]
        },
        integrations: {
          name: 'integrations',
          description: 'Integrations',
          actions: [
            {
              name: 'integrationsAll',
              description: 'All',
              use: [
                'showIntegrations',
                'integrationsCreateMessengerIntegration',
                'integrationsEditMessengerIntegration',
                'integrationsSaveMessengerAppearanceData',
                'integrationsSaveMessengerConfigs',
                'integrationsCreateLeadIntegration',
                'integrationsEditLeadIntegration',
                'integrationsRemove',
                'integrationsArchive',
                'integrationsEdit',
                'integrationsCreateBookingIntegration',
                'integrationsEditBookingIntegration'
              ]
            },
            { name: 'showIntegrations', description: 'Show integrations' },
            {
              name: 'integrationsCreateMessengerIntegration',
              description: 'Create messenger integration'
            },
            {
              name: 'integrationsEditMessengerIntegration',
              description: 'Edit messenger integration'
            },
            {
              name: 'integrationsSaveMessengerAppearanceData',
              description: 'Save messenger appearance data'
            },
            {
              name: 'integrationsSaveMessengerConfigs',
              description: 'Save messenger config'
            },
            {
              name: 'integrationsCreateLeadIntegration',
              description: 'Create lead integration'
            },
            {
              name: 'integrationsEditLeadIntegration',
              description: 'Edit lead integration'
            },
            { name: 'integrationsRemove', description: 'Remove integration' },
            {
              name: 'integrationsArchive',
              description: 'Archive an integration'
            },
            {
              name: 'integrationsEdit',
              description: 'Edit common integration fields'
            },
            {
              name: 'integrationsCreateBookingIntegration',
              description: 'Create booking integration'
            },
            {
              name: 'integrationsEditBookingIntegration',
              description: 'Edit booking integration'
            }
          ]
        },
        skillTypes: {
          name: 'skillTypes',
          description: 'Skill Types',
          actions: [
            {
              name: 'skillTypesAll',
              description: 'All',
              use: [
                'getSkillTypes',
                'createSkillType',
                'updateSkillType',
                'removeSkillType',
                'manageSkillTypes'
              ]
            },
            { name: 'getSkillTypes', description: 'Get skill types' },
            { name: 'createSkillType', description: 'Create skill type' },
            { name: 'updateSkillType', description: 'Update skill type' },
            { name: 'removeSkillType', description: 'Remove skill type' }
          ]
        },
        skills: {
          name: 'skills',
          description: 'Skills',
          actions: [
            {
              name: 'skillsAll',
              description: 'All',
              use: [
                'getSkill',
                'getSkills',
                'createSkill',
                'updateSkill',
                'removeSkill'
              ]
            },
            { name: 'getSkill', description: 'Get skill' },
            { name: 'getSkills', description: 'Get skills' },
            { name: 'createSkill', description: 'Create skill' },
            { name: 'updateSkill', description: 'Update skill' },
            { name: 'removeSkill', description: 'Remove skill' }
          ]
        },
        responseTemplates: {
          name: 'responseTemplates',
          description: 'Response templates',
          actions: [
            {
              name: 'responseTemplatesAll',
              description: 'All',
              use: ['manageResponseTemplate', 'showResponseTemplates']
            },
            {
              name: 'manageResponseTemplate',
              description: 'Manage response template'
            },
            {
              name: 'showResponseTemplates',
              description: 'Show response templates'
            }
          ]
        },
        channels: {
          name: 'channels',
          description: 'Channels',
          actions: [
            {
              name: 'channelsAll',
              description: 'All',
              use: ['showChannels', 'manageChannels', 'exportChannels']
            },
            { name: 'manageChannels', description: 'Manage channels' },
            { name: 'showChannels', description: 'Show channel' },
            { name: 'exportChannels', description: 'Export channels' }
          ]
        },
        scripts: {
          name: 'scripts',
          description: 'Scripts',
          actions: [
            {
              name: 'scriptsAll',
              description: 'All',
              use: ['showScripts', 'manageScripts']
            },
            { name: 'manageScripts', description: 'Manage scripts' },
            { name: 'showScripts', description: 'Show scripts' }
          ]
        }
      },
      essyncer: [
        {
          name: 'conversations',
          schema: "{ 'customFieldsData' : <nested> }",
          script:
            "if(ns.indexOf('conversations') > -1) {var createdAt = JSON.stringify(doc.createdAt); var closedAt = JSON.stringify(doc.closedAt); var updatedAt = JSON.stringify(doc.updatedAt); var firstRespondedDate = JSON.stringify(doc.firstRespondedDate); if(createdAt){ doc.numberCreatedAt = Number(new Date(createdAt.replace(/\"/g,''))); } if(closedAt){ doc.numberClosedAt = Number(new Date(closedAt.replace(/\"/g,''))); } if(updatedAt){ doc.numberUpdatedAt= Number(new Date(updatedAt.replace(/\"/g,''))); } if(firstRespondedDate){ doc.numberFirstRespondedDate= Number(new Date(firstRespondedDate.replace(/\"/g,''))); }}"
        },
        { name: 'conversation_messages', schema: '{}', script: '' },
        { name: 'integrations', schema: '{}', script: '' },
        { name: 'channels', schema: '{}', script: '' }
      ]
    }
  },
  automations: {
    ui: {
      name: 'automations',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-automations-ui/remoteEntry.js',
        scope: 'automations',
        module: './routes'
      },
      menus: [
        {
          text: 'Automations',
          url: '/automations',
          location: 'mainNavigation',
          icon: 'icon-circular',
          permission: 'showAutomations'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-automations-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        automations: {
          name: 'automations',
          description: 'Automations',
          actions: [
            {
              name: 'automationAll',
              description: 'All',
              use: [
                'showAutomations',
                'automationsAdd',
                'automationsEdit',
                'automationsRemove'
              ]
            },
            { name: 'showAutomations', description: 'Show automations' },
            { name: 'automationsAdd', description: 'Add automations' },
            { name: 'automationsEdit', description: 'Edit automations' },
            { name: 'automationsRemove', description: 'Remove automations' }
          ]
        }
      }
    }
  },
  cards: {
    ui: {
      name: 'cards',
      scope: 'cards',
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-cards-ui/remoteEntry.js',
      exposes: {
        './routes': './src/routes.tsx',
        './settings': './src/Settings.tsx',
        './propertyGroupForm': './src/propertyGroupForm.tsx',
        './segmentForm': './src/segmentForm.tsx',
        './activityLog': './src/activityLogs/activityLog.tsx',
        './automation': './src/automations/automation.tsx',
        './contactDetailRightSidebar': './src/RightSidebar.tsx',
        './selectRelation': './src/common/SelectRelation.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-cards-ui/remoteEntry.js',
        scope: 'cards',
        module: './routes'
      },
      propertyGroupForm: './propertyGroupForm',
      segmentForm: './segmentForm',
      activityLog: './activityLog',
      automation: './automation',
      contactDetailRightSidebar: './contactDetailRightSidebar',
      selectRelation: './selectRelation',
      menus: [
        {
          text: 'Sales Pipeline',
          url: '/deal',
          icon: 'icon-piggy-bank',
          location: 'mainNavigation',
          permission: 'showDeals'
        },
        {
          text: 'Task',
          url: '/task',
          icon: 'icon-file-check-alt',
          location: 'mainNavigation',
          permission: 'showTasks'
        },
        {
          text: 'Ticket',
          url: '/ticket',
          icon: 'icon-ticket',
          location: 'mainNavigation',
          permission: 'showTickets'
        },
        {
          text: 'Growth Hacking',
          url: '/growthHack',
          icon: 'icon-idea',
          location: 'mainNavigation',
          permission: 'showGrowthHacks'
        },
        {
          text: 'Sales Pipelines',
          to: '/settings/boards/deal',
          image: '/images/icons/erxes-25.png',
          location: 'settings',
          scope: 'cards',
          action: 'dealsAll',
          permissions: [
            'dealBoardsAdd',
            'dealBoardsEdit',
            'dealBoardsRemove',
            'dealPipelinesAdd',
            'dealPipelinesEdit',
            'dealPipelinesUpdateOrder',
            'dealPipelinesRemove',
            'dealPipelinesArchive',
            'dealPipelinesArchive',
            'dealStagesAdd',
            'dealStagesEdit',
            'dealStagesUpdateOrder',
            'dealStagesRemove'
          ]
        },
        {
          text: 'Task Pipelines',
          to: '/settings/boards/task',
          image: '/images/icons/erxes-13.svg',
          location: 'settings',
          scope: 'cards',
          action: 'tasksAll',
          permissions: [
            'taskBoardsAdd',
            'taskBoardsEdit',
            'taskBoardsRemove',
            'taskPipelinesAdd',
            'taskPipelinesEdit',
            'taskPipelinesUpdateOrder',
            'taskPipelinesRemove',
            'taskPipelinesArchive',
            'taskPipelinesCopied',
            'taskStagesAdd',
            'taskStagesEdit',
            'taskStagesUpdateOrder',
            'taskStagesRemove',
            'tasksAll'
          ]
        },
        {
          text: 'Ticket Pipelines',
          to: '/settings/boards/ticket',
          image: '/images/icons/erxes-19.svg',
          location: 'settings',
          scope: 'cards',
          action: 'ticketsAll',
          permissions: [
            'ticketBoardsAdd',
            'ticketBoardsEdit',
            'ticketBoardsRemove',
            'ticketPipelinesAdd',
            'ticketPipelinesEdit',
            'ticketPipelinesUpdateOrder',
            'ticketPipelinesRemove',
            'ticketPipelinesArchive',
            'ticketPipelinesCopied',
            'ticketStagesAdd',
            'ticketStagesEdit',
            'ticketStagesUpdateOrder',
            'ticketStagesRemove'
          ]
        },
        {
          text: 'Growth Hacking Templates',
          to: '/settings/boards/growthHackTemplate',
          image: '/images/icons/erxes-12.svg',
          location: 'settings',
          scope: 'cards',
          action: 'growthHacksAll',
          permissions: [
            'growthHackTemplatesAdd',
            'growthHackTemplatesEdit',
            'growthHackTemplatesRemove',
            'growthHackTemplatesDuplicate',
            'showGrowthHackTemplates'
          ]
        }
      ]
    },
    api: {
      permissions: {
        deals: {
          name: 'deals',
          description: 'Deals',
          actions: [
            {
              name: 'dealsAll',
              description: 'All',
              use: [
                'showDeals',
                'dealBoardsAdd',
                'dealBoardsEdit',
                'dealBoardsRemove',
                'dealPipelinesAdd',
                'dealPipelinesEdit',
                'dealPipelinesUpdateOrder',
                'dealPipelinesWatch',
                'dealPipelinesRemove',
                'dealPipelinesArchive',
                'dealPipelinesCopied',
                'dealStagesAdd',
                'dealStagesEdit',
                'dealStagesUpdateOrder',
                'dealStagesRemove',
                'dealsAdd',
                'dealsEdit',
                'dealsRemove',
                'dealsWatch',
                'dealsArchive',
                'dealsSort',
                'exportDeals',
                'dealUpdateTimeTracking'
              ]
            },
            { name: 'showDeals', description: 'Show deals' },
            { name: 'dealBoardsAdd', description: 'Add deal board' },
            { name: 'dealBoardsRemove', description: 'Remove deal board' },
            { name: 'dealPipelinesAdd', description: 'Add deal pipeline' },
            { name: 'dealPipelinesEdit', description: 'Edit deal pipeline' },
            {
              name: 'dealPipelinesRemove',
              description: 'Remove deal pipeline'
            },
            {
              name: 'dealPipelinesArchive',
              description: 'Archive deal pipeline'
            },
            {
              name: 'dealPipelinesCopied',
              description: 'Duplicate deal pipeline'
            },
            {
              name: 'dealPipelinesUpdateOrder',
              description: 'Update pipeline order'
            },
            { name: 'dealPipelinesWatch', description: 'Deal pipeline watch' },
            { name: 'dealStagesAdd', description: 'Add deal stage' },
            { name: 'dealStagesEdit', description: 'Edit deal stage' },
            {
              name: 'dealStagesUpdateOrder',
              description: 'Update stage order'
            },
            { name: 'dealStagesRemove', description: 'Remove deal stage' },
            { name: 'dealsAdd', description: 'Add deal' },
            { name: 'dealsEdit', description: 'Edit deal' },
            { name: 'dealsRemove', description: 'Remove deal' },
            { name: 'dealsWatch', description: 'Watch deal' },
            {
              name: 'dealsArchive',
              description: 'Archive all deals in a specific stage'
            },
            {
              name: 'dealsSort',
              description: 'Sort all deals in a specific stage'
            },
            { name: 'exportDeals', description: 'Export deals' },
            {
              name: 'dealUpdateTimeTracking',
              description: 'Update time tracking'
            }
          ]
        },
        tickets: {
          name: 'tickets',
          description: 'Tickets',
          actions: [
            {
              name: 'ticketsAll',
              description: 'All',
              use: [
                'showTickets',
                'ticketBoardsAdd',
                'ticketBoardsEdit',
                'ticketBoardsRemove',
                'ticketPipelinesAdd',
                'ticketPipelinesEdit',
                'ticketPipelinesUpdateOrder',
                'ticketPipelinesWatch',
                'ticketPipelinesRemove',
                'ticketPipelinesArchive',
                'ticketPipelinesCopied',
                'ticketStagesAdd',
                'ticketStagesEdit',
                'ticketStagesUpdateOrder',
                'ticketStagesRemove',
                'ticketsAdd',
                'ticketsEdit',
                'ticketsRemove',
                'ticketsWatch',
                'ticketsArchive',
                'ticketsSort',
                'exportTickets',
                'ticketUpdateTimeTracking'
              ]
            },
            { name: 'showTickets', description: 'Show tickets' },
            { name: 'ticketBoardsAdd', description: 'Add ticket board' },
            { name: 'ticketBoardsEdit', description: 'Edit ticket board' },
            { name: 'ticketBoardsRemove', description: 'Remove ticket board' },
            { name: 'ticketPipelinesAdd', description: 'Add ticket pipeline' },
            {
              name: 'ticketPipelinesEdit',
              description: 'Edit ticket pipeline'
            },
            {
              name: 'ticketPipelinesRemove',
              description: 'Remove ticket pipeline'
            },
            {
              name: 'ticketPipelinesArchive',
              description: 'Archive ticket pipeline'
            },
            {
              name: 'ticketPipelinesCopied',
              description: 'Duplicate ticket pipeline'
            },
            {
              name: 'ticketPipelinesWatch',
              description: 'Ticket pipeline watch'
            },
            {
              name: 'ticketPipelinesUpdateOrder',
              description: 'Update pipeline order'
            },
            { name: 'ticketStagesAdd', description: 'Add ticket stage' },
            { name: 'ticketStagesEdit', description: 'Edit ticket stage' },
            {
              name: 'ticketStagesUpdateOrder',
              description: 'Update stage order'
            },
            { name: 'ticketStagesRemove', description: 'Remove ticket stage' },
            { name: 'ticketsAdd', description: 'Add ticket' },
            { name: 'ticketsEdit', description: 'Edit ticket' },
            { name: 'ticketsRemove', description: 'Remove ticket' },
            { name: 'ticketsWatch', description: 'Watch ticket' },
            {
              name: 'ticketsArchive',
              description: 'Archive all tickets in a specific stage'
            },
            {
              name: 'ticketsSort',
              description: 'Sort all tickets in a specific stage'
            },
            { name: 'exportTickets', description: 'Export tickets' },
            {
              name: 'ticketUpdateTimeTracking',
              description: 'Update time tracking'
            }
          ]
        },
        growthHacks: {
          name: 'growthHacks',
          description: 'Growth hacking',
          actions: [
            {
              name: 'growthHacksAll',
              description: 'All',
              use: [
                'showGrowthHacks',
                'growthHackBoardsAdd',
                'growthHackBoardsEdit',
                'growthHackBoardsRemove',
                'growthHackPipelinesAdd',
                'growthHackPipelinesEdit',
                'growthHackPipelinesUpdateOrder',
                'growthHackPipelinesWatch',
                'growthHackPipelinesRemove',
                'growthHackPipelinesArchive',
                'growthHackPipelinesCopied',
                'growthHackStagesAdd',
                'growthHackStagesEdit',
                'growthHackStagesUpdateOrder',
                'growthHackStagesRemove',
                'growthHacksAdd',
                'growthHacksEdit',
                'growthHacksRemove',
                'growthHacksWatch',
                'growthHacksArchive',
                'growthHacksSort',
                'growthHackTemplatesAdd',
                'growthHackTemplatesEdit',
                'growthHackTemplatesRemove',
                'growthHackTemplatesDuplicate',
                'showGrowthHackTemplates'
              ]
            },
            { name: 'showGrowthHacks', description: 'Show growth hacks' },
            {
              name: 'growthHackBoardsAdd',
              description: 'Add growth hacking board'
            },
            {
              name: 'growthHackBoardsRemove',
              description: 'Remove growth hacking board'
            },
            {
              name: 'growthHackPipelinesAdd',
              description: 'Add growth hacking pipeline'
            },
            {
              name: 'growthHackPipelinesEdit',
              description: 'Edit growth hacking pipeline'
            },
            {
              name: 'growthHackPipelinesRemove',
              description: 'Remove growth hacking pipeline'
            },
            {
              name: 'growthHackPipelinesArchive',
              description: 'Archive growth hacking pipeline'
            },
            {
              name: 'growthHackPipelinesCopied',
              description: 'Copied growth hacking pipeline'
            },
            {
              name: 'growthHackPipelinesWatch',
              description: 'Growth hacking pipeline watch'
            },
            {
              name: 'growthHackPipelinesUpdateOrder',
              description: 'Update pipeline order'
            },
            {
              name: 'growthHackStagesAdd',
              description: 'Add growth hacking stage'
            },
            {
              name: 'growthHackStagesEdit',
              description: 'Edit growth hacking stage'
            },
            {
              name: 'growthHackStagesUpdateOrder',
              description: 'Update stage order'
            },
            {
              name: 'growthHackStagesRemove',
              description: 'Remove growth hacking stage'
            },
            { name: 'growthHacksAdd', description: 'Add growth hacking' },
            { name: 'growthHacksEdit', description: 'Edit growth hacking' },
            { name: 'growthHacksRemove', description: 'Remove growth hacking' },
            { name: 'growthHacksWatch', description: 'Watch growth hacking' },
            {
              name: 'growthHacksArchive',
              description: 'Archive all growth hacks in a specific stage'
            },
            {
              name: 'growthHacksSort',
              description: 'Sort all growth hacks in a specific stage'
            },
            {
              name: 'growthHackTemplatesAdd',
              description: 'Add growth hacking template'
            },
            {
              name: 'growthHackTemplatesEdit',
              description: 'Edit growth hacking template'
            },
            {
              name: 'growthHackTemplatesRemove',
              description: 'Remove growth hacking template'
            },
            {
              name: 'growthHackTemplatesDuplicate',
              description: 'Duplicate growth hacking template'
            },
            {
              name: 'showGrowthHackTemplates',
              description: 'Show growth hacking template'
            }
          ]
        },
        tasks: {
          name: 'tasks',
          description: 'Tasks',
          actions: [
            {
              name: 'tasksAll',
              description: 'All',
              use: [
                'showTasks',
                'taskBoardsAdd',
                'taskBoardsEdit',
                'taskBoardsRemove',
                'taskPipelinesAdd',
                'taskPipelinesEdit',
                'taskPipelinesUpdateOrder',
                'taskPipelinesWatch',
                'taskPipelinesRemove',
                'taskPipelinesArchive',
                'taskPipelinesCopied',
                'taskStagesAdd',
                'taskStagesEdit',
                'taskStagesUpdateOrder',
                'taskStagesRemove',
                'tasksAdd',
                'tasksEdit',
                'tasksRemove',
                'tasksWatch',
                'tasksArchive',
                'tasksSort',
                'taskUpdateTimeTracking',
                'exportTasks'
              ]
            },
            { name: 'showTasks', description: 'Show tasks' },
            { name: 'taskBoardsAdd', description: 'Add task board' },
            { name: 'taskBoardsRemove', description: 'Remove task board' },
            { name: 'taskPipelinesAdd', description: 'Add task pipeline' },
            { name: 'taskPipelinesEdit', description: 'Edit task pipeline' },
            {
              name: 'taskPipelinesRemove',
              description: 'Remove task pipeline'
            },
            {
              name: 'taskPipelinesArchive',
              description: 'Archive task pipeline'
            },
            {
              name: 'taskPipelinesCopied',
              description: 'Duplicate task pipeline'
            },
            { name: 'taskPipelinesWatch', description: 'Task pipeline watch' },
            {
              name: 'taskPipelinesUpdateOrder',
              description: 'Update pipeline order'
            },
            { name: 'taskStagesAdd', description: 'Add task stage' },
            { name: 'taskStagesEdit', description: 'Edit task stage' },
            {
              name: 'taskStagesUpdateOrder',
              description: 'Update stage order'
            },
            { name: 'taskStagesRemove', description: 'Remove task stage' },
            { name: 'tasksAdd', description: 'Add task' },
            { name: 'tasksEdit', description: 'Edit task' },
            { name: 'tasksRemove', description: 'Remove task' },
            { name: 'tasksWatch', description: 'Watch task' },
            {
              name: 'tasksArchive',
              description: 'Archive all tasks in a specific stage'
            },
            {
              name: 'tasksSort',
              description: 'Sort all tasks in a specific stage'
            },
            {
              name: 'taskUpdateTimeTracking',
              description: 'Update time tracking'
            },
            { name: 'exportTasks', description: 'Export tasks' }
          ]
        }
      },
      essyncer: [
        {
          name: 'deals',
          schema:
            "{ 'userId': { 'type': 'keyword' }, 'stageId': { 'type': 'keyword' }, 'modifiedBy': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'assignedUserIds': { 'type': 'keyword' }, 'watchedUserIds': { 'type': 'keyword' }, 'labelIds': { 'type': 'keyword' }, 'customFieldsData': <nested> }",
          script:
            "if(ns.indexOf('deals') > -1) { if (doc.productsData) { var productsDataString = JSON.stringify(doc.productsData); var amount = 0; var productsData = JSON.parse(productsDataString); for (var i = 0; i < productsData.length; i++){ amount = amount + productsData[i].amount; } doc.amount = amount; } } "
        },
        {
          name: 'tickets',
          schema:
            "{ 'userId': { 'type': 'keyword' }, 'stageId': { 'type': 'keyword' }, 'modifiedBy': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'assignedUserIds': { 'type': 'keyword' }, 'watchedUserIds': { 'type': 'keyword' }, 'labelIds': { 'type': 'keyword' }, 'customFieldsData': <nested> }",
          script: ''
        },
        {
          name: 'tasks',
          schema:
            "{ 'userId': { 'type': 'keyword' }, 'stageId': { 'type': 'keyword' }, 'modifiedBy': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'assignedUserIds': { 'type': 'keyword' }, 'watchedUserIds': { 'type': 'keyword' }, 'labelIds': { 'type': 'keyword' }, 'customFieldsData': <nested> }",
          script: ''
        },
        {
          name: 'tasks',
          schema:
            "{ 'userId': { 'type': 'keyword' }, 'stageId': { 'type': 'keyword' }, 'modifiedBy': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'assignedUserIds': { 'type': 'keyword' }, 'watchedUserIds': { 'type': 'keyword' }, 'labelIds': { 'type': 'keyword' }, 'customFieldsData': <nested> }",
          script: ''
        },
        { name: 'stages', schema: '{}', script: '' },
        { name: 'pipelines', schema: '{}', script: '' }
      ]
    }
  },
  clientportal: {
    ui: {
      name: 'clientportal',
      scope: 'clientportal',
      exposes: {
        './routes': './src/routes.tsx',
        './cardDetailAction': './src/containers/comments/CardDetailAction.tsx',
        './fieldConfig': './src/containers/FieldConfigForm.tsx'
      },
      cardDetailAction: './cardDetailAction',
      fieldConfig: './fieldConfig',
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-clientportal-ui/remoteEntry.js',
        scope: 'clientportal',
        module: './routes'
      },
      menus: [
        {
          text: 'Client Portal',
          to: '/settings/client-portal',
          image: '/images/icons/erxes-32.png',
          location: 'settings',
          scope: 'clientportal',
          action: '',
          permissions: []
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-clientportal-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        clientPortal: {
          name: 'clientPortal',
          description: 'Client portal',
          actions: [
            { name: 'manageClientPortal', description: 'Manage client portal' },
            { name: 'updateUser', description: 'Update user' }
          ]
        }
      }
    }
  },
  contacts: {
    ui: {
      name: 'contacts',
      scope: 'contacts',
      exposes: {
        './routes': './src/routes.tsx',
        './activityLog': './src/activityLogs/activityLog.tsx',
        './automation': './src/automations/automation.tsx',
        './contactDetailHeader': './src/customers/containers/LeadState',
        './selectRelation': './src/relation/SelectRelation.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-contacts-ui/remoteEntry.js',
        scope: 'contacts',
        module: './routes'
      },
      activityLog: './activityLog',
      automation: './automation',
      selectRelation: './selectRelation',
      contactDetailHeader: './contactDetailHeader',
      menus: [
        {
          text: 'Contacts',
          url: '/contacts/customer',
          icon: 'icon-users',
          location: 'mainNavigation',
          permission: 'showCustomers'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-contacts-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        companies: {
          name: 'companies',
          description: 'Companies',
          actions: [
            {
              name: 'companiesAll',
              description: 'All',
              use: [
                'companiesAdd',
                'companiesEdit',
                'companiesRemove',
                'companiesMerge',
                'showCompanies',
                'showCompaniesMain',
                'exportCompanies'
              ]
            },
            { name: 'companiesAdd', description: 'Add companies' },
            { name: 'companiesEdit', description: 'Edit companies' },
            { name: 'companiesRemove', description: 'Remove companies' },
            { name: 'companiesMerge', description: 'Merge companies' },
            { name: 'showCompanies', description: 'Show companies' },
            { name: 'showCompaniesMain', description: 'Show companies main' },
            {
              name: 'exportCompanies',
              description: 'Export companies to xls file'
            }
          ]
        },
        customers: {
          name: 'customers',
          description: 'Customers',
          actions: [
            {
              name: 'customersAll',
              description: 'All',
              use: [
                'showCustomers',
                'customersAdd',
                'customersEdit',
                'customersMerge',
                'customersRemove',
                'exportCustomers',
                'customersChangeState'
              ]
            },
            { name: 'exportCustomers', description: 'Export customers' },
            { name: 'showCustomers', description: 'Show customers' },
            { name: 'customersAdd', description: 'Add customer' },
            { name: 'customersEdit', description: 'Edit customer' },
            { name: 'customersMerge', description: 'Merge customers' },
            { name: 'customersRemove', description: 'Remove customers' },
            {
              name: 'customersChangeState',
              description: 'Change customer state'
            }
          ]
        }
      },
      essyncer: [
        {
          name: 'customers',
          schema:
            "{'createdAt': { 'type': 'date' }, 'organizationId': { 'type': 'keyword' }, 'state': { 'type': 'keyword' }, 'primaryEmail': { 'type': 'text', 'analyzer': 'uax_url_email_analyzer' }, 'primaryPhone': { 'type': 'text', 'fields': { 'raw': { 'type': 'keyword' } } }, 'primaryAddress': { 'type': 'text', 'fields': { 'raw': { 'type': 'keyword' } } }, 'code': { 'type': 'text', 'fields': { 'raw': { 'type': 'keyword' } } }, 'integrationId': { 'type': 'keyword' }, 'relatedIntegrationIds': { 'type': 'keyword' }, 'scopeBrandIds': { 'type': 'keyword' }, 'ownerId': { 'type': 'keyword' }, 'position': { 'type': 'keyword' }, 'leadStatus': { 'type': 'keyword' }, 'tagIds': { 'type': 'keyword' }, 'companyIds': { 'type': 'keyword' }, 'mergedIds': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'emailValidationStatus': { 'type': 'keyword' }, 'customFieldsData': <nested>, 'trackedData': <nested>}",
          script:
            "if (ns.indexOf('customers') > -1) { if (doc.urlVisits) { delete doc.urlVisits } if (doc.trackedDataBackup) { delete doc.trackedDataBackup } if (doc.customFieldsDataBackup) { delete doc.customFieldsDataBackup } if (doc.messengerData) { delete doc.messengerData }}"
        },
        {
          name: 'companies',
          schema:
            "{ 'createdAt': { 'type': 'date' }, 'primaryEmail': { 'type': 'text', 'analyzer': 'uax_url_email_analyzer' }, 'primaryName': { 'type': 'text', 'fields': { 'raw': { 'type': 'keyword' } } }, 'primaryAddress': { 'type': 'text', 'fields': { 'raw': { 'type': 'keyword' } } }, 'scopeBrandIds': { 'type': 'keyword' }, 'plan': { 'type': 'keyword' }, 'industry': { 'type': 'keyword' }, 'parentCompanyId': { 'type': 'keyword' }, 'ownerId': { 'type': 'keyword' }, 'tagIds': { 'type': 'keyword' }, 'mergedIds': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'businessType': { 'type': 'keyword' }, 'customFieldsData' : <nested>, 'trackedData': <nested> }",
          script: ''
        }
      ]
    }
  },
  dashboard: {
    ui: {
      name: 'dashboard',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-dashboard-ui/remoteEntry.js',
        scope: 'dashboard',
        module: './routes'
      },
      menus: [
        {
          text: 'Reports',
          url: '/dashboard',
          icon: 'icon-dashboard',
          location: 'mainNavigation',
          permission: 'showDashboards'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-dashboard-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        dashboards: {
          name: 'dashboards',
          description: 'Dashboards',
          actions: [
            {
              name: 'dashboardsAll',
              description: 'All',
              use: [
                'showDashboards',
                'dashboardAdd',
                'dashboardEdit',
                'dashboardRemove',
                'dashboardItemAdd',
                'dashboardItemEdit',
                'dashboardItemRemove'
              ]
            },
            { name: 'dashboardAdd', description: 'Add dashboard' },
            { name: 'dashboardEdit', description: 'Edit dashboard' },
            { name: 'dashboardRemove', description: 'Remove dashboard' },
            { name: 'dashboardItemAdd', description: 'Add dashboard item' },
            { name: 'dashboardItemEdit', description: 'Edit dashboard item' },
            {
              name: 'dashboardItemRemove',
              description: 'Remove dashboard item'
            },
            { name: 'showDashboards', description: 'Show dashboards' }
          ]
        }
      }
    }
  },
  emailtemplates: {
    ui: {
      name: 'emailtemplates',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-emailtemplates-ui/remoteEntry.js',
        scope: 'emailtemplates',
        module: './routes'
      },
      menus: [
        {
          text: 'Email Templates',
          to: '/settings/email-templates',
          image: '/images/icons/erxes-09.svg',
          location: 'settings',
          scope: 'emailtemplates',
          action: 'emailTemplateAll',
          permissions: ['showEmailTemplates']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-emailtemplates-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        emailTemplates: {
          name: 'emailTemplates',
          description: 'Email template',
          actions: [
            {
              name: 'emailTemplateAll',
              description: 'All',
              use: ['showEmailTemplates', 'manageEmailTemplate']
            },
            {
              name: 'manageEmailTemplate',
              description: 'Manage email template'
            },
            { name: 'showEmailTemplates', description: 'Show email templates' }
          ]
        }
      }
    }
  },
  engages: {
    ui: {
      name: 'engages',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-engages-ui/remoteEntry.js',
        scope: 'engages',
        module: './routes'
      },
      menus: [
        {
          text: 'Campaigns',
          url: '/campaigns',
          icon: 'icon-megaphone',
          location: 'mainNavigation',
          permission: 'showEngagesMessages'
        },
        {
          text: 'Campaign settings',
          to: '/settings/campaign-configs',
          image: '/images/icons/erxes-08.svg',
          location: 'settings',
          scope: 'engages',
          action: 'engagesAll',
          permissions: ['showEngagesMessages']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-engages-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        engages: {
          name: 'engages',
          description: 'Campaigns',
          actions: [
            {
              name: 'engagesAll',
              description: 'All',
              use: [
                'engageMessageSetLiveManual',
                'engageMessageSetPause',
                'engageMessageSetLive',
                'showEngagesMessages',
                'engageMessageAdd',
                'engageMessageEdit',
                'engageMessageRemove'
              ]
            },
            {
              name: 'engageMessageSetLive',
              description: 'Set an auto campaign live'
            },
            { name: 'engageMessageSetPause', description: 'Pause a campaign' },
            {
              name: 'engageMessageSetLiveManual',
              description: 'Set a manual campaign live'
            },
            { name: 'engageMessageRemove', description: 'Remove a campaign' },
            { name: 'engageMessageEdit', description: 'Edit a campaign' },
            { name: 'engageMessageAdd', description: 'Add a campaign' },
            { name: 'showEngagesMessages', description: 'See campaign list' }
          ]
        }
      },
      essyncer: [{ name: 'engage_messages', schema: '{}', script: '' }]
    }
  },
  forms: {
    ui: {
      name: 'forms',
      scope: 'forms',
      exposes: {
        './routes': './src/routes.tsx',
        './segmentForm': './src/segmentForm.tsx',
        './importExportUploadForm': './src/components/ColumnChooser',
        './fieldPreview': './src/components/FieldsPreview',
        './formPreview': './src/containers/FieldForm',
        './contactDetailLeftSidebar': './src/containers/CustomFieldsSection',
        './relationForm': './src/containers/RelationForm.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-forms-ui/remoteEntry.js',
        scope: 'forms',
        module: './routes'
      },
      relationForm: './relationForm',
      segmentForm: './segmentForm',
      formPreview: './formPreview',
      fieldPreview: './fieldPreview',
      importExportUploadForm: './importExportUploadForm',
      contactDetailLeftSidebar: './contactDetailLeftSidebar',
      menus: [
        {
          text: 'Properties',
          to: '/settings/properties',
          image: '/images/icons/erxes-01.svg',
          location: 'settings',
          scope: 'forms',
          action: 'formsAll',
          permissions: ['showForms', 'manageForms']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-forms-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        forms: {
          name: 'forms',
          description: 'Form',
          actions: [
            {
              name: 'formsAll',
              description: 'All',
              use: ['showForms', 'manageForms']
            },
            { name: 'manageForms', description: 'Manage forms' },
            { name: 'showForms', description: 'Show forms' }
          ]
        }
      },
      essyncer: [
        { name: 'forms', schema: '{}', script: '' },
        { name: 'fields', schema: '{}', script: '' },
        { name: 'fields_groups', schema: '{}', script: '' },
        {
          name: 'form_submissions',
          schema: "{ 'value': { 'type': 'text' } }",
          script: ''
        }
      ]
    }
  },
  integrations: {},
  internalnotes: {},
  knowledgebase: {
    ui: {
      name: 'knowledgebase',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-knowledgebase-ui/remoteEntry.js',
        scope: 'knowledgebase',
        module: './routes'
      },
      menus: [
        {
          text: 'Knowledge Base',
          url: '/knowledgeBase',
          icon: 'icon-book-open',
          location: 'mainNavigation',
          permission: 'showKnowledgeBase'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-knowledgebase-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        knowledgeBase: {
          name: 'knowledgeBase',
          description: 'KnowledgeBase',
          actions: [
            {
              name: 'knowledgeBaseAll',
              description: 'All',
              use: ['showKnowledgeBase', 'manageKnowledgeBase']
            },
            {
              name: 'manageKnowledgeBase',
              description: 'Manage knowledge base'
            },
            { name: 'showKnowledgeBase', description: 'Show knowledge base' }
          ]
        }
      }
    }
  },
  logs: {
    ui: {
      name: 'logs',
      scope: 'logs',
      exposes: {
        './routes': './src/routes.tsx',
        './contactDetailContent': './src/logs/Activities.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-logs-ui/remoteEntry.js',
        scope: 'logs',
        module: './routes'
      },
      contactDetailContent: './contactDetailContent',
      menus: [
        {
          text: 'logs',
          to: '/settings/logs',
          image: '/images/icons/erxes-33.png',
          location: 'settings',
          scope: 'logs',
          component: './settings',
          action: '',
          permissions: []
        },
        {
          text: 'Email Deliveries',
          to: '/settings/emailDelivery',
          image: '/images/icons/erxes-27.png',
          location: 'settings',
          scope: 'logs',
          component: './settings',
          action: '',
          permissions: []
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-logs-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        logs: {
          name: 'logs',
          description: 'Logs',
          actions: [{ name: 'viewLogs', description: 'View logs' }]
        }
      }
    }
  },
  loyalties: {
    ui: {
      name: 'loyalties',
      scope: 'loyalties',
      exposes: {
        './routes': './src/routes.tsx',
        './customerSidebar': './src/containers/CustomerSidebar.tsx',
        './companySidebar': './src/containers/CompanySidebar.tsx',
        './userSidebar': './src/containers/UserSidebar.tsx',
        './automation': './src/automations/automation.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-loyalties-ui/remoteEntry.js',
        scope: 'loyalties',
        module: './routes'
      },
      automation: './automation',
      menus: [
        {
          text: 'Loyalties',
          url: '/vouchers',
          icon: 'icon-piggybank',
          location: 'mainNavigation',
          permission: 'showLoyalties'
        },
        {
          text: 'Loyalties config',
          to: '/erxes-plugin-loyalty/settings/general',
          image: '/images/icons/erxes-16.svg',
          location: 'settings',
          scope: 'loyalties',
          action: 'loyaltyConfig',
          permissions: ['manageLoyalties', 'showLoyalties']
        }
      ],
      customerRightSidebarSection: [
        {
          text: 'customerSection',
          component: './customerSidebar',
          scope: 'loyalties'
        }
      ],
      companyRightSidebarSection: [
        {
          text: 'companySection',
          component: './companySidebar',
          scope: 'loyalties'
        }
      ],
      userRightSidebarSection: [
        { text: 'userSection', component: './userSidebar', scope: 'loyalties' }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-loyalties-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        loyalties: {
          name: 'loyalties',
          description: 'Loyalties',
          actions: [
            {
              name: 'loyaltyAll',
              description: 'All',
              use: ['showLoyalties', 'manageLoyalties']
            },
            { name: 'showLoyalties', description: 'Show loyalties' },
            { name: 'manageLoyalties', description: 'Manage loyalties' }
          ]
        }
      }
    }
  },
  notifications: {
    ui: {
      name: 'notifications',
      exposes: {
        './routes': './src/routes.tsx',
        './settings': './src/containers/Widget.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-notifications-ui/remoteEntry.js',
        scope: 'notifications',
        module: './routes'
      },
      menus: [
        {
          text: 'notifications',
          url: '/notifications',
          icon: 'icon-book-open',
          location: 'topNavigation',
          scope: 'notifications',
          component: './settings'
        },
        {
          text: 'Notification settings',
          to: '/settings/notifications',
          image: '/images/icons/erxes-11.svg',
          location: 'settings',
          scope: 'notifications'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-notifications-ui/remoteEntry.js'
    }
  },
  webhooks: {
    ui: {
      name: 'webhooks',
      scope: 'webhooks',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-webhooks-ui/remoteEntry.js',
        scope: 'webhooks',
        module: './routes'
      },
      menus: [
        {
          text: 'Outgoing webhooks',
          to: '/settings/webhooks',
          image: '/images/icons/erxes-11.svg',
          location: 'settings',
          scope: 'webhooks',
          action: 'webhooksAll',
          permissions: ['showWebhooks']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-webhooks-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        webhooks: {
          name: 'webhooks',
          description: 'Webhooks',
          actions: [
            {
              name: 'webhooksAll',
              description: 'All',
              use: ['showWebhooks', 'manageWebhooks']
            },
            { name: 'showWebhooks', description: 'Show webhooks' },
            { name: 'manageWebhooks', description: 'Manage webhooks' }
          ]
        }
      }
    }
  },
  products: {
    ui: {
      name: 'products',
      scope: 'products',
      exposes: {
        './routes': './src/routes.tsx',
        './extendFormField':
          './src/containers/productCategory/SelectProductCategory.tsx',
        './extendFormFieldChoice':
          './src/components/product/FormFieldChoice.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-products-ui/remoteEntry.js',
        scope: 'products',
        module: './routes'
      },
      extendFormField: './extendFormField',
      extendFormFieldChoice: './extendFormFieldChoice',
      menus: [
        {
          text: 'Product and services',
          to: '/settings/product-service/',
          image: '/images/icons/erxes-31.png',
          location: 'settings',
          scope: 'products',
          action: 'productsAll',
          permissions: ['showProducts', 'manageProducts']
        },
        {
          text: 'Configs of Products',
          to: '/settings/products-config/',
          image: '/images/icons/erxes-07.svg',
          location: 'settings',
          scope: 'products',
          action: 'productsAll',
          permissions: ['showProducts', 'manageProducts']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-products-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        products: {
          name: 'products',
          description: 'Products',
          actions: [
            {
              name: 'productsAll',
              description: 'All',
              use: ['showProducts', 'manageProducts', 'productsMerge']
            },
            { name: 'manageProducts', description: 'Manage products' },
            { name: 'showProducts', description: 'Show products' },
            { name: 'productsMerge', description: 'Merge products' }
          ]
        }
      },
      essyncer: [
        {
          name: 'products',
          schema:
            "{ 'code': { 'type': 'keyword' }, 'name': { 'type': 'keyword' }, 'status': { 'type': 'keyword' }, 'order': { 'type': 'keyword' }, 'description': { 'type': 'keyword' }, 'tagIds': { 'type': 'keyword' }, 'categoryId': { 'type': 'keyword' }, 'type': { 'type': 'keyword' }, 'taxCode': { 'type': 'keyword' }, 'taxType': { 'type': 'keyword' }, 'vendorId': { 'type': 'keyword' }, 'customFieldsData': <nested>, 'barcodes': { 'type': 'keyword' } }",
          script: ''
        }
      ]
    }
  },
  segments: {
    ui: {
      name: 'segments',
      scope: 'segments',
      exposes: {
        './routes': './src/routes.tsx',
        './importExportFilterForm': './src/containers/SegmentsForm.tsx',
        './teamMemberSidebarComp': './src/containers/SegmentFilter.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-segments-ui/remoteEntry.js',
        scope: 'segments',
        module: './routes'
      },
      importExportFilterForm: './importExportFilterForm',
      teamMemberSidebarComp: './teamMemberSidebarComp',
      menus: [
        {
          text: 'Segments',
          url: '/segments',
          icon: 'icon-chart-pie-alt',
          location: 'mainNavigation',
          permission: 'showSegments'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-segments-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        segments: {
          name: 'segments',
          description: 'Segments',
          actions: [
            {
              name: 'segmentsAll',
              description: 'All',
              use: ['showSegments', 'manageSegments']
            },
            { name: 'manageSegments', description: 'Manage segments' },
            { name: 'showSegments', description: 'Show segments list' }
          ]
        }
      }
    }
  },
  tags: {
    ui: {
      name: 'tags',
      scope: 'tags',
      exposes: {
        './routes': './src/routes.tsx',
        './activityLog': './src/activityLogs/activityLog.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-tags-ui/remoteEntry.js',
        scope: 'tags',
        module: './routes'
      },
      activityLog: './activityLog',
      menus: [
        {
          text: 'Tags',
          to: '/tags',
          image: '/images/icons/erxes-18.svg',
          location: 'settings',
          scope: 'tags',
          action: 'tagsAll',
          permissions: ['showTags', 'manageTags']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-tags-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        tags: {
          name: 'tags',
          description: 'Tags',
          actions: [
            {
              name: 'tagsAll',
              description: 'All',
              use: ['showTags', 'manageTags']
            },
            { name: 'manageTags', description: 'Manage tags' },
            { name: 'showTags', description: 'Show tags' }
          ]
        }
      },
      essyncer: [{ name: 'tags', schema: '{}', script: '' }]
    }
  },
  webbuilder: {
    ui: {
      name: 'webbuilder',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-webbuilder-ui/remoteEntry.js',
        scope: 'webbuilder',
        module: './routes'
      },
      menus: [
        {
          text: 'X Builder',
          url: '/xbuilder',
          icon: 'icon-window-grid',
          location: 'mainNavigation',
          permission: 'showWebbuilder'
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-webbuilder-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        webbuilder: {
          name: 'webbuilder',
          description: 'Webbuilder',
          actions: [
            {
              name: 'webbuilderAll',
              description: 'All',
              use: ['showWebbuilder', 'manageWebbuilder']
            },
            { name: 'showWebbuilder', description: 'Show webbuilder' },
            { name: 'manageWebbuilder', description: 'Manage webbuilder' }
          ]
        }
      }
    }
  },
  documents: {
    ui: {
      name: 'documents',
      scope: 'documents',
      exposes: { './routes': './src/routes.tsx' },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-documents-ui/remoteEntry.js',
        scope: 'documents',
        module: './routes'
      },
      menus: [
        {
          text: 'Documents',
          to: '/settings/documents',
          image: '/images/icons/erxes-09.svg',
          location: 'settings',
          scope: 'documents',
          action: 'documentsAll',
          permissions: ['manageDocuments']
        }
      ],
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-documents-ui/remoteEntry.js'
    },
    api: {
      permissions: {
        documents: {
          name: 'documents',
          description: 'Documents',
          actions: [
            {
              name: 'documentsAll',
              description: 'All',
              use: ['manageDocuments']
            },
            { name: 'manageDocuments', description: 'Manage documents' }
          ]
        }
      }
    }
  },
  facebook: {
    ui: {
      name: 'facebook',
      scope: 'facebook',
      exposes: {
        './routes': './src/routes.tsx',
        './inboxIntegrationSettings':
          './src/containers/UpdateConfigsContainer.tsx',
        './activityLog': './src/containers/ActivityLogsContainer.tsx',
        './inboxConversationDetailRespondBoxMask':
          './src/containers/TagMessageContainer.tsx',
        './inboxConversationDetail':
          './src/containers/post/FbCommentsContainer.tsx'
      },
      routes: {
        url:
          'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-facebook-ui/remoteEntry.js',
        scope: 'facebook',
        module: './routes'
      },
      inboxIntegrationSettings: './inboxIntegrationSettings',
      inboxDirectMessage: {
        messagesQuery: {
          query:
            '\n          query facebookConversationMessages(\n            $conversationId: String!\n            $skip: Int\n            $limit: Int\n            $getFirst: Boolean\n          ) {\n            facebookConversationMessages(\n              conversationId: $conversationId,\n              skip: $skip,\n              limit: $limit,\n              getFirst: $getFirst\n            ) {\n              _id\n              content\n              conversationId\n              customerId\n              userId\n              createdAt\n              isCustomerRead\n              internal\n\n              attachments {\n                url\n                name\n                type\n                size\n              }\n\n              user {\n                _id\n                username\n                details {\n                  avatar\n                  fullName\n                  position\n                }\n              }\n\n              customer {\n                _id\n                avatar\n                firstName\n                middleName\n                lastName\n                primaryEmail\n                primaryPhone\n                state\n\n                companies {\n                  _id\n                  primaryName\n                  website\n                }\n\n                customFieldsData\n                tagIds\n              }\n            }\n          }\n        ',
          name: 'facebookConversationMessages',
          integrationKind: 'facebook-messenger'
        },
        countQuery: {
          query:
            '\n          query facebookConversationMessagesCount($conversationId: String!) {\n            facebookConversationMessagesCount(conversationId: $conversationId)\n          }\n        ',
          name: 'facebookConversationMessagesCount',
          integrationKind: 'facebook-messenger'
        }
      },
      inboxIntegrations: [
        {
          name: 'Facebook Post',
          description: 'Connect to Facebook posts right from your Team Inbox',
          inMessenger: false,
          isAvailable: true,
          kind: 'facebook-post',
          logo: '/images/integrations/facebook.png',
          createModal: 'facebook-post',
          createUrl: '/settings/integrations/createFacebook',
          category:
            'All integrations, For support teams, Marketing automation, Social media',
          components: ['inboxConversationDetail']
        },
        {
          name: 'Facebook Messenger',
          description:
            'Connect and manage Facebook Messages right from your Team Inbox',
          inMessenger: false,
          isAvailable: true,
          kind: 'facebook-messenger',
          logo: '/images/integrations/fb-messenger.png',
          createModal: 'facebook-messenger',
          createUrl: '/settings/integrations/createFacebook',
          category:
            'All integrations, For support teams, Messaging, Social media, Conversation',
          components: ['inboxConversationDetailRespondBoxMask']
        }
      ],
      activityLog: './activityLog',
      inboxConversationDetailRespondBoxMask:
        './inboxConversationDetailRespondBoxMask',
      inboxConversationDetail: './inboxConversationDetail',
      url:
        'https://plugin-uis.s3.us-west-2.amazonaws.com/js/plugins/plugin-facebook-ui/remoteEntry.js'
    }
  }
};
