-- CreateTable
CREATE TABLE `booking` (
    `order_id` INTEGER UNSIGNED NOT NULL,
    `pickup_date` DATE NULL,
    `state` ENUM('Processing', 'Ready', 'Picked-up') NULL DEFAULT 'Processing',
    `paid` ENUM('Not paid', 'Paid') NULL DEFAULT 'Not paid',

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalog` (
    `id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catalog_in_store` (
    `catalog_id` INTEGER UNSIGNED NOT NULL,
    `store_id` INTEGER UNSIGNED NOT NULL,

    INDEX `FK_store_catalog`(`store_id`),
    PRIMARY KEY (`catalog_id`, `store_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(255) NOT NULL,
    `phone_number` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `current_point` INTEGER UNSIGNED NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_report` (
    `report_id` VARCHAR(255) NOT NULL,
    `variation_id` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,

    INDEX `FK_dtrp_color`(`color`),
    INDEX `FK_dtrp_variation`(`variation_id`),
    PRIMARY KEY (`report_id`, `variation_id`, `color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` INTEGER UNSIGNED NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(20) NOT NULL,
    `phone_number` CHAR(10) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `shift` VARCHAR(255) NOT NULL,
    `start_date` DATE NOT NULL,
    `office` VARCHAR(255) NOT NULL,
    `salary` INTEGER UNSIGNED NULL DEFAULT 0,
    `store_id` INTEGER UNSIGNED NULL,
    `supervisor` INTEGER UNSIGNED NULL,

    INDEX `fk_employee_store`(`store_id`),
    INDEX `fk_supervisor`(`supervisor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exchanged_voucher` (
    `voucher_id` INTEGER UNSIGNED NOT NULL,
    `customer_id` INTEGER UNSIGNED NOT NULL,

    INDEX `FK_exchanged_voucher_customer`(`customer_id`),
    PRIMARY KEY (`voucher_id`, `customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membership` (
    `customer_id` INTEGER UNSIGNED NOT NULL,
    `register` DATE NOT NULL,
    `points` INTEGER UNSIGNED NULL DEFAULT 0,
    `card_type` ENUM('silver', 'gold', 'platinum') NULL DEFAULT 'silver',

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_detail` (
    `order_id` INTEGER UNSIGNED NOT NULL,
    `variation_id` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `quantity` INTEGER UNSIGNED NULL DEFAULT 0,

    INDEX `FK_detail_color`(`color`),
    INDEX `FK_detail_variation`(`variation_id`),
    PRIMARY KEY (`order_id`, `variation_id`, `color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_date` DATE NOT NULL,
    `conversion_point` INTEGER UNSIGNED NULL DEFAULT 0,
    `total_value` DECIMAL(10, 2) NOT NULL,
    `store_id` INTEGER UNSIGNED NOT NULL,
    `processor` INTEGER UNSIGNED NULL,
    `voucher_id` INTEGER UNSIGNED NULL,
    `customer_id` INTEGER UNSIGNED NULL,
    `order_type` ENUM('booking', 'receipt') NOT NULL,

    INDEX `FK_oderrs_customer`(`customer_id`),
    INDEX `FK_orders_employee`(`processor`),
    INDEX `FK_orders_store`(`store_id`),
    INDEX `FK_orders_voucher`(`voucher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `discount_for_employee` INTEGER UNSIGNED NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_in_catalog` (
    `catalog_id` INTEGER UNSIGNED NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,

    INDEX `FK_PIC_catalog`(`catalog_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variation` (
    `id` VARCHAR(255) NOT NULL,
    `origin_price` INTEGER UNSIGNED NULL DEFAULT 0,
    `sell_price` INTEGER UNSIGNED NULL DEFAULT 0,
    `size` ENUM('S', 'M', 'L', 'D') NOT NULL DEFAULT 'D',
    `product_id` INTEGER UNSIGNED NULL,

    INDEX `FK_variation_product`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion` (
    `id` INTEGER UNSIGNED NOT NULL,
    `content` VARCHAR(255) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `promotion_product` (
    `product_id` INTEGER UNSIGNED NOT NULL,
    `promotion_id` INTEGER UNSIGNED NOT NULL,
    `discount_rate` INTEGER UNSIGNED NULL DEFAULT 0,
    `use_condition` VARCHAR(255) NULL,

    INDEX `promotion_id`(`promotion_id`),
    PRIMARY KEY (`product_id`, `promotion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provided_product` (
    `provider_id` INTEGER UNSIGNED NOT NULL,
    `variation_id` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `quantity` INTEGER UNSIGNED NULL DEFAULT 0,
    `discount` INTEGER UNSIGNED NULL DEFAULT 0,

    INDEX `FK_PP_color`(`color`),
    INDEX `FK_PP_variation`(`variation_id`),
    PRIMARY KEY (`provider_id`, `variation_id`, `color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provider` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `hotline` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt` (
    `order_id` INTEGER UNSIGNED NOT NULL,
    `order_time` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,
    `rp_date` INTEGER NULL,
    `rp_month` INTEGER NULL,
    `rp_year` INTEGER NULL,
    `rp_type` ENUM('import', 'export') NULL,
    `warehouse_id` INTEGER UNSIGNED NULL,

    INDEX `FK_report_warehouse`(`warehouse_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revenue` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `last_update` DATE NOT NULL,
    `note` VARCHAR(255) NULL,
    `title` VARCHAR(255) NULL,
    `number_of_orders` INTEGER UNSIGNED NULL,
    `store_id` INTEGER UNSIGNED NULL,

    INDEX `FK_revenue_store`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store` (
    `id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone_number` CHAR(10) NOT NULL,
    `number_of_emps` INTEGER UNSIGNED NULL DEFAULT 0,
    `manager_id` INTEGER UNSIGNED NULL,

    INDEX `FK_store_employee`(`manager_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variation_color` (
    `color` VARCHAR(255) NOT NULL,
    `variation_id` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `variation_color_color_key`(`color`),
    UNIQUE INDEX `variation_color_variation_id_key`(`variation_id`),
    INDEX `FK_color_variation`(`variation_id`),
    PRIMARY KEY (`color`, `variation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variation_in_store` (
    `variation_id` VARCHAR(255) NOT NULL,
    `store_id` INTEGER UNSIGNED NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `quantity` INTEGER UNSIGNED NULL DEFAULT 0,

    INDEX `FK_color_in_store_color`(`color`, `variation_id`),
    INDEX `FK_color_in_store_store`(`store_id`),
    PRIMARY KEY (`variation_id`, `store_id`, `color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `point_need` INTEGER UNSIGNED NULL DEFAULT 0,
    `discount` INTEGER UNSIGNED NULL DEFAULT 0,
    `store_id` INTEGER UNSIGNED NULL,

    INDEX `FK_voucher_store`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(255) NULL,
    `city` VARCHAR(255) NULL,
    `store_id` INTEGER UNSIGNED NULL,
    `classify` ENUM('at_store', 'out_store') NOT NULL,

    INDEX `FK_warehouse_store`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `FK_booking_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `catalog_in_store` ADD CONSTRAINT `FK_catalog_store` FOREIGN KEY (`catalog_id`) REFERENCES `catalog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catalog_in_store` ADD CONSTRAINT `FK_store_catalog` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_report` ADD CONSTRAINT `FK_dtrp_color` FOREIGN KEY (`color`) REFERENCES `variation_color`(`color`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_report` ADD CONSTRAINT `FK_dtrp_report` FOREIGN KEY (`report_id`) REFERENCES `report`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detail_report` ADD CONSTRAINT `FK_dtrp_variation` FOREIGN KEY (`variation_id`) REFERENCES `variation_color`(`variation_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `fk_employee_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `fk_supervisor` FOREIGN KEY (`supervisor`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exchanged_voucher` ADD CONSTRAINT `FK_exchanged_voucher_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exchanged_voucher` ADD CONSTRAINT `FK_exchanged_voucher_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membership` ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `FK_detail_color` FOREIGN KEY (`color`) REFERENCES `variation_color`(`color`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `FK_detail_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `FK_detail_variation` FOREIGN KEY (`variation_id`) REFERENCES `variation_color`(`variation_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `FK_oderrs_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `FK_orders_employee` FOREIGN KEY (`processor`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `FK_orders_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `FK_orders_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `voucher`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_in_catalog` ADD CONSTRAINT `FK_PIC_catalog` FOREIGN KEY (`catalog_id`) REFERENCES `catalog`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_in_catalog` ADD CONSTRAINT `FK_PIC_product` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_variation` ADD CONSTRAINT `FK_variation_product` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_product` ADD CONSTRAINT `promotion_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_product` ADD CONSTRAINT `promotion_product_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `provided_product` ADD CONSTRAINT `FK_PP_color` FOREIGN KEY (`color`) REFERENCES `variation_color`(`color`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `provided_product` ADD CONSTRAINT `FK_PP_provider` FOREIGN KEY (`provider_id`) REFERENCES `provider`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `provided_product` ADD CONSTRAINT `FK_PP_variation` FOREIGN KEY (`variation_id`) REFERENCES `variation_color`(`variation_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt` ADD CONSTRAINT `FK_receipt_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `FK_report_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `revenue` ADD CONSTRAINT `FK_revenue_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `FK_store_employee` FOREIGN KEY (`manager_id`) REFERENCES `employee`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `variation_color` ADD CONSTRAINT `FK_color_variation` FOREIGN KEY (`variation_id`) REFERENCES `product_variation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variation_in_store` ADD CONSTRAINT `FK_color_in_store_color` FOREIGN KEY (`color`, `variation_id`) REFERENCES `variation_color`(`color`, `variation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variation_in_store` ADD CONSTRAINT `FK_color_in_store_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher` ADD CONSTRAINT `FK_voucher_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouse` ADD CONSTRAINT `FK_warehouse_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
