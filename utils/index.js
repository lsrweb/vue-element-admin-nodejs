// 创建树结构
const {photeFilter, fileSize, filesSize} = require("../config/default.config");
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
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res6 = res6.concat(buildArray(arr[i]))
    } else {
      res6.push(arr[i])
    }
  }
  return res6;
}
// 图片格式验证
const filterImage = (file) => {
  if (photeFilter.includes(file)) {
    return true
  } else {
    return false
  }
}
// 图片大小验证
const filterImageSize = (file) => {
  const isFileSize = file / 1024 / 1024 < fileSize
  return isFileSize
}
// 文件大小验证
const filterFileSize = (file) => {
  const isFileSize = file / 1024 / 1024 < filesSize
  return isFileSize
}

// 格式化时间 验证文件夹
const formTime = (date) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  return `${year}${month}`
}


module.exports = {
  toTree,
  buildArray,
  filterImage,
  filterImageSize,
  filterFileSize,
  formTime
}
