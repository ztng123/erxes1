const add = `
  mutation menusAdd($name: String!, $expiryDate: Date, $typeId:String) {
    menusAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation menusRemove($_id: String!){
    menusRemove(_id: $_id)
  }
  `;

const edit = `
  mutation menusEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    menusEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    menuTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    menuTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    menuTypesEdit(_id: $_id, name: $name){
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
