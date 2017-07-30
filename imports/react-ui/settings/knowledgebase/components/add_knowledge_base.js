import React from 'react';
import { Button } from 'react-bootstrap';
import { Wrapper } from '/imports/react-ui/layout/components';
import { ModalTrigger } from '/imports/react-ui/common';
import Sidebar from '../../Sidebar';
import { KbTopic, KbCategory } from '../containers';

function AddKnowledgeBase() {
  const triggerKbTopic = (
    <Button>
      Add a topic
    </Button>
  );

  const triggerKbCategory = (
    <Button>
      Add a category
    </Button>
  );

  const content = (
    <div className="margined type-box">
      <div className="box">
        <h2>Knowledge base topic</h2>

        <ModalTrigger title="Add topic" trigger={triggerKbTopic}>
          <KbTopic />
        </ModalTrigger>

        <ModalTrigger title="Add category" trigger={triggerKbCategory}>
          <KbCategory />
        </ModalTrigger>
      </div>
    </div>
  );

  const breadcrumb = [
    { title: 'Settings', link: '/settings/channels' },
    { title: 'Knowledge base', link: '/settings/knowledgebase' },
    { title: 'Add knowledge base' },
  ];

  return (
    <div>
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        leftSidebar={<Sidebar />}
        content={content}
      />
    </div>
  );
}

export default AddKnowledgeBase;
