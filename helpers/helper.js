const _ = require('lodash');

module.exports = {
  // Handle nested objects
  handleNestedObject(obj, data, parentObj = {}){
    if(_.isEmpty(obj)){
      return {};
    }
    const [parent, ...child] = obj.split('.');
    if(!parentObj[parent]){
      	parentObj[parent] = {};
    }
	if(child.length == 1){
		parentObj[parent][child[0]] = data?.trim() || '';
	}else {
		parentObj[parent] = this.handleNestedObject(child.join('.'), data, parentObj[parent]);
	}
    return parentObj;
  },
}
