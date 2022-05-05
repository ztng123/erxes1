import { sendCommonMessage, sendCoreMessage } from "../../messageBroker";

const removeEmptyValues = obj => {
  const newObj = {};

  for (const key in obj) {
    if (!Array.isArray(obj[key] || [])) {
      continue;
    }
    const value = (obj[key] || []).filter(k => k);

    if (value.length > 0) {
      newObj[key] = value;
    }
  }

  return newObj;
};

const getCustomFieldsDataWithValue = async (customFieldsData: any) => {
  if (!customFieldsData || customFieldsData.length === 0) {
    return [];
  }

  const customFields: any[] = [];

  const fieldIds = (customFieldsData || []).map(d => d.field);

  const fields = await sendCommonMessage({
    subdomain: "os",
    data: {
      query: {
        _id: { $in: fieldIds },
      },
    },
    serviceName: "forms",
    action: "fields.find",
    isRPC: true,
    defaultValue: [],
  });

  for (const customFieldData of customFieldsData || []) {
    const field = fields.find(f => f._id === customFieldData.field);

    if (field) {
      customFields.push({
        text: field.text,
        data: customFieldData.value,
        code: field.code,
      });
    }
  }

  return customFields;
};

const getProducts = async (productIds: string[]) => {
  return sendCommonMessage({
    subdomain: "os",
    data: { _id: { $in: productIds } },
    action: "find",
    serviceName: "products",
    defaultValue: [],
    isRPC: true,
  });
};

const getAssignedUsers = async (assignedUserIds: string[]) => {
  const assignedUsers = await sendCoreMessage({
    subdomain: "os",
    data: {
      query: {
        _id: { $in: assignedUserIds },
      },
    },
    action: "users.find",
    defaultValue: [],
    isRPC: true,
  });

  return assignedUsers;
};

const getStage = async (deal: any) => {
  const stage = await sendCommonMessage({
    subdomain: "os",
    data: { _id: deal.stageId },
    action: "stages.findOne",
    serviceName: "cards",
    isRPC: true,
  });

  return stage;
};

