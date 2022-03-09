import * as _ from 'underscore';
import { IContext } from '../connectionResolver';

import { IConformityQueryParams } from './customers';
import { CommonBuilder } from './utils';

type TSortBuilder = { primaryName: number } | { [index: string]: number };

export const sortBuilder = (params: IListArgs): TSortBuilder => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  let sortParams: TSortBuilder = { primaryName: -1 };

  if (sortField) {
    sortParams = { [sortField]: sortDirection };
  }

  return sortParams;
};

export interface IListArgs extends IConformityQueryParams {
  segment?: string;
  tag?: string;
  ids?: string[];
  searchValue?: string;
  brand?: string;
  sortField?: string;
  sortDirection?: number;
}

export class Builder extends CommonBuilder<IListArgs> {
  constructor(params: IListArgs, context: IContext) {
    super('companies', params, context);
  }

  public async findAllMongo(limit: number) {
    const selector = {
      ...this.context.commonQuerySelector,
      status: { $ne: 'deleted' }
    };

    const companies = await this.context.models.Companies.find(selector)
      .sort({ createdAt: -1 })
      .limit(limit);

    const count = await this.context.models.Companies.find(selector).countDocuments();

    return {
      list: companies,
      totalCount: count
    };
  }

  /*
   * prepare all queries. do not do any action
   */
  public async buildAllQueries(): Promise<void> {
    await super.buildAllQueries();
  }
}
