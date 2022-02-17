import { IBrandDocument } from "../../api-core/src/db/models/definitions/brands";
import { IUser } from "../../api-core/src/db/models/definitions/users";
import { ICustomer } from "../../plugin-contact-api/src/models/definitions/customers";

import * as _ from "lodash";
import { URL } from "url";

export interface IReplacer {
  key: string;
  value: string;
}

export interface IArgs {
  content: string;
  customer?: ICustomer | null;
  user?: IUser | null;
  customerFields?: string[];
  item?: any;
  brand?: IBrandDocument;
}

export interface ICustomerField {
  _id: number;
  name: string;
  group?: string;
  label?: string;
  type?: string;
  validation?: string;
  options?: string[];
  selectOptions?: Array<{ label: string; value: string }>;
}

const isValidURL = (url: string): boolean => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export function runReplacersOn(
  content: string,
  replacers: IReplacer[] = []
): string {
  let replacedContent = content;

  for (const replacer of replacers) {
    const regex = new RegExp(replacer.key, "gi");

    replacedContent = replacedContent.replace(regex, replacer.value);
  }

  return replacedContent;
}

export default class EditorAttributeUtil {
  private _possibleCustomerFields?: ICustomerField[];
  private API_DOMAIN: string;
  private msgBrokerClient: any;

  constructor(msgBrokerClient: any, API_DOMAIN: string) {
    this.msgBrokerClient = msgBrokerClient;
    this.API_DOMAIN = API_DOMAIN;
  }

  async fileToFileLink(url?: string, name?: string): Promise<string> {
    if (!url) {
      return "";
    }

    let href: string;
    if (isValidURL(url) || url.includes("/")) {
      href = url;
    } else {
      const key = url;
      const uriName = name ? encodeURIComponent(name) : url;
      href = `${this.API_DOMAIN}/read-file?key=${key}&name=${uriName}`;
    }

    return `<a target="_blank" download href="${href}">${name || url}</a>`;
  }

  async customFieldsDataItemToFileLink(
    customFieldDataItem: any
  ): Promise<string> {
    const value = customFieldDataItem.value;

    if (Array.isArray(value)) {
      const links = await Promise.all(
        value.map((v) => this.fileToFileLink(v.url, v.name))
      );
      return links.join(" | ");
    }

    return this.fileToFileLink(value.url, value.name);
  }

  async getPossibleCustomerFields(): Promise<ICustomerField[]> {
    if (!this._possibleCustomerFields) {
      this._possibleCustomerFields = await this.msgBrokerClient.sendRPCMessage(
        "rpc_queue:fieldsCombinedByContentType",
        { contentType: "customer" }
      );
    }

    if (!this._possibleCustomerFields) {
      throw new Error("Cannot acquire possibleCustomerFields");
    }

    return this._possibleCustomerFields || [];
  }

  async getCustomerFields(content: string): Promise<string[]> {
    const customerFields = ["firstName", "lastName", "middleName"];
    const possibleCustomerFields = await this.getPossibleCustomerFields();

    for (const field of possibleCustomerFields) {
      if (!content.includes(`{{ customer.${field.name} }}`)) {
        continue;
      }

      if (field.name.includes("trackedData")) {
        customerFields.push("trackedData");
        continue;
      }

      if (field.name.includes("customFieldsData")) {
        customerFields.push("customFieldsData");
        continue;
      }

      customerFields.push(field.name);
    }

    return customerFields;
  }

  async fillMissingCustomFieldsDataItemOfCustomer(
    content: string,
    customer: ICustomer
  ): Promise<void> {
    if (!customer.customFieldsData) {
      customer.customFieldsData = [];
    }

    const existingItemsByFieldId = _.keyBy(
      customer.customFieldsData,
      "field"
    );

    const possibleCustomerFields = await this.getPossibleCustomerFields();

    for (const field of possibleCustomerFields) {
      if (!content.includes(`{{ customer.${field.name} }}`)) {
        continue;
      }

      if (field.name.includes("customFieldsData")) {
        const fieldId = field.name.split(".").pop();

        // if content has attribute that doesn't have fieldId, fill with dummy item
        // if content has field attribute that doesn't exist on the customer.customFieldsData, fill with dummy item
        if (!fieldId || !existingItemsByFieldId[fieldId]) {
          customer.customFieldsData.push({
            field: fieldId || "",
            stringValue: "",
            value: "",
          });
        }
      }
    }
  }

  async getCustomerName(customer) {
    return this.msgBrokerClient.sendRPCMessage(
      "rpc_queue:editorAttributeUtils_getCustomerName_to_api",
      customer
    );
  }

  async generateAmounts(productsData) {
    return this.msgBrokerClient.sendRPCMessage(
      "rpc_queue:editorAttributeUtils_generateAmounts_to_api",
      productsData
    );
  }

