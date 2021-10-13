import * as React from 'react';
import { FilterableList } from '.';
import { IBooking, ICategoryTree } from '../../types';
import * as ReactPopover from 'react-popover';
type Props = {
  items: ICategoryTree[];
  parentId?: string;
  changeRoute: (item: any) => void;
  booking?: IBooking;
};

type State = {
  isOpen: boolean;
};

class Navigation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleNavigation = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const { items, parentId, changeRoute, booking } = this.props;

    if (!booking) {
      return null;
    }

    const styles = booking.styles;
    const { isOpen } = this.state;

    return (
      <ReactPopover
        isOpen={isOpen}
        preferPlace={'start'}
        place={'left'}
        tipSize={0.01}
        className={'top-0'}
        body={
          <div className={`booking-navigation bn-${styles.widgetColor}`}>
            <div className="flex-sb p-5">
              <h4> Navigation </h4>
              <div
                onClick={() => {
                  this.setState({ isOpen: false });
                }}
              >
                <span className="arrow arrow-bar is-left"></span>
              </div>
            </div>

            <hr />
            <FilterableList
              treeView={true}
              loading={false}
              items={JSON.parse(JSON.stringify(items))}
              parentId={parentId}
              changeRoute={changeRoute}
              styles={styles}
            />
          </div>
        }
      >
        <div onClick={this.toggleNavigation}>
          <div className="nav">
            <Burger /> 
            <p>Navigation</p>
          </div>
        </div>
      </ReactPopover>
    );
  }
}

const Burger = () => {
  return (
    <div className="burger-menu">
      <div />
      <div />
      <div />
    </div>
  )
}


export default Navigation;
