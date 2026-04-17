-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for db_ukkpp_new
CREATE DATABASE IF NOT EXISTS `db_ukkpp_new` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_ukkpp_new`;

-- Dumping structure for table db_ukkpp_new.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role`),
  CONSTRAINT `FK1_role` FOREIGN KEY (`role`) REFERENCES `m_role` (`role`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.admin: ~7 rows (approximately)
DELETE FROM `admin`;
INSERT INTO `admin` (`id_admin`, `username`, `password`, `role`, `created_at`) VALUES
	(1, 'admin', '$2b$10$nt36wgdEANocXnuuYtU0LO9KpqxX6GiZvw1qU1dgcOTL4k5x7gTcW', 'ADMIN', '2026-04-15 00:38:37'),
	(2, 'bk1', '$2b$10$meAfOTd7z.60ZvgX3xxaO.3RbMGNbRu/xjdaD6IdM7wkTM5tpwwTq', 'BK', '2026-04-15 00:38:37'),
	(3, 'wali1', '$2b$10$mgdU3DCakirz8wbA3HHxkeZ3jCVBCJ/pOMRfJEDYB3ucHmpvNkPS2', 'WALI_KELAS', '2026-04-15 00:38:37'),
	(4, 'guru1', '$2b$10$PwUqbsEBv9hDWU1K/FlYju4GzFJqitvGdXDXAFhZ9LPNA3EeTSHxe', 'GURU', '2026-04-15 00:38:37'),
	(5, 'indira', '$2b$10$j1nxmFsZVYX5btOEt7fExu8ICIQpF1z.EPX97s2ZwDSi4zXJ.0taq', 'GURU', '2026-04-16 04:07:19'),
	(6, 'admin_b', '$2b$10$m0QPF73eslBDC34vJyX8reWqCIIeXPsE2d42T0EB8c6oaGCq/.Exa', 'ADMIN', '2026-04-16 07:31:30'),
	(7, 'admin2', '$2b$10$tcxctRXmtg1M5OTUvJVOG.mV2eGEEzhOQmsemLXDa0iTpiZRd7C1m', 'ADMIN', '2026-04-16 07:31:47');

-- Dumping structure for table db_ukkpp_new.m_jurusan
CREATE TABLE IF NOT EXISTS `m_jurusan` (
  `id_jurusan` int NOT NULL AUTO_INCREMENT,
  `jurusan` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_jurusan`),
  KEY `nama_jurusan` (`jurusan`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.m_jurusan: ~6 rows (approximately)
DELETE FROM `m_jurusan`;
INSERT INTO `m_jurusan` (`id_jurusan`, `jurusan`) VALUES
	(5, 'BIDI 1'),
	(6, 'BIDI 2'),
	(4, 'DKV'),
	(1, 'RPL'),
	(2, 'TKJ 1'),
	(3, 'TKJ 2');

-- Dumping structure for table db_ukkpp_new.m_kelas
CREATE TABLE IF NOT EXISTS `m_kelas` (
  `id_kelas` int NOT NULL AUTO_INCREMENT,
  `kelas` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_kelas`),
  KEY `kelas` (`kelas`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.m_kelas: ~3 rows (approximately)
DELETE FROM `m_kelas`;
INSERT INTO `m_kelas` (`id_kelas`, `kelas`) VALUES
	(1, '10'),
	(2, '11'),
	(3, '12');

-- Dumping structure for table db_ukkpp_new.m_pelanggaran
CREATE TABLE IF NOT EXISTS `m_pelanggaran` (
  `id_pelanggaran` int NOT NULL AUTO_INCREMENT,
  `kode_pelanggaran` varchar(20) NOT NULL,
  `jenis` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `deskripsi` text NOT NULL,
  `sanksi` text,
  `poin` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pelanggaran`),
  UNIQUE KEY `kode_pelanggaran` (`kode_pelanggaran`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.m_pelanggaran: ~7 rows (approximately)
DELETE FROM `m_pelanggaran`;
INSERT INTO `m_pelanggaran` (`id_pelanggaran`, `kode_pelanggaran`, `jenis`, `deskripsi`, `sanksi`, `poin`, `created_at`) VALUES
	(1, 'PK1', 'KEHADIRAN', 'Tidak Masuk Tanpa Keterangan', 'Merangkum Pelajaran', 5, '2026-04-15 07:38:37'),
	(2, 'PK2', 'KEHADIRAN', 'Bolos', 'Push up', 10, '2026-04-15 07:38:37'),
	(3, 'PK3', 'KEHADIRAN', 'Tidak masuk 7 hari berturut-turut', 'Dikeluarkan', 100, '2026-04-15 07:38:37'),
	(4, 'PPA1', 'PAKAIAN', 'Seragam tidak rapi', 'Peringatan', 2, '2026-04-15 07:38:37'),
	(5, 'PPA2', 'PAKAIAN', 'Celana tidak sesuai', 'Dipulangkan', 2, '2026-04-15 07:38:37'),
	(6, 'PT1', 'KETERLAMBATAN', 'Terlambat masuk', 'Push up', 2, '2026-04-15 07:38:37'),
	(7, 'PT2', 'KETERLAMBATAN', 'Keluar tidak kembali', 'Push up', 5, '2026-04-15 07:38:37');

-- Dumping structure for table db_ukkpp_new.m_role
CREATE TABLE IF NOT EXISTS `m_role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_role`),
  KEY `role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.m_role: ~4 rows (approximately)
DELETE FROM `m_role`;
INSERT INTO `m_role` (`id_role`, `role`) VALUES
	(1, 'ADMIN'),
	(2, 'BK'),
	(3, 'GURU'),
	(4, 'WALI_KELAS');

-- Dumping structure for table db_ukkpp_new.m_siswa
CREATE TABLE IF NOT EXISTS `m_siswa` (
  `id_siswa` int NOT NULL AUTO_INCREMENT,
  `nipd` varchar(50) NOT NULL,
  `nama_siswa` varchar(100) NOT NULL,
  `kelas` varchar(10) NOT NULL,
  `jurusan` varchar(50) DEFAULT NULL,
  `creat_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_siswa`),
  UNIQUE KEY `nipd` (`nipd`),
  KEY `jurusan` (`jurusan`),
  KEY `kelas` (`kelas`),
  CONSTRAINT `FK1_jurusan` FOREIGN KEY (`jurusan`) REFERENCES `m_jurusan` (`jurusan`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK2_kelas` FOREIGN KEY (`kelas`) REFERENCES `m_kelas` (`kelas`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.m_siswa: ~6 rows (approximately)
DELETE FROM `m_siswa`;
INSERT INTO `m_siswa` (`id_siswa`, `nipd`, `nama_siswa`, `kelas`, `jurusan`, `creat_at`) VALUES
	(1, '2334103', 'nisa', '10', 'RPL', '2026-04-15 07:38:37'),
	(2, '2334104', 'candra', '11', 'TKJ 1', '2026-04-15 07:38:37'),
	(3, '2334105', 'sipa', '10', 'BIDI 1', '2026-04-15 07:38:37'),
	(4, '2334106', 'mutia', '12', 'RPL', '2026-04-15 07:38:37'),
	(6, '2334108', 'Uki', '11', 'DKV', '2026-04-17 07:35:38'),
	(7, '232410066', 'ahmad', '12', 'DKV', NULL),
	(9, '232410012', 'mahmud', '12', 'TKJ 2', NULL),
	(10, '232410031', 'karim', '11', 'TKJ 1', NULL),
	(11, '232410087', 'aan', '10', 'DKV', NULL),
	(12, '232410082', 'dika', '12', 'RPL', NULL),
	(13, '232410083', 'dapit', '11', 'TKJ 1', NULL),
	(14, '232410084', 'sapri', '10', 'DKV', NULL);

-- Dumping structure for table db_ukkpp_new.pelanggaran_siswa
CREATE TABLE IF NOT EXISTS `pelanggaran_siswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nipd` varchar(50) NOT NULL,
  `id_pelanggaran` int NOT NULL,
  `created_by` int NOT NULL,
  `tanggal` date NOT NULL,
  `catatan` text,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_nipd` (`nipd`),
  KEY `idx_pelanggaran` (`id_pelanggaran`),
  CONSTRAINT `pelanggaran_siswa_ibfk_1` FOREIGN KEY (`nipd`) REFERENCES `m_siswa` (`nipd`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pelanggaran_siswa_ibfk_2` FOREIGN KEY (`id_pelanggaran`) REFERENCES `m_pelanggaran` (`id_pelanggaran`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pelanggaran_siswa_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `admin` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table db_ukkpp_new.pelanggaran_siswa: ~9 rows (approximately)
DELETE FROM `pelanggaran_siswa`;
INSERT INTO `pelanggaran_siswa` (`id`, `nipd`, `id_pelanggaran`, `created_by`, `tanggal`, `catatan`) VALUES
	(1, '2334103', 1, 2, '2026-04-01', NULL),
	(2, '2334103', 2, 3, '2026-04-02', NULL),
	(3, '2334104', 6, 4, '2026-04-03', NULL),
	(4, '2334105', 4, 2, '2026-04-03', NULL),
	(5, '2334106', 7, 3, '2026-04-04', NULL),
	(6, '2334103', 4, 1, '2026-04-16', NULL),
	(9, '2334108', 5, 7, '2026-04-17', NULL),
	(10, '232410066', 1, 5, '2026-04-17', NULL),
	(11, '232410066', 7, 5, '2026-04-17', NULL),
	(14, '232410012', 2, 5, '2026-04-17', NULL),
	(15, '232410012', 5, 5, '2026-04-17', NULL),
	(16, '232410031', 3, 5, '2026-04-17', NULL),
	(17, '232410087', 4, 5, '2026-04-17', NULL),
	(18, '232410087', 6, 5, '2026-04-17', NULL),
	(19, '232410087', 2, 5, '2026-04-17', NULL);

-- Dumping structure for view db_ukkpp_new.v_detail_pelanggaran
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_detail_pelanggaran` (
	`nama_siswa` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`kelas` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nama_jurusan` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`kode_pelanggaran` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`deskripsi` TEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`poin` INT(10) NOT NULL,
	`tanggal` DATE NOT NULL,
	`input_by` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`role` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view db_ukkpp_new.v_total_poin
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `v_total_poin` (
	`nipd` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nama_siswa` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nama_jurusan` VARCHAR(50) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`kelas` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_poin` DECIMAL(32,0) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view db_ukkpp_new.v_detail_pelanggaran
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_detail_pelanggaran`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_detail_pelanggaran` AS select `s`.`nama_siswa` AS `nama_siswa`,`s`.`kelas` AS `kelas`,`j`.`jurusan` AS `nama_jurusan`,`p`.`kode_pelanggaran` AS `kode_pelanggaran`,`p`.`deskripsi` AS `deskripsi`,`p`.`poin` AS `poin`,`ps`.`tanggal` AS `tanggal`,`a`.`username` AS `input_by`,`a`.`role` AS `role` from ((((`pelanggaran_siswa` `ps` join `m_siswa` `s` on((`ps`.`nipd` = `s`.`nipd`))) join `m_pelanggaran` `p` on((`ps`.`id_pelanggaran` = `p`.`id_pelanggaran`))) join `m_jurusan` `j` on((`s`.`jurusan` = `j`.`jurusan`))) join `admin` `a` on((`ps`.`created_by` = `a`.`id_admin`)));

-- Dumping structure for view db_ukkpp_new.v_total_poin
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `v_total_poin`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_total_poin` AS select `s`.`nipd` AS `nipd`,`s`.`nama_siswa` AS `nama_siswa`,`j`.`jurusan` AS `nama_jurusan`,`s`.`kelas` AS `kelas`,coalesce(sum(`p`.`poin`),0) AS `total_poin` from (((`m_siswa` `s` left join `m_jurusan` `j` on((`s`.`jurusan` = `j`.`jurusan`))) left join `pelanggaran_siswa` `ps` on((`s`.`nipd` = `ps`.`nipd`))) left join `m_pelanggaran` `p` on((`ps`.`id_pelanggaran` = `p`.`id_pelanggaran`))) group by `s`.`nipd`,`s`.`nama_siswa`,`j`.`jurusan`,`s`.`kelas`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
