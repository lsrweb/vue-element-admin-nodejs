/*
 Navicat Premium Data Transfer

 Source Server         : express
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : http://123.57.150.75/
 Source Schema         : express

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 28/08/2021 14:19:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permission_router
-- ----------------------------
DROP TABLE IF EXISTS `permission_router`;
CREATE TABLE `permission_router`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'id,请注意!!!!!!!添加完成路由后必须添加页面对应按钮权限',
  `pid` int(20) NOT NULL COMMENT '父级元素id',
  `component` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应组件,一级菜单填写Layout,二级及其他菜单由前端文件决定',
  `path` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '访问路径',
  `sort` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路由排序',
  `title` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路由标题,用于显示pageTitle以及面包屑文字',
  `icon` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜单图标,由前端定制',
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '// 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题',
  `redirect` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '默认跳转地址 true默认跳转 子路由子一个 false 为空',
  `alwaysShow` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '是否忽略子元素显示规则,父级路由可以修改',
  `affix` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '是否固定至tag-views',
  `created_router` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点创建时间',
  `updated_router` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '节点更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission_router
-- ----------------------------
INSERT INTO `permission_router` VALUES (1, 0, 'Layout', '/permission', '0', '权限管理', 'dashboard', 'permission', 'true', 'true', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (6, 1, '/permission/index', '/permission/role', '0', '角色管理', 'dashboard', 'role', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (7, 1, '/permission/router', '/permission/router', '0', '节点管理', 'dashboard', 'router', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (8, 0, 'Layout', 'Layout', '0', '页面测试', 'dashboard', 'table', 'false', 'true', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (9, 8, '/table/index', '/table/index', '0', '表格', 'dashboard', 'table_c', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (10, 1, '/permission/user', '/permission/user', '0', '管理员管理', 'dashboard', 'user', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (11, 8, '/table/test', '/table/test', '0', '单元测试', 'dashboard', 'table_t', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (12, 8, '/table/test', '/table/test', '0', '测测', 'dashboard', 'tebale_tt', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (13, 8, '/table/test', '/table/test', '0', '1', 'dashboard', 'table_ttt', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (14, 8, '/table/article', '/table/article', '0', 'cc', 'dashboard', 'table_tttt', 'false', 'false', 'false', '1', '1');
INSERT INTO `permission_router` VALUES (15, 8, '/table/woc', '/tablewoc', '0', 'woc', '404', 'table_woc', 'false', 'false', 'false', '1', '1');

-- ----------------------------
-- Table structure for permission_router_button
-- ----------------------------
DROP TABLE IF EXISTS `permission_router_button`;
CREATE TABLE `permission_router_button`  (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `permission` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '按钮权限,add ? look ? change ....',
  `user` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '对应用户id',
  `role` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应角色id',
  `router_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '对应路由id',
  `created_button` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '创建时间',
  `updated_button` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permission_router_button
-- ----------------------------
INSERT INTO `permission_router_button` VALUES (2, '', NULL, '1', '1', '112314', '1');
INSERT INTO `permission_router_button` VALUES (3, 'add', NULL, '1', '6', '1231241', '1');
INSERT INTO `permission_router_button` VALUES (4, 'add,delete', NULL, '1', '7', '1231231', '1');
INSERT INTO `permission_router_button` VALUES (5, '', NULL, '1', '8', '1', '1');
INSERT INTO `permission_router_button` VALUES (6, 'add', NULL, '1', '9', '1', '1');
INSERT INTO `permission_router_button` VALUES (7, 'delete', NULL, '1', '10', '1', '1');
INSERT INTO `permission_router_button` VALUES (9, 'add', NULL, '1', '12', '1', '1');
INSERT INTO `permission_router_button` VALUES (8, 'add', NULL, '1', '11', '1', '1');
INSERT INTO `permission_router_button` VALUES (10, 'add', NULL, '1', '13', '1', '1');
INSERT INTO `permission_router_button` VALUES (11, 'add', NULL, '1', '14', '1', '1');
INSERT INTO `permission_router_button` VALUES (12, 'add', NULL, '1', '15', '1', '1');
INSERT INTO `permission_router_button` VALUES (13, 'add', NULL, '1', '16', '1', '1');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(30) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_router` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '权限路由,每个路由节点id之间用英文 , 隔开',
  `role_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `role` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色辨识',
  `created` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色创建时间',
  `update` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '1,6,7,8', '超管', 'admin', '1', '1');
INSERT INTO `role` VALUES (2, '9,10,11,12,13,14', '普管', 'normal_admin', '1', '1');

-- ----------------------------
-- Table structure for to_do
-- ----------------------------
DROP TABLE IF EXISTS `to_do`;
CREATE TABLE `to_do`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `text` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '列表名',
  `done` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '是否已完成该条目',
  `created` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '条目创建时间',
  `updated` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '条目更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of to_do
-- ----------------------------
INSERT INTO `to_do` VALUES (24, '12312', '0', '1629455553054', '1629455553054');
INSERT INTO `to_do` VALUES (22, '嘿嘿', '0', '1629382163422', '1629382163422');
INSERT INTO `to_do` VALUES (23, '嘿嘿', '0', '1629382164973', '1629382164973');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `id` int(30) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `account` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录\r\n账号',
  `email` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `is_active` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '是否通过邮箱验证',
  `avatar` varchar(120) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户头像',
  `password` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `created` int(11) NULL DEFAULT NULL COMMENT '创建时间',
  `updated` int(11) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (2, '我靠', 'admins', '2975971434@qq.com', 'true', 'asstes/avatar.jpg', '123123', NULL, NULL);
INSERT INTO `user_info` VALUES (3, '我靠', 'a123111_', '297@gamil.com', NULL, 'assets/avatar.jpg', 'a123111_', NULL, NULL);
INSERT INTO `user_info` VALUES (4, '我靠', '1', '297@gamil.com', NULL, 'assets/avatar.jpg', 'a123111_', NULL, NULL);
INSERT INTO `user_info` VALUES (5, '我靠', '11', '297@gamil.com', NULL, 'assets/avatar.jpg', 'a123111_', NULL, NULL);
INSERT INTO `user_info` VALUES (6, '我靠', 'admin', '297@gamil.com', NULL, 'assets/avatar.jpg', '29f4f99effde2d6891ac76e9d1b099d8', NULL, NULL);
INSERT INTO `user_info` VALUES (7, '我靠', '13954967', '297@gamil.com', NULL, 'assets/avatar.jpg', '29f4f99effde2d6891ac76e9d1b099d8', NULL, NULL);
INSERT INTO `user_info` VALUES (8, '我靠', '13954967123', '297@gamil.com', NULL, 'assets/avatar.jpg', '29f4f99effde2d6891ac76e9d1b099d8', NULL, NULL);
INSERT INTO `user_info` VALUES (9, '我靠', '139549671231', '297@gamil.com', NULL, 'assets/avatar.jpg', '29f4f99effde2d6891ac76e9d1b099d8', NULL, NULL);

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo`  (
  `id` int(30) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `pid` int(30) NOT NULL COMMENT '父级用户id',
  `role` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户角色',
  `avatar` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像',
  `usercop` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户信息描述',
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '账号所属用户名',
  `created` int(30) NULL DEFAULT NULL COMMENT '创建时间',
  `updated` int(60) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES (1, 6, '1,2', 'assets/avatar.jpg', '用户介绍', '123', 1, 1);

-- ----------------------------
-- View structure for a
-- ----------------------------
DROP VIEW IF EXISTS `a`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `a` AS select `test`.`id` AS `id`,`test2`.`pid` AS `pid` from (`test` join `test2`);

SET FOREIGN_KEY_CHECKS = 1;
