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

//   assignNestedObject(path, value, targetObj) {
//     const keys = path.split('.');
//     keys.reduce((nestedObj, key, idx) => {
//         if (!nestedObj[key]) {
//             // Initialize the key as an empty object if it doesn't exist
//             nestedObj[key] = {};
//         }

//         // If this is the last key, assign the value
//         if (idx === keys.length - 1) {
//             nestedObj[key] = value;
//         }

//         // Return the reference to the current level of the object
//         return nestedObj[key];
//     }, targetObj); // Initialize `nestedObj` as `targetObj`
//}
// handleNestedObject(path, value, parentObj = {}) {
//     const keys = path.split('.');
//     const lastKey = keys.pop(); // Get the last key
//     let currentObj = parentObj;

//     // Traverse the keys and create nested objects
//     for (const key of keys) {
//         if (!currentObj[key]) {
//             currentObj[key] = {};
//         }
//         currentObj = currentObj[key];
//     }

//     // Assign the value to the last key
//     currentObj[lastKey] = value;

//     return parentObj;
// }
}
