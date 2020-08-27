export const EMPTY_IMPORT_CONTENT = {
  title: "Getting Started with Import & Export Feature",
  description: "These steps will help you with importing or exporting your data to and from erxes.",
  urlText: "Watch our tutorial",
  url: "/tutorial",
  steps: [
    {
      title: "Export your data",
      description: "Export your data from your previous software or have your data sheet (csv, xls) ready",
    },
    {
      title: "Create Custom Properties",
      description: "If you wish to import any properties that are not available on erxes, you need to create custom properties",
      url: "https://www.erxes.org/user/general-settings/#how-to-setup-properties",
      isOutside: true,
      target: "_blank"
    },
    {
      title: "Choose the data type",
      description: "Make sure you’re on the right page and you’ve selected the right data type (Lead, Customer, etc. on the left)",
      url: "http://www.erxes.org/user/import#import",
      target: "_blank",
      isOutside: true,
    },
    {
      title: "Download Template",
      description: "Click on “Download Template” for importing. This is an important step, because your column titles need to match with erxes titles.",
      isOutside: false,
    },
    {
      title: "Clean and prepare your data sheet",
      description: "Make sure the column titles match with the Template. The order of the columns does not need to match.",
    },
    {
      title: "Export your data",
      description: "You can export your data from the list on the left. If you wish to export your popup forms, go to Customer and click on “Export Popups Data”",
      url: "/settings/importHistories?type=customer",
      isOutside: false,
      urlText: "Go to Customers",
      icon: "export"
    }
  ]
};

export const EMPTY_SEGMENT_CONTENT = {
  title: "Getting Started with Segments",
  description: "The Segments feature helps you to filter, target, and engage a certain group of contacts. The Segments are used in the Contacts and Engage features.",
  urlText: "Watch our tutorial",
  url: "/tutorial#settingStage",
  steps: [
    {
      title: "Create Custom Properties",
      description: "If you wish to segment by any properties that are not available on erxes, make sure you’ve already created them",
      url: "/settings/properties?type=customer",
      urlText: "Go to Properties"
    },
    {
      title: "Choose the Contact Type",
      description: "Make sure you’re on the right page and  you want to segment by from the list on the left: Visitor, Lead, Customer, Company"
    }
  ]
};

export const EMPTY_NEW_SEGMENT_CONTENT = {
  title: "Setup a new segment",
  description: "There aren’t any filters at the moment. You can create a segment by Property and/or by Events.",
  steps: [
    {
      title: "Create Custom Properties",
      description: "If you wish to segment by any properties that are not available on erxes, make sure you’ve already created them",
      url: "/settings/properties?type=customer",
      urlText: "Go to Properties"
    },
    {
      title: "Install the Event Tracking script",
      description: "If you wish to segment by events, i.e actions that are triggered by something your Customer performs on your website or app."
    },
    {
      title: "Create your Segment",
      description: "Select the property/event you want to filter by, select one of the operators and type in or select the value from the dropdown menu."
    }
  ]
};

export const EMPTY_CONTENT_SCRIPT = {
  title: "Getting Started with erxes Scripts",
  description: "Avoid duplication of erxes widget scripts on your website, which might disable some of your erxes widgets (messenger, popups, etc.)",
  steps: [
    {
      title: "Generate the combination of scripts",
      description: "Click on “New Script” and choose which widgets you’re going to display in a single page",
    },
    {
      title: "Install the script",
      description: "Copy the updated script and paste it into your website or Google Tag Manager"
    }
  ]
};

export const EMPTY_CONTENT_ENGAGE = {
  title: "Getting Started with Engage",
  description: "Learn how to use this feature to engage your contacts and drive conversations.",
  steps: [
    {
      title: "Email",
      description: "<ul><li><strong><a href='/settings/engage-configs'>Verify</a> your email address</strong> <br/> Make sure it is the same as one of your team members</li><li><strong>Integrate that email address with <a href='/settings/integrations#showImapModal=true'>IMAP</a></strong> <br/> Connect your existing emails address as an integration</li><li><strong>Prepare your contacts by Segment / Tag / Brand</strong> <br/> For more targeted marketing, create a <a href='/segments/new/customer'>Segment</a></li></ul>",
      html: true,
      icon: "envelope-edit"
    },
    {
      title: "Messenger",
      description: "<strong>Prepare your contacts by Segment / Tag / Brand</strong><br/> For more targeted marketing, create a Segment",
      html: true,
      url: "/segments/new/customer",
      urlText: "Create a Segment",
      icon: "comment-edit"
    },
    {
      title: "SMS",
      description: "<ul><li><strong><a href='/settings/engage-configs'>Claim</a> your phone number</strong> <br/> Make sure you assigned it to a team member</li><li><strong>Prepare your contacts</strong> <br/> Check the <a href='https://en.wikipedia.org/wiki/E.164' target='_blank'>format</a>, verification status, and primary phone state</li><li><strong><a href='/segments/new/customer'>Create</a> a segment</strong> <br/> Filter all contacts with valid phone numbers and other properties</li></ul>",
      html: true,
      icon: "comment-alt-message"
    }
  ]
};

export const EMPTY_CONTENT_MESSENGER = {
  title: "Getting Started with erxes Messenger",
  description: "Learn how the erxes Messenger works and it is set up. It is used in the Team Inbox and Knowledgebase and Engage features uses Messenger.",
  steps: [
    {
      title: "Create a new messenger",
      description: "Click on “Add” and complete all the steps.",
      url: "/settings/integrations/createMessenger",
      urlText: "Add Messenger"
    },
    {
      title: "Display your Knowledgebase",
      description: "Click on “Add” of the Knowledgebase integration, if any, and complete the steps.",
      url: "/settings/integrations#showKBAddModal=true",
      urlText: "Add Knowledgebase"
    },
    {
      title: "Display your form",
      description: "Click on “Add” of the Popup integration,if any, and complete the steps.",
      url: "/settings/integrations#showPopupAddModal=true",
      urlText: "Add Popup"
    },
    {
      title: "Install the script",
      description: "Copy the script and install it on your website by clicking on the “Install Code” button."
    },
    {
      title: "Avoid duplication of erxes widget scripts",
      description: "If you wish to display erxes messenger and any other erxes widgets on the same webpage, use the Script Manager to combine scripts and avoid any duplication errors.",
      icon: "exclamation-circle",
      url: "/settings/scripts",
      urlText: "Manange Scripts"
    },
  ]
};