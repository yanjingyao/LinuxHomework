/*
 Navicat Premium Dump SQL

 Source Server         : ooxxdb
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : ooxxdb

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 20/11/2024 16:25:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for personal_history
-- ----------------------------
DROP TABLE IF EXISTS `personal_history`;
CREATE TABLE `personal_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `score` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of personal_history
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'aye9394@163.com', '2024-11-17 23:27:53', '2024-11-18 00:47:52', 'aye9394');
INSERT INTO `users` VALUES (3, '277445839@qq.com', '2024-11-18 00:49:14', '2024-11-18 00:49:14', 'aye');
INSERT INTO `users` VALUES (4, '1545351052@qq.com', '2024-11-20 15:33:07', '2024-11-20 15:33:07', '1');

-- ----------------------------
-- Table structure for verification_codes
-- ----------------------------
DROP TABLE IF EXISTS `verification_codes`;
CREATE TABLE `verification_codes`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`, `code`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of verification_codes
-- ----------------------------
INSERT INTO `verification_codes` VALUES (1, '1759367108@qq.com', '664176', '2024-11-17 22:40:29');
INSERT INTO `verification_codes` VALUES (2, '1759367108@qq.com', '627522', '2024-11-17 22:48:10');
INSERT INTO `verification_codes` VALUES (3, '1759367108@qq.com', '262166', '2024-11-17 22:48:57');
INSERT INTO `verification_codes` VALUES (4, '1759367108@qq.com', '200860', '2024-11-17 22:49:17');
INSERT INTO `verification_codes` VALUES (5, '1759367108@qq.com', '405585', '2024-11-17 22:49:18');
INSERT INTO `verification_codes` VALUES (6, '1759367108@qq.com', '444329', '2024-11-17 22:49:20');
INSERT INTO `verification_codes` VALUES (7, '1759367108@qq.com', '561824', '2024-11-17 22:49:21');
INSERT INTO `verification_codes` VALUES (8, '1759367108@qq.com', '479198', '2024-11-17 22:50:05');
INSERT INTO `verification_codes` VALUES (9, 'aye9394@163.com', '726203', '2024-11-17 22:56:19');
INSERT INTO `verification_codes` VALUES (10, 'aye9394@163.com', '745758', '2024-11-17 23:02:47');
INSERT INTO `verification_codes` VALUES (11, 'aye9394@163.com', '973887', '2024-11-17 23:15:45');
INSERT INTO `verification_codes` VALUES (12, 'aye9394@163.com', '461314', '2024-11-17 23:19:20');
INSERT INTO `verification_codes` VALUES (13, 'aye9394@163.com', '950367', '2024-11-17 23:26:28');
INSERT INTO `verification_codes` VALUES (14, 'aye9394@163.com', '308167', '2024-11-17 23:27:27');
INSERT INTO `verification_codes` VALUES (15, 'aye9394@163.com', '709285', '2024-11-17 23:28:43');
INSERT INTO `verification_codes` VALUES (16, 'aye9394@163.com', '106664', '2024-11-17 23:38:21');
INSERT INTO `verification_codes` VALUES (17, 'aye9394@163.com', '597222', '2024-11-17 23:39:13');
INSERT INTO `verification_codes` VALUES (18, 'aye9394@163.com', '606713', '2024-11-17 23:43:01');
INSERT INTO `verification_codes` VALUES (19, 'aye9394@163.com', '891478', '2024-11-18 00:44:18');
INSERT INTO `verification_codes` VALUES (20, 'aye9394@163.com', '570119', '2024-11-18 00:44:25');
INSERT INTO `verification_codes` VALUES (21, 'aye9394@163.com', '506020', '2024-11-18 00:44:49');
INSERT INTO `verification_codes` VALUES (22, '277445839@qq.com', '720600', '2024-11-18 00:48:59');
INSERT INTO `verification_codes` VALUES (23, '277445839@qq.com', '863259', '2024-11-18 00:49:31');
INSERT INTO `verification_codes` VALUES (24, '277445839@qq.com', '169280', '2024-11-18 01:01:26');
INSERT INTO `verification_codes` VALUES (25, '277445839@qq.com', '991770', '2024-11-20 14:54:52');
INSERT INTO `verification_codes` VALUES (26, '1545351052@qq.com', '600096', '2024-11-20 15:32:52');
INSERT INTO `verification_codes` VALUES (27, '1545351052@qq.com', '362005', '2024-11-20 15:32:54');
INSERT INTO `verification_codes` VALUES (28, '1545351052@qq.com', '659707', '2024-11-20 15:32:55');
INSERT INTO `verification_codes` VALUES (29, '1545351052@qq.com', '363502', '2024-11-20 15:33:13');
INSERT INTO `verification_codes` VALUES (30, '1545351052@qq.com', '799161', '2024-11-20 15:33:26');
INSERT INTO `verification_codes` VALUES (31, '277445839@qq.com', '206661', '2024-11-20 15:40:24');
INSERT INTO `verification_codes` VALUES (32, '277445839@qq.com', '120010', '2024-11-20 15:43:30');

-- ----------------------------
-- Table structure for world_records
-- ----------------------------
DROP TABLE IF EXISTS `world_records`;
CREATE TABLE `world_records`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `score` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of world_records
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
