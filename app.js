// Package Import Start
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
// Package Import End

// Routes Import Start
const PlaceRoutes = require("./src/routes/Place.route");
const ShopCategoriesRoutes = require("./src/routes/ShopCategories.route");
const ShopRoutes = require("./src/routes/Shop.route");
const ProductTypeRoutes = require("./src/routes/ProductType.route");
const ProductCategoriesRoutes = require("./src/routes/ProductCategories.route");
const ProductSubCategoriesRoutes = require("./src/routes/ProductSubCategories.route");
const ProductBrandRoutes = require("./src/routes/ProductBrand.route");
const ProductRoutes = require("./src/routes/Product.route");
const ProductInventoriesRoutes = require("./src/routes/ProductInventories.route");
const ProductRatingRoutes = require("./src/routes/ProductRating.route");
const CommissionTypeRoutes = require("./src/routes/CommissionType.route");
const CommissionRoutes = require("./src/routes/Commission.route");
const AdminCommissionRoutes = require("./src/routes/AdminCommission.route");
const ImageUploadRoutes = require("./src/routes/S3Bucket.route");
const UserRoutes = require("./src/routes/User.route");
const CartRoutes = require("./src/routes/Cart.route");
const OrderRoutes = require("./src/routes/Order.route");
const PaymentRoutes = require("./src/routes/Payment.route");
// Routes Import End

// Constant Import Start
require("./src/services/connection");
const { ROUTES } = require("./src/constants/Constants");
// Constant Import End

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RD ADMIN Routes Start
app.use(ROUTES.SUPER_ADMIN, PlaceRoutes);
app.use(ROUTES.SUPER_ADMIN, CommissionTypeRoutes);
app.use(ROUTES.SUPER_ADMIN, ShopCategoriesRoutes);
app.use(ROUTES.SUPER_ADMIN, ShopRoutes);
app.use(ROUTES.SUPER_ADMIN, CommissionRoutes);
app.use(ROUTES.SUPER_ADMIN_PRODUCT, ProductTypeRoutes);
app.use(ROUTES.SUPER_ADMIN, AdminCommissionRoutes);
app.use(ROUTES.SUPER_ADMIN_PRODUCT, ProductCategoriesRoutes);
app.use(ROUTES.SUPER_ADMIN_PRODUCT, ProductSubCategoriesRoutes);
app.use(ROUTES.SUPER_ADMIN_PRODUCT, ProductBrandRoutes);
// RD ADMIN Routes End

// RD ADMIN AND SHOP ADMIN START
app.use(ROUTES.ADMIN_PRODUCT, ProductInventoriesRoutes);
app.use(ROUTES.ADMIN_PRODUCT, ProductRoutes);
// RD ADMIN AND SHOP ADMIN END

// ALL ACCESS ROUTES START
app.use(UserRoutes);
app.use(CartRoutes);
app.use(OrderRoutes);
app.use(PaymentRoutes);
app.use(ImageUploadRoutes);
app.use(ROUTES.PRODUCT, ProductRatingRoutes);
// ALL ACCESS ROUTES END

app.listen(5000);
