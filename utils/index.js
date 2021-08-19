// 创建属性结构
const toTree = (data, idName, parentIdName) => {
  const id = idName || "id";
  const parentId = parentIdName || "pid";
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children;
  });
  const map = {};
  data.forEach(function (item) {
    map[item[id]] = item;
  });
  const menu = [];
  data.forEach(function (item) {
    const parent = map[item[parentId]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
      // 如果父级有子元素
      if (parent.children) {
        toTree(parent.children)
        parent.meta = {
          title: parent.title,
          icon: parent.icon,
          affix: parent.affix == "true" ? true : false
        }
        parent.alwaysShow = parent.alwaysShow == "true" ? parent.alwaysShow : false
        parent.redirect = parent.redirect == "true" ? parent.children[0].path : ''
      }
      // 如果没有子元素
      if (!item.children) {
        item.meta = {
          title: item.title,
          icon: item.icon,
          affix: item.affix == "true" ? true : false
        }
        item.alwaysShow = item.alwaysShow == "true" ? item.alwaysShow : false
        item.redirect = item.redirect == 'true' ? item.children[0].path : ''
      }
    } else {
      // 顶级路由
      item.meta = {
        title: item.title,
        icon: item.icon,
        affix: item.affix == "true" ? true : false
      }
      menu.push(item);
    }
  });
  return menu;
}

// 数组扁平
const buildArray = (arr) => {
  let res6 = [];
  for(let i=0; i < arr.length; i++){
    if(Array.isArray(arr[i])){
      res6 = res6.concat(buildArray(arr[i]))
    }else{
      res6.push(arr[i])
    }
  }
  return res6;
}

module.exports = {
  toTree,
  buildArray
}
