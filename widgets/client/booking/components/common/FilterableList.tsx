import * as React from 'react';

type Props = {
  items?: any[];
  links?: any[];
  showCheckmark?: boolean;
  loading?: boolean;
  className?: string;
  treeView?: boolean;
  parentId?: string;

  changeRoute: (item: any) => void;

  // hooks
  onClick?: (items: any[], id: string) => void;
  onExit?: (items: any[]) => void;
};

type State = {
  isOpen: boolean;
  key: string;
  items: any[];
  parentIds: { [key: string]: boolean };
};

class FilterableList extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      isOpen: false,
      key: '',
      items: props.items,
      parentIds: {}
    };
  }

  componentWillUnmount() {
    // onExit hook
    const { onExit } = this.props;

    if (onExit) {
      onExit(this.state.items);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items)) {
      this.setState({
        items: nextProps.items
      });
    }
  }

  toggleItem = (id: string) => {
    const items = this.state.items;
    // const item = items.find(i => i._id === id);

    // items[items.indexOf(item)].selectedBy =
    //   item.selectedBy === 'all' ? 'none' : 'all';

    this.setState({ items });

    // onClick hook
    const { onClick } = this.props;

    if (onClick) {
      onClick(items, id);
    }
  };

  groupByParent = (array: any[]) => {
    const key = 'parentId';

    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);

      return rv;
    }, {});
  };

  onToggle = (id: string, isOpen: boolean) => {
    const parentIds = this.state.parentIds;
    parentIds[id] = !isOpen;

    this.setState({ parentIds });
  };

  renderIcons(item: any, hasChildren: boolean, isOpen: boolean, stock: string) {
    return hasChildren ? (
      <div
        className="toggle-nav"
        onClick={this.onToggle.bind(this, item._id, isOpen)}
      >
        <div
          className={`arrow ${isOpen ? 'arrow-down' : 'arrow-right'}-${stock}`}
        />
      </div>
    ) : null;
  }

  renderItem(item: any, hasChildren: boolean, stockCnt: number) {
    const { showCheckmark = true, changeRoute } = this.props;
    const { key } = this.state;

    if (key && item.name.toLowerCase().indexOf(key.toLowerCase()) < 0) {
      return false;
    }
    const onClick = () => this.toggleItem(item._id);
    const isOpen = this.state.parentIds[item._id] || !!key;

    let stock = stockCnt === 0 ? 'soldout' : 'available';
    if (stockCnt > 0 && stockCnt < 10) {
      stock = 'few';
    }
    return (
      <li
        key={item._id}
        className={`list flex-sb s-${stock}`}
        onClick={onClick}
      >
        <div className="flex-center">
          {this.renderIcons(item, hasChildren, isOpen, stock)}
          <div className="mr-30" onClick={() => changeRoute(item)}>
            {item.name || '[undefined]'}
          </div>
        </div>
        <div className={`circle center ${stock}`}>{stockCnt}</div>
      </li>
    );
  }

  renderTree(parent: any, subFields?: any) {
    const groupByParent = this.groupByParent(subFields);
    const childrens = groupByParent[parent._id];
    const num = Math.floor(Math.random() * 40);
    if (childrens) {
      const isOpen = this.state.parentIds[parent._id] || !!this.state.key;
      return (
        <ul key={`parent-${parent._id}`}>
          {this.renderItem(parent, true, num)}
          <li className="child-list">
            {isOpen &&
              childrens.map((childparent: any) => {
                return this.renderTree(childparent, subFields);
              })}
          </li>
        </ul>
      );
    }

    return this.renderItem(parent, false, num);
  }

  renderItems() {
    const { loading, parentId } = this.props;
    const { items } = this.state;

    if (loading) {
      return null;
    }

    if (items.length === 0) {
      return <div>hooson baina</div>;
    }

    const parents = items.filter(item => item.parentId === parentId);
    const subFields = items.filter(item => item.parentId);

    return parents.map(parent => this.renderTree(parent, subFields));
  }
  togglePopover = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return <div>{this.renderItems()}</div>;
  }
}

export default FilterableList;