const queries = {
  /**
   * Group engage messages counts by kind, status, tag
   */
  async dealsForRentpay(
    _root,
    {
      searchValue,
      ids,
      priceRange,
      district,
      customFields,
      customerIds,
      buyerIds,
      waiterIds,
      stageId,
      limit,
      skip,
    }
  ) {
    const filter: any = {};

    if (priceRange) {
      const prices = priceRange.split(",");

      filter.unitPrice = {
        $gte: parseInt(prices[0], 10),
      };

      if (prices.length === 2) {
        filter.unitPrice.$lte = parseInt(prices[1], 10);
      }
    }

    if (searchValue) {
      filter.description = new RegExp(`.*${searchValue}.*`, "i");
    }

    if (district) {
      const districts = district.split(",");

      const categories = await sendCommonMessage({
        subdomain: "os",
        isRPC: true,
        data: { query: { code: { $in: districts } } },
        action: "categories.find",
        serviceName: "products",
        defaultValue: [],
      });

      const districtIds = categories.map(p => p._id);

      const childCategories = await sendCommonMessage({
        subdomain: "os",
        isRPC: true,
        data: { query: { parentId: { $in: districtIds } } },
        action: "categories.find",
        serviceName: "products",
        defaultValue: [],
      });

      const catIds = childCategories.map(p => p._id);

      filter.categoryId = { $in: catIds };
    }

    let dealFilter: any = {};

    if (Object.keys(filter).length > 0) {
      const products = await sendCommonMessage({
        subdomain: "os",
        data: { query: filter },
        action: "find",
        serviceName: "products",
        defaultValue: [],
        isRPC: true,
      });

      const productIds = products.map(p => p._id);

      dealFilter["productsData.productId"] = { $in: productIds };
    } else {
      dealFilter["productsData.0"] = { $exists: true };
    }

    if (customFields) {
      const newCustomFields = removeEmptyValues(customFields);

      const fields = Object.keys(newCustomFields);

      if (fields.length > 0) {
        dealFilter.$and = [];

        for (const field of fields) {
          let subFilter;

          if (newCustomFields[field].length === 1) {
            subFilter = {
              customFieldsData: {
                $elemMatch: {
                  field,
                  value: newCustomFields[field][0],
                },
              },
            };
          } else {
            subFilter = {
              $or: newCustomFields[field].map(value => ({
                customFieldsData: {
                  $elemMatch: {
                    field,
                    value,
                  },
                },
              })),
            };
          }

          dealFilter.$and.push(subFilter);
        }
      }
    }

    if (ids && ids.length > 0) {
      dealFilter = { _id: { $in: ids } };
    }

    if (customerIds && customerIds.length > 0) {
      const relIds = await sendCoreMessage({
        subdomain: "os",
        data: {
          mainType: "customer",
          mainTypeIds: customerIds,
          relType: "deal",
        },
        action: "conformities.filterConformity",
        isRPC: true,
        defaultValue: [],
      });

      if (relIds.length === 0) {
        return {
          list: [],
          totalCount: 0,
        };
      }

      dealFilter = { _id: { $in: relIds } };
    }

    if (buyerIds && buyerIds.length > 0) {
      const relIds = await sendCoreMessage({
        subdomain: "os",
        data: {
          mainType: "buyerCustomer",
          mainTypeIds: buyerIds,
          relType: "deal",
        },
        action: "conformities.filterConformity",
        isRPC: true,
        defaultValue: [],
      });

      if (relIds.length === 0) {
        return {
          list: [],
          totalCount: 0,
        };
      }

      dealFilter = { _id: { $in: relIds } };
    }

    if (waiterIds && waiterIds.length > 0) {
      const relIds = await sendCoreMessage({
        subdomain: "os",
        data: {
          mainType: "waiterCustomer",
          mainTypeIds: waiterIds,
          relType: "deal",
        },
        action: "conformities.filterConformity",
        isRPC: true,
        defaultValue: [],
      });

      if (relIds.length === 0) {
        return {
          list: [],
          totalCount: 0,
        };
      }

      dealFilter = { _id: { $in: relIds } };
    }

    if (stageId) {
      dealFilter.stageId = stageId;
    }

    const deals = await sendCommonMessage({
      subdomain: "os",
      data: {
        query: dealFilter,
        sort: { order: 1 },
        skip,
        limit,
      },
      action: "deals.find",
      serviceName: "cards",
      defaultValue: [],
      isRPC: true,
    });

    const productIds: string[] = deals.map(
      deal => deal.productsData[0].productId
    );

    let products: any[] = [];

    if (productIds.length > 0) {
      products = await getProducts(productIds);
    }

    const assignedUserIds: string[] = deals.flatMap(
      d => d.assignedUserIds || []
    );

    const uniqueUserIds = [...new Set(assignedUserIds)];
    const assignedUsers = await getAssignedUsers(uniqueUserIds);

    for (const deal of deals) {
      const { customFieldsData } = deal;

      deal.customFieldsData = await getCustomFieldsDataWithValue(
        customFieldsData
      );

      deal.assignedUsers = assignedUsers.filter(user =>
        (deal.assignedUserIds || []).includes(user._id)
      );

      deal.stage = stageId ? {} : await getStage(deal);

      const product = products.find(
        p => p._id === deal.productsData[0].productId
      );

      if (product) {
        deal.products = [product];
      }
    }

    const totalCount = await sendCommonMessage({
      subdomain: "os",
      data: dealFilter,
      action: "deals.count",
      serviceName: "cards",
      defaultValue: 0,
      isRPC: true,
    });

    return {
      list: deals,
      totalCount,
    };
  },

  async dealDetailForRentpay(_root, { _id }) {
    const deal = await sendCommonMessage({
      subdomain: "os",
      isRPC: true,
      data: { _id },
      action: "deals.findOne",
      serviceName: "cards",
    });

    const { customFieldsData } = deal;

    deal.customFieldsData = await getCustomFieldsDataWithValue(
      customFieldsData
    );

    const productId: string =
      deal.productsData && deal.productsData.length > 0
        ? deal.productsData[0].productId
        : "";

    if (productId) {
      deal.products = await getProducts([productId]);
    }

    deal.assignedUsers = await getAssignedUsers(deal.assignedUserIds || []);

    return deal;
  },

  async fieldsForRentpay(
    _root,
    {
      contentType,
      searchable,
      code,
    }: {
      contentType: string;
      searchable: boolean;
      code: string;
    }
  ) {
    const query: any = { contentType };

    if (code) {
      const group = await sendCommonMessage({
        subdomain: "os",
        data: { code },
        action: "fieldsGroups.findOne",
        serviceName: "forms",
        defaultValue: null,
        isRPC: true,
      });

      if (!group) {
        throw new Error(`Group not found with ${code}`);
      }

      query.groupId = group._id;
    }

    if (searchable !== undefined) {
      query.searchable = searchable;
    }

    return sendCommonMessage({
      subdomain: "os",
      data: { query, sort: { order: 1 } },
      action: "fields.find",
      serviceName: "forms",
      defaultValue: [],
      isRPC: true,
    });
  },
};

export default queries;