  async generateProducts(productsData): Promise<any> {
    return this.msgBrokerClient.sendRPCMessage(
      "rpc_queue:editorAttributeUtils_generateProducts_to_api",
      productsData
    );
  }

  async generateReplacers(args: IArgs): Promise<IReplacer[]> {
    const { content, user, brand, item } = args;
    const replacers: IReplacer[] = [];

    // replace customer fields
    if (args.customer) {
      const customer = args.customer;
      let customerFields = args.customerFields;

      if (!customerFields || customerFields.length === 0) {
        customerFields = await this.getCustomerFields(content);
      }

      await this.fillMissingCustomFieldsDataItemOfCustomer(content, customer);

      replacers.push({
        key: "{{ customer.name }}",
        value: await this.getCustomerName(customer),
      });

      const customerFileFieldsById = _.keyBy(
        await this.msgBrokerClient.sendRPCMessage("rpc_queue:Fields.find", {
          query: {
            type: "file",
            contentType: "customer",
          },
        }),
        "_id"
      );

      for (const field of customerFields) {
        if (
          field.includes("trackedData") ||
          field.includes("customFieldsData")
        ) {
          const dbFieldName = field.includes("trackedData")
            ? "trackedData"
            : "customFieldsData";

          for (const customFieldsDataItem of customer[dbFieldName] || []) {
            const replaceValue = customerFileFieldsById[
              customFieldsDataItem.field
            ]
              ? await this.customFieldsDataItemToFileLink(customFieldsDataItem)
              : customFieldsDataItem.stringValue ||
                customFieldsDataItem.value ||
                "";

            replacers.push({
              key: `{{ customer.${dbFieldName}.${customFieldsDataItem.field} }}`,
              value: replaceValue,
            });
          }

          continue;
        }

        replacers.push({
          key: `{{ customer.${field} }}`,
          value: customer[field] || "",
        });
      }
    }

    // replace user fields
    if (user) {
      replacers.push({ key: "{{ user.email }}", value: user.email || "" });

      if (user.details) {
        replacers.push({
          key: "{{ user.fullName }}",
          value: user.details.fullName || "",
        });
        replacers.push({
          key: "{{ user.position }}",
          value: user.details.position || "",
        });
      }
    }

    // replace brand fields
    if (brand) {
      replacers.push({ key: "{{ brandName }}", value: brand.name || "" });
    }

    // deal, ticket, task mapping
    if (item) {
      replacers.push({ key: "{{ itemName }}", value: item.name || "" });
      replacers.push({
        key: "{{ itemDescription }}",
        value: item.description || "",
      });

      replacers.push({
        key: "{{ itemCloseDate }}",
        value: item.closeDate
          ? new Date(item.closeDate).toLocaleDateString()
          : "",
      });
      replacers.push({
        key: "{{ itemCreatedAt }}",
        value: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      });
      replacers.push({
        key: "{{ itemModifiedAt }}",
        value: item.modifiedAt
          ? new Date(item.modifiedAt).toLocaleDateString()
          : "",
      });

      const products = await this.generateProducts(item.productsData);
      const amounts = await this.generateAmounts(item.productsData);

      replacers.push({
        key: "{{ dealProducts }}",
        value: products.map((p) => p.product.name).join(","),
      });
      replacers.push({
        key: "{{ dealAmounts }}",
        value: Object.keys(amounts)
          .map((key) => `${amounts[key]}${key}`)
          .join(","),
      });

      const fieldMetaDatas = await this.msgBrokerClient.sendRPCMessage(
        "rpc_queue:Fields.find",
        {
          query: {
            contentType: item.contentType,
            isDefinedByErxes: false,
          },
        }
      );

      for (const fieldMetaData of fieldMetaDatas) {
        const customFieldsData = item.customFieldsData || [];
        const customFieldsDataItem = customFieldsData.find(
          (c) => c.field === fieldMetaData._id
        );

        const key = `{{ itemCustomField.${fieldMetaData._id} }}`;

        if (!customFieldsDataItem) {
          if (content.includes(key)) {
            replacers.push({
              key,
              value: "",
            });
          }
          continue;
        }

        const replaceValue =
          fieldMetaData.type === "file"
            ? await this.customFieldsDataItemToFileLink(customFieldsDataItem)
            : customFieldsDataItem.stringValue ||
              customFieldsDataItem.value ||
              "";

        replacers.push({
          key,
          value: replaceValue,
        });
      }
    }

    return replacers;
  }

  async replaceAttributes(args: IArgs): Promise<string> {
    const replacers: IReplacer[] = await this.generateReplacers(args);
    const replacedContent = runReplacersOn(args.content, replacers);
    return replacedContent;
  }
}