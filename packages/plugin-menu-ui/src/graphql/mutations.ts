const add = `
  mutation menusAdd($name: String!, $expiryDate: Date, $typeId:String,$title: String, $content: String, $showTitle: Boolean) {
    menusAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId,title: $title, content: $content, showTitle: $showTitle) {
      name
      _id
      expiryDate
      typeId
      title
      content
      showTitle
    }
  }
`;

const remove = `
  mutation menusRemove($_id: String!){
    menusRemove(_id: $_id)
  }
  `;

const edit = `
  mutation menusEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String, $title: String, $content: String, $showTitle: Boolean){
    menusEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId,title: $title, content: $content, showTitle: $showTitle){
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
