import {
  Button,
  DataWithLoader,
  DropdownToggle,
  FormControl,
  Icon,
  ModalTrigger,
  Pagination,
  SortHandler,
  Table
} from 'modules/common/components';
import { __, Alert, confirm, router } from 'modules/common/utils';
import { menuContacts } from 'modules/common/utils/menus';
import { CompaniesTableWrapper } from 'modules/companies/styles';
import { Wrapper } from 'modules/layout/components';
import { BarItems } from 'modules/layout/styles';
import { DataImporter } from 'modules/settings/importHistory/containers';
import { ManageColumns } from 'modules/settings/properties/containers';
import { TaggerPopover } from 'modules/tags/components';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { CompaniesMerge } from '..';
import { IRouterProps } from '../../../common/types';
import { IConfigColumn } from '../../../settings/properties/types';
import { CompanyForm } from '../../containers';
import { ICompany } from '../../types';
import CompanyRow from './CompanyRow';
import Sidebar from './Sidebar';

interface IProps extends IRouterProps {
  companies: ICompany[];
  columnsConfig: IConfigColumn[];
  loading: boolean;
  searchValue: string;
  totalCount: number;
  // TODO: check is below line not throwing error ?
  toggleBulk: () => void;
  toggleAll: (targets: ICompany[], containerId: string) => void;
  bulk: any[];
  isAllSelected: boolean;
  emptyBulk: () => void;
  removeCompanies: (
    doc: { companyIds: string[] },
    emptyBulk: () => void
  ) => void;
  mergeCompanies: () => void;
  queryParams: any;
  exportCompanies: (bulk: string[]) => void;
}

type State = {
  searchValue?: string;
};

class CompaniesList extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue
    };
  }

  onChange = () => {
    const { toggleAll, companies } = this.props;
    toggleAll(companies, 'companies');
  };

  search = e => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });
    this.timer = setTimeout(() => {
      router.setParams(history, { searchValue });
    }, 500);
  };

  removeCompanies = companies => {
    const companyIds: string[] = [];

    companies.forEach(company => {
      companyIds.push(company._id);
    });

    this.props.removeCompanies({ companyIds }, this.props.emptyBulk);
  };

  moveCursorAtTheEnd = e => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      columnsConfig,
      companies,
      history,
      location,
      loading,
      toggleBulk,
      bulk,
      isAllSelected,
      emptyBulk,
      totalCount,
      mergeCompanies,
      queryParams,
      exportCompanies
    } = this.props;

    const mainContent = (
      <CompaniesTableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true}>
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={this.onChange}
                />
              </th>
              {columnsConfig.map(({ name, label }) => (
                <th key={name}>
                  <SortHandler sortField={name} label={__(label)} />
                </th>
              ))}
              <th>{__('Tags')}</th>
            </tr>
          </thead>
          <tbody id="companies">
            {companies.map(company => (
              <CompanyRow
                company={company}
                columnsConfig={columnsConfig}
                isChecked={bulk.includes(company)}
                key={company._id}
                history={history}
                toggleBulk={toggleBulk}
              />
            ))}
          </tbody>
        </Table>
      </CompaniesTableWrapper>
    );

    const addTrigger = (
      <Button btnStyle="success" size="small" icon="add">
        Add company
      </Button>
    );

    const editColumns = <a>{__('Edit columns')}</a>;

    const mergeButton = (
      <Button btnStyle="primary" size="small" icon="merge">
        Merge
      </Button>
    );

    let actionBarLeft: React.ReactNode;

    const companiesMerge = props => {
      return <CompaniesMerge {...props} objects={bulk} save={mergeCompanies} />;
    };

    if (bulk.length > 0) {
      const tagButton = (
        <Button btnStyle="simple" size="small" icon="downarrow">
          Tag
        </Button>
      );

      const onClick = () =>
        confirm()
          .then(() => {
            this.removeCompanies(bulk);
          })
          .catch(error => {
            Alert.error(error.message);
          });

      actionBarLeft = (
        <BarItems>
          <TaggerPopover
            type="company"
            successCallback={emptyBulk}
            targets={bulk}
            trigger={tagButton}
          />

          {bulk.length === 2 && (
            <ModalTrigger
              title="Merge Companies"
              size="lg"
              trigger={mergeButton}
              content={companiesMerge}
            />
          )}

          <Button
            btnStyle="danger"
            size="small"
            icon="cancel-1"
            onClick={onClick}
          >
            Remove
          </Button>
        </BarItems>
      );
    }

    const manageColumns = props => {
      return (
        <ManageColumns
          {...props}
          location={location}
          history={history}
          contentType="company"
        />
      );
    };

    const companyForm = props => {
      return <CompanyForm {...props} queryParams={queryParams} />;
    };

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />

        <Dropdown id="dropdown-engage" pullRight={true}>
          <DropdownToggle bsRole="toggle">
            <Button btnStyle="simple" size="small">
              {__('Customize ')} <Icon icon="downarrow" />
            </Button>
          </DropdownToggle>
          <Dropdown.Menu>
            <li>
              <ModalTrigger
                title="Manage Columns"
                trigger={editColumns}
                content={manageColumns}
                dialogClassName="transform"
              />
            </li>
            <li>
              <Link to="/settings/properties?type=company">
                {__('Properties')}
              </Link>
            </li>
            <li>
              <a onClick={exportCompanies.bind(this, bulk)}>
                {__('Export companies')}
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
        <Link to="/settings/importHistories?type=company">
          <Button btnStyle="primary" size="small" icon="login-1">
            {__('Go to import')}
          </Button>
        </Link>
        <ModalTrigger
          title="New company"
          trigger={addTrigger}
          size="lg"
          content={companyForm}
          backDrop="static"
        />
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} />
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Companies`) + ` (${totalCount})`}
            queryParams={queryParams}
            submenu={menuContacts}
          />
        }
        actionBar={actionBar}
        footer={<Pagination count={totalCount} />}
        leftSidebar={<Sidebar loadingMainQuery={loading} />}
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={companies.length}
            emptyText="Add in your first company!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withRouter<IRouterProps>(CompaniesList);
