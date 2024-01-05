-- phpMyAdmin SQL Dump
-- version 5.3.0-dev+20221010.6785c97d22
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2023 at 07:54 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kilpailu`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerateRandomTeams` ()   BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 60 DO
    -- Generate random team name (joukkue_nimi) and city (kaupunki)
    SET @teamName = CONCAT('Team', i);
    SET @cityName = CONCAT('City', i);
    
    -- Generate three random member names
    SET @member1 = CONCAT('Name', FLOOR(1 + RAND() * 10));
    SET @member2 = CONCAT('Name', FLOOR(1 + RAND() * 10));
    SET @member3 = CONCAT('Name', FLOOR(1 + RAND() * 10));
    
    -- Generate a unique osallistumis_nro
    SET @uniqueOsallistumisNro = FLOOR(100 + RAND() * 900);
    
    -- Insert the generated team into the joukkueet table
    INSERT INTO joukkueet (joukkue_nimi, jäsenet, kaupunki, osallistumis_nro)
    VALUES (@teamName, CONCAT(@member1, ', ', @member2, ', ', @member3), @cityName, @uniqueOsallistumisNro);
    
    SET i = i + 1;
  END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `aikataulu`
--

CREATE TABLE `aikataulu` (
  `aika_id` int(11) NOT NULL,
  `era` varchar(255) DEFAULT NULL,
  `tehtava` varchar(255) DEFAULT NULL,
  `joukkue_id` int(11) DEFAULT NULL,
  `aika` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `joukkueet`
--

CREATE TABLE `joukkueet` (
  `joukkue_id` int(11) NOT NULL,
  `joukkue_nimi` varchar(255) NOT NULL,
  `jäsenet` text DEFAULT NULL,
  `kaupunki` varchar(255) DEFAULT NULL,
  `osallistumis_nro` int(11) DEFAULT NULL,
  `semifinalist` int(11) DEFAULT NULL,
  `finalist` int(11) DEFAULT NULL,
  `kerailyera` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `joukkueet`
--

INSERT INTO `joukkueet` (`joukkue_id`, `joukkue_nimi`, `jäsenet`, `kaupunki`, `osallistumis_nro`, `semifinalist`, `finalist`, `kerailyera`) VALUES
(1, 'Team1', 'Name4, Name10, Name7', 'City1', 278, NULL, NULL, NULL),
(2, 'Team2', 'Name2, Name3, Name10', 'City2', 711, NULL, NULL, NULL),
(3, 'Team3', 'Name7, Name4, Name6', 'City3', 909, NULL, NULL, NULL),
(4, 'Team4', 'Name8, Name3, Name9', 'City4', 701, NULL, NULL, NULL),
(5, 'Team5', 'Name7, Name5, Name2', 'City5', 516, NULL, NULL, NULL),
(6, 'Team6', 'Name9, Name8, Name4', 'City6', 643, NULL, NULL, NULL),
(7, 'Team7', 'Name9, Name5, Name9', 'City7', 677, NULL, NULL, NULL),
(8, 'Team8', 'Name8, Name9, Name2', 'City8', 338, NULL, NULL, NULL),
(10, 'Team10', 'Name4, Name3, Name3', 'City10', 759, NULL, NULL, NULL),
(11, 'Team11', 'Name8, Name7, Name1', 'City11', 165, NULL, NULL, NULL),
(12, 'Team12', 'Name4, Name4, Name10', 'City12', 764, NULL, NULL, NULL),
(13, 'Team13', 'Name8, Name6, Name5', 'City13', 548, NULL, NULL, NULL),
(14, 'Team14', 'Name3, Name7, Name7', 'City14', 227, NULL, NULL, NULL),
(15, 'Team15', 'Name9, Name8, Name1', 'City15', 206, NULL, NULL, NULL),
(16, 'Team16', 'Name5, Name10, Name3', 'City16', 360, NULL, NULL, NULL),
(17, 'Team17', 'Name9, Name3, Name10', 'City17', 833, NULL, NULL, NULL),
(18, 'Team18', 'Name3, Name10, Name8', 'City18', 260, NULL, NULL, NULL),
(19, 'Team19', 'Name6, Name1, Name9', 'City19', 102, NULL, NULL, NULL),
(20, 'Team20', 'Name5, Name3, Name2', 'City20', 665, NULL, NULL, NULL),
(21, 'Team21', 'Name9, Name3, Name9', 'City21', 309, NULL, NULL, NULL),
(22, 'Team22', 'Name8, Name2, Name3', 'City22', 880, NULL, NULL, NULL),
(23, 'Team23', 'Name7, Name6, Name9', 'City23', 755, NULL, NULL, NULL),
(24, 'Team24', 'Name1, Name9, Name3', 'City24', 759, NULL, NULL, NULL),
(25, 'Team25', 'Name9, Name3, Name4', 'City25', 348, NULL, NULL, NULL),
(26, 'Team26', 'Name3, Name5, Name4', 'City26', 366, NULL, NULL, NULL),
(27, 'Team27', 'Name6, Name10, Name10', 'City27', 166, NULL, NULL, NULL),
(28, 'Team28', 'Name5, Name1, Name7', 'City28', 414, NULL, NULL, NULL),
(29, 'Team29', 'Name8, Name7, Name10', 'City29', 795, NULL, NULL, NULL),
(30, 'Team30', 'Name1, Name1, Name10', 'City30', 763, NULL, NULL, NULL),
(31, 'Team31', 'Name8, Name7, Name1', 'City31', 481, NULL, NULL, NULL),
(32, 'Team32', 'Name9, Name9, Name9', 'City32', 794, NULL, NULL, NULL),
(33, 'Team33', 'Name3, Name9, Name4', 'City33', 466, NULL, NULL, NULL),
(34, 'Team34', 'Name10, Name5, Name6', 'City34', 347, NULL, NULL, NULL),
(35, 'Team35', 'Name8, Name10, Name7', 'City35', 352, NULL, NULL, NULL),
(36, 'Team36', 'Name5, Name5, Name9', 'City36', 891, NULL, NULL, NULL),
(172, 'Team9', 'Name22,Name23,Name24', 'City9', 778, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tehtävät`
--

CREATE TABLE `tehtävät` (
  `id` int(11) NOT NULL,
  `tehtävä_nimi` varchar(255) DEFAULT NULL,
  `max_aika` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tehtävät`
--

INSERT INTO `tehtävät` (`id`, `tehtävä_nimi`, `max_aika`) VALUES
(78, 'Tehtävä 1', 60),
(79, 'Tehtävä 2', 120),
(80, 'Tehtävä 3', 180),
(81, 'Tehtävä 4', 240),
(82, 'Tehtävä 5', 300),
(83, 'Tehtävä 6', 360),
(84, 'Tehtävä 7', 420),
(85, 'Tehtävä 8', 480),
(86, 'Tehtävä 9', 540),
(87, 'Tehtävä 10', 600),
(88, 'Tehtävä 11', 660),
(89, 'Tehtävä 12', 720);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aikataulu`
--
ALTER TABLE `aikataulu`
  ADD PRIMARY KEY (`aika_id`);

--
-- Indexes for table `joukkueet`
--
ALTER TABLE `joukkueet`
  ADD PRIMARY KEY (`joukkue_id`);

--
-- Indexes for table `tehtävät`
--
ALTER TABLE `tehtävät`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aikataulu`
--
ALTER TABLE `aikataulu`
  MODIFY `aika_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `joukkueet`
--
ALTER TABLE `joukkueet`
  MODIFY `joukkue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `tehtävät`
--
ALTER TABLE `tehtävät`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
