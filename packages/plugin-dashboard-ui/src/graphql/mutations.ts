const add = `
  mutation dashboardsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    dashboardsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation dashboardsRemove($_id: String!){
    dashboardsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation dashboardsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    dashboardsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    dashboardTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    dashboardTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    dashboardTypesEdit(_id: $_id, name: $name){
      _id
    }
  }
`;

export default {
  add,
  remove,
  edit,
  addType,
  removeType,
  editType
};
