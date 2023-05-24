import { typeFilters, viewModes } from "../../main/constants";

import Button from "../../common/Button";
import { CardTab } from "../../styles/tickets";
import { Dropdown } from "react-bootstrap";
import DropdownToggle from "../../common/DropdownToggle";
import { HeaderWrapper } from "../../styles/main";
import Icon from "../../common/Icon";
import React from "react";

type Props = {
  ticketLabel: string;
  mode: any;
  setMode: any;
  viewType: string;
  baseColor: string;
  setShowForm: (val: boolean) => void;
  setViewType: (val: string) => void;
};

export default class TicketHeader extends React.Component<Props> {
  render() {
    const {
      mode,
      setMode,
      baseColor,
      setShowForm,
      setViewType,
      viewType,
    } = this.props;

    return (
      <>
        <HeaderWrapper>
          <h4>{this.props.ticketLabel}</h4>
          <div className="d-flex">
            <CardTab
              baseColor={baseColor}
              className="d-flex align-items-center"
            >
              {viewModes.map((item) => (
                <span
                  className={`d-flex align-items-center justify-content-center ${
                    item.type === viewType ? "active" : ""
                  }`}
                  key={item.type}
                  onClick={() => setViewType(item.type)}
                >
                  <Icon icon={item.icon} size={15} /> &nbsp; {item.label}
                </span>
              ))}
            </CardTab>
            <Dropdown>
              <Dropdown.Toggle
                as={DropdownToggle}
                id="dropdown-custom-components"
              >
                <Button btnStyle="simple" uppercase={false} icon="filter">
                  {mode}
                </Button>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {typeFilters.map((viewMode) => (
                  <Dropdown.Item
                    key={viewMode.showMode}
                    className="d-flex align-items-center justify-content-between"
                    eventKey="1"
                    onClick={() => {
                      setMode(viewMode.setMode);
                    }}
                  >
                    {viewMode.showMode}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button
              btnStyle="success"
              uppercase={false}
              onClick={() => setShowForm(true)}
              icon="add"
            >
              Create a New Ticket
            </Button>
          </div>
        </HeaderWrapper>
      </>
    );
  }
}
