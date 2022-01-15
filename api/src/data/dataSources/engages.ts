import { HTTPCache, RESTDataSource } from 'apollo-datasource-rest';
import { debugError } from '../../debuggers';
import { getSubServiceDomain } from '../utils';

export default class EngagesAPI extends RESTDataSource {
  constructor() {
    super();

    const ENGAGES_API_DOMAIN = getSubServiceDomain({
      name: 'ENGAGES_API_DOMAIN'
    });

    this.baseURL = ENGAGES_API_DOMAIN;
    this.httpCache = new HTTPCache();
  }

  public didEncounterError(e) {
    const error = e.extensions || {};
    const { response } = error;
    const { body } = response || { body: e.message };

    if (e.code === 'ECONNREFUSED' || e.code === 'ENOTFOUND') {
      throw new Error('Engages api is not running');
    }

    throw new Error(body);
  }

  /**
   * Fetches all saved configs from engages-email-sender
   * @returns Configs documents
   */
  public async engagesConfigDetail() {
    return this.get(`/configs/detail`);
  }

  public engagesGetVerifiedEmails() {
    return this.get(`/configs/get-verified-emails`);
  }

  public async engagesStats(engageMessageId) {
    try {
      const response = await this.get(
        `/deliveryReports/statsList/${engageMessageId}`
      );
      return response;
    } catch (e) {
      debugError(e.message);
      return {};
    }
  }

  public async engageReportsList(params) {
    return this.get(`/deliveryReports/reportsList`, params);
  }

  public async engagesLogs(engageMessageId) {
    try {
      const response = await this.get(
        `/deliveryReports/logs/${engageMessageId}`
      );

      return response;
    } catch (e) {
      debugError(e.message);
      return [];
    }
  }

  public async engagesSmsStats(engageMessageId) {
    try {
      const response = await this.get(
        `/deliveryReports/smsStats/${engageMessageId}`
      );

      return response;
    } catch (e) {
      debugError(e.message);
      return {};
    }
  }

  // fetches average email delivery stat percentages
  public async getAverageStats() {
    try {
      const response = await this.get(`/deliveryReports/avgStatPercentages`);

      return response;
    } catch (e) {
      debugError(e);

      return { error: e.message };
    }
  }

  // fetches all sms deliveries
  public async getSmsDeliveries(params) {
    try {
      const response = await this.get('/telnyx/sms-deliveries', params);

      return response;
    } catch (e) {
      debugError(e);

      return { error: e.message };
    }
  }
} // end class
