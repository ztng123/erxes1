import { IFormProps } from 'modules/common/types';
import * as React from 'react';
import * as validator from 'validator';
import { Error } from './styles';

type Props = {
  renderContent: (props: IFormProps) => any;
  onSubmit?: (values: any) => any;
};

type State = {
  errors: any;
  values: any;
};

class Form extends React.Component<Props, State> {
  private children: any[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      errors: {},
      values: {}
    };
  }

  registerChild = child => {
    this.children.push(child);
  };

  runValidations = (callback: any) => {
    const errors = {};
    const values = {};

    for (const child of this.children) {
      // tslint:disable-next-line:no-console
      console.log(child);
      errors[child.props.name] = this.validate(child);
      values[child.props.name] = this.getValue(child);
    }

    this.setState({ errors, values }, () => {
      // tslint:disable-next-line:no-console
      console.log(this.state.errors);
      callback();
    });
  };

  getValue = child => {
    return (document.getElementsByName(child.props.name) as any)[0].value;
  };

  onSubmit = e => {
    // tslint:disable
    console.log('on submit');

    e.preventDefault();

    this.runValidations(() => {
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.values);
      }
    });
  };

  validate = child => {
    const value = (document.getElementsByName(child.props.name) as any)[0]
      .value;

    if (child.props.required && !value) {
      return <Error>Required field!</Error>;
    }

    if (child.props.type === 'email' && !validator.isEmail(value)) {
      return (
        <Error>Invalid email format! Please enter a valid email address.</Error>
      );
    }

    if (child.props.max && !validator.isLength('length', { min: 1, max: 6 })) {
      return <Error>Maximum length is {child.props.max} characters!</Error>;
    }

    if (
      value &&
      child.props.type === 'url' &&
      !validator.isURL(value, {
        protocols: ['http', 'https', 'ftp'],
        require_protocol: true
      })
    ) {
      return <Error>Invalid link!</Error>;
    }

    if (value && child.props.type === 'number' && !validator.isInt(value)) {
      // tslint:disable-next-line:no-console
      console.log(child.props.name, '-', value, '-', child.props.type);
      return <Error>Invalid number format! Please enter a valid number.</Error>;
    }

    return null;
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {this.props.renderContent({
          errors: this.state.errors,
          values: this.state.values,
          registerChild: this.registerChild,
          runValidations: this.runValidations
        })}
      </form>
    );
  }
}

export default Form;
