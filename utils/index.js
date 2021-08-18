const buildTree = (tarArray) => {
  let obj = {}
  tarArray.map((item, index) => {
    obj[item.id] = item
  })
  let newArr = [];
  for (let i = 0; i < tarArray.length; i++) {
    let item = tarArray[i]
    let parent = obj[item.pid]
    if (parent) {
      if (parent.children) {
        parent.children.push(item)
      } else {
        parent.children = []
        parent.children.push(item)
      }
    } else {
      newArr.push(item)
    }
  }
  return newArr
}

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
      item.meta = {
        title: item.title,
        icon: item.icon,
        affix: item.affix == "true" ? true : false
        // alwaysShow: item.alwaysShow == "true" ? true : false
      }
      menu.push(item);
    }
  });
  return menu;
}

module.exports = {
  buildTree,
  toTree
}
