import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from 'modules/layout/components';
import { SidebarList, SidebarCounter } from 'modules/layout/styles';
import { EmptyState, Icon } from 'modules/common/components';

const propTypes = {
  segments: PropTypes.array.isRequired,
  onChangeSegments: PropTypes.func.isRequired,
  defaultSegment: PropTypes.string,
  counts: PropTypes.object
};

class Segments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chosenSegment: props.defaultSegment || ''
    };

    this.onClickSegment = this.onClickSegment.bind(this);
  }

  onClickSegment(segmentId) {
    this.props.onChangeSegments(segmentId);
    this.setState({ chosenSegment: segmentId });
  }

  render() {
    const { segments, counts } = this.props;
    const { Section } = Wrapper.Sidebar;

    const orderedSegments = [];

    segments.forEach(segment => {
      if (!segment.subOf) {
        orderedSegments.push(segment, ...segment.getSubSegments);
      }
    });

    return (
      <Section collapsible={segments.length > 5}>
        <Section.Title>Choose segment</Section.Title>

        <SidebarList>
          {orderedSegments.length ? (
            orderedSegments.map(segment => (
              <li key={segment._id}>
                <a
                  tabIndex={0}
                  className={
                    this.state.chosenSegment === segment._id ? 'chosen' : ''
                  }
                  onClick={() => this.onClickSegment(segment._id)}
                >
                  {segment.subOf ? '\u00a0\u00a0\u00a0\u00a0\u00a0' : null}
                  <Icon
                    icon="pie-graph icon"
                    style={{ color: segment.color }}
                  />
                  {segment.name}
                  <SidebarCounter>{counts[segment._id]}</SidebarCounter>
                </a>
              </li>
            ))
          ) : (
            <EmptyState icon="pie-graph" text="No segments" size="small" />
          )}
        </SidebarList>
      </Section>
    );
  }
}

Segments.propTypes = propTypes;

export default Segments;
