module.exports = {
  name: 'inbox',
  port: 3009,
  scope: 'inbox',
  exposes: {
    './routes': './src/routes.tsx',
    './activityLog': './src/activityLogs/activityLog.tsx'
  },
  routes: {
    url: 'http://localhost:3009/remoteEntry.js',
    scope: 'inbox',
    module: './routes'
  },
  activityLog: './activityLog',
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
<<<<<<< HEAD
      text: 'Integrations',
      to: '/settings/integrations',
      image: '/images/icons/erxes-04.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'integrationsAll',
=======
      text: "Add-ons",
      to: "/settings/add-ons",
      image: "/images/icons/erxes-04.svg",
      location: "settings",
      scope: "inbox",
      action: "integrationsAll",
>>>>>>> c64b801b877151d283d64bfe23ec9317fe53734f
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
<<<<<<< HEAD
      text: 'Integrations config',
      to: '/settings/integrations-config',
      image: '/images/icons/erxes-24.svg',
      location: 'settings',
      scope: 'inbox',
      action: 'generalSettingsAll',
      permissions: ['manageGeneralSettings', 'showGeneralSettings']
=======
      text: "Add-ons config",
      to: "/settings/add-ons-config",
      image: "/images/icons/erxes-24.svg",
      location: "settings",
      scope: "inbox",
      action: "generalSettingsAll",
      permissions: ["manageGeneralSettings", "showGeneralSettings"],
>>>>>>> c64b801b877151d283d64bfe23ec9317fe53734f
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
      image: '/images/icons/erxes-30.png',
      location: 'settings',
      scope: 'inbox',
      action: 'scriptsAll',
      permissions: ['manageScripts', 'showScripts']
    }
  ]
};
