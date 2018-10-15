import * as classNames from "classnames";
import * as React from "react";
import * as RTG from "react-transition-group";
import { Launcher, Messenger } from "../containers";

type Props = {
  isMessengerVisible: boolean;
  saveBrowserInfo: () => void;
};

export default class App extends React.Component<Props> {
  componentDidMount() {
    // call save browser info mutation
    this.props.saveBrowserInfo();
  }

  render() {
    const { isMessengerVisible } = this.props;
    const widgetClasses = classNames("erxes-widget", {
      opened: isMessengerVisible
    });

    return (
      <div className={widgetClasses}>
        <RTG.CSSTransition
          in={isMessengerVisible}
          appear={true}
          timeout={400}
          classNames="scale-in"
          unmountOnExit
        >
          <div className="erxes-messenger">
            <Messenger />
          </div>
        </RTG.CSSTransition>
        <Launcher />
      </div>
    );
  }
}
