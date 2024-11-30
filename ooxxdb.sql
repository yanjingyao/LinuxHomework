/*
 Navicat Premium Dump SQL

 Source Server         : ooxx
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : ooxxdb

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 01/12/2024 02:05:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for game_records
-- ----------------------------
DROP TABLE IF EXISTS `game_records`;
CREATE TABLE `game_records`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `time` time NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 28 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = MyISAM AUTO_INCREMENT = 55 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
