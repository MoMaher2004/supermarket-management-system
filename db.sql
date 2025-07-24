-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: sms
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `billItems`
--

DROP TABLE IF EXISTS `billItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billItems` (
  `billId` int NOT NULL,
  `product` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`billId`,`product`),
  KEY `product` (`product`),
  CONSTRAINT `billItems_ibfk_1` FOREIGN KEY (`billId`) REFERENCES `bills` (`id`),
  CONSTRAINT `billItems_ibfk_2` FOREIGN KEY (`product`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billItems`
--

LOCK TABLES `billItems` WRITE;
/*!40000 ALTER TABLE `billItems` DISABLE KEYS */;
INSERT INTO `billItems` VALUES (1,1,10.50,2),(1,2,20.00,1),(2,3,15.75,3),(2,4,7.25,5),(3,5,50.00,1),(6,1,10.50,3),(6,2,20.00,1),(7,1,10.50,3),(7,2,20.00,1),(8,1,10.50,3),(8,2,20.00,1),(9,1,10.50,3),(9,2,20.00,1),(10,1,10.50,3),(10,2,19.00,1);
/*!40000 ALTER TABLE `billItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `addedAt` datetime NOT NULL,
  `refundedAt` datetime DEFAULT NULL,
  `addedBy` int NOT NULL,
  `refundedBy` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `addedBy` (`addedBy`),
  KEY `refundedBy` (`refundedBy`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`addedBy`) REFERENCES `users` (`id`),
  CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`refundedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,'2025-07-12 14:04:55',NULL,1,NULL),(2,'2025-07-12 14:04:55',NULL,2,NULL),(3,'2025-07-12 14:04:55',NULL,3,NULL),(6,'2025-07-14 17:49:25',NULL,1,NULL),(7,'2025-07-14 17:50:32','2025-07-14 21:11:51',1,1),(8,'2025-07-14 21:08:30',NULL,1,NULL),(9,'2025-07-14 21:08:49',NULL,1,NULL),(10,'2025-07-14 21:19:04',NULL,1,NULL);
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sellingPrice` decimal(10,2) NOT NULL,
  `threshold` int DEFAULT '0',
  `description` text,
  `discount` decimal(5,2) DEFAULT '0.00',
  `quantity` int DEFAULT '0',
  `storeQuantity` int DEFAULT '0',
  `barcode` varchar(20) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `barcode` (`barcode`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Product A',10.50,5,'Description A',0.00,88,50,'000001','Category X'),(2,'Product B',20.00,3,'Description B',5.00,196,80,'000002','Category Y'),(3,'Product C',15.75,10,'Description C',2.50,155,60,'000003','Category X'),(4,'Product D',7.25,2,'Description D',0.00,300,120,'000004','Category Z'),(5,'Product E',50.00,4,'Description E',10.00,80,30,'000005','Category Y'),(6,'Product Name',10000.00,10,'Desc',5.00,0,0,'123456','Category A');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `supplierId` int NOT NULL,
  `addedBy` int NOT NULL,
  `receivedBy` int DEFAULT NULL,
  `pricePerUnit` decimal(10,2) NOT NULL,
  `totalPrice` decimal(12,2) NOT NULL,
  `deferredPayment` decimal(12,2) DEFAULT '0.00',
  `status` enum('pending','received','cancelled') DEFAULT 'pending',
  `issuedAt` datetime NOT NULL,
  `receivedAt` datetime DEFAULT NULL,
  `expectedAt` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `supplierId` (`supplierId`),
  KEY `addedBy` (`addedBy`),
  KEY `receivedBy` (`receivedBy`),
  CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`),
  CONSTRAINT `shipments_ibfk_3` FOREIGN KEY (`addedBy`) REFERENCES `users` (`id`),
  CONSTRAINT `shipments_ibfk_4` FOREIGN KEY (`receivedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
INSERT INTO `shipments` VALUES (1,1,50,3,1,2,8.00,400.00,0.00,'received','2025-07-12 14:04:55','2025-07-12 14:04:55','2025-07-15','2026-07-15','Shipment note A'),(2,2,30,2,2,1,15.00,450.00,50.00,'cancelled','2025-07-12 14:04:55','2025-07-14 16:10:26','2025-07-20','2026-07-20','Shipment note B'),(4,3,5,1,1,1,100.00,6000.00,100.00,'received','2025-07-14 15:53:44','2025-07-14 16:07:09','2025-07-15','2025-07-15','');
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Supplier One','0200000001','sup1@example.com'),(2,'Supplier 2','123455342','sup2@example.com'),(3,'Supplier Three','0200000003','');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `fullName` varchar(50) DEFAULT NULL,
  `passwordUpdatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','$2b$10$RI56pbPiV4tP/kZKNZ.V1eT4hVNqlxr44JaUBZ9N8NFxYslyAROUa','admin','0100000001',0,'Admin One','2025-07-14 06:09:03','2025-07-12 14:04:55'),(2,'admin2','$2b$10$e8xGlMNBfVG81LodTIzHWO/uSrt5KgDLnwfm7n.mqZ7.4chGnW8ia','admin','0100000002',0,'Admin Two','2025-07-12 14:04:55','2025-07-12 14:04:55'),(3,'staff1','$2b$10$e8xGlMNBfVG81LodTIzHWO/uSrt5KgDLnwfm7n.mqZ7.4chGnW8ia','staff','0100000003',0,'Staff One','2025-07-12 14:04:55','2025-07-12 14:04:55'),(4,'staff2','$2b$10$e8xGlMNBfVG81LodTIzHWO/uSrt5KgDLnwfm7n.mqZ7.4chGnW8ia','staff','0100000004',0,'Staff Two','2025-07-12 14:04:55','2025-07-12 14:04:55'),(6,'newuser','$2b$10$GfCXd1NNAzqQXvNZlE625.ApMGZLZ3ia7P6/CPGh8LI4ldfVL3dvO','owner','1545875',1,'New User','2025-07-14 06:27:43','2025-07-14 06:27:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-14 21:29:17
