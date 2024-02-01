const add = `
  mutation documentsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    documentsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation documentsRemove($_id: String!){
    documentsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation documentsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    documentsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    documentTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    documentTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    documentTypesEdit(_id: $_id, name: $name){
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
