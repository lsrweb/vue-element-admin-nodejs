const {photeFilter, fileSize, filesSize} = require("../config/default.config");


// 创建树结构
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
          affix: parent.affix == "true" ? true : false,
          button_per:  parent.permission
        }
        parent.alwaysShow = parent.alwaysShow == "true" ? parent.alwaysShow : false
        parent.redirect = parent.redirect == "true" ? parent.children[0].path : ''

      }
      // 如果没有子元素
      if (!item.children) {
        item.meta = {
          title: item.title,
          icon: item.icon,
          affix: item.affix == "true" ? true : false,
          button_per: item.permission.split(',')
        }
        item.alwaysShow = item.alwaysShow == "true" ? item.alwaysShow : false
        item.redirect = item.redirect == 'true' ? item.children[0].path : ''
      }
    }
    else
    {
      // 顶级路由
      item.meta = {
        title: item.title,
        icon: item.icon,
        affix: item.affix == "true" ? true : false,
        button_per: item.permission ? item.permission.split(',') : delete item['permission']
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
  return photeFilter.includes(file);
}
// 图片大小验证
const filterImageSize = (file) => {
  return file / 1024 / 1024 < fileSize
}
// 文件大小验证
const filterFileSize = (file) => {
  return file / 1024 / 1024 < filesSize
}

// 格式化时间 验证文件夹
const formTime = (date) => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  return `${year}${month}`
}

// 存储创建获取时间
const getTime = () => {
  const createdAt = new Date().getTime()
  const updated = new Date().getTime()
  return {
    created: createdAt,
    updated: updated
  }
}

// 修改条目时间更新
const changeUpdatedTime = () => {
  return new Date().getTime()
}
// 快速判断对象中某值是否为空
const objectValidate = (arrayDoc,array) => {
  const docTxtArray = arrayDoc
  const arrayObject = array
  for (const i in arrayObject) {
    if (arrayObject[i] == '') {
      for (const key in docTxtArray) {
        if (i == key) {
          console.log(`${docTxtArray[key]}`)
          return `${docTxtArray[key]}`
        }
      }
    }
  }
}

// 删除对象中某值
const deleteObjKey = (data,deleteData) => {
  let getData = data
  for (const i in getData) {
    for (const d in deleteData) {
      delete getData[deleteData[d]]
    }
  }
  return getData
}


module.exports = {
  toTree,
  buildArray,
  filterImage,
  filterImageSize,
  filterFileSize,
  formTime,
  getTime,
  changeUpdatedTime,
  objectValidate,
  deleteObjKey
}
