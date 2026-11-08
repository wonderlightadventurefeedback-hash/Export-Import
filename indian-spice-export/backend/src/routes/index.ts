import { Router } from "express";
import { healthRouter } from "./health.js";
import { productsRouter } from "./products.js";
import { categoriesRouter } from "./categories.js";
import { servicesRouter } from "./services.js";
import { enquiriesRouter } from "./enquiries.js";
import { contactRouter } from "./contact.js";
import { adminRouter } from "./admin.js";
import { publicDataRouter } from "./publicData.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/enquiries", enquiriesRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/public", publicDataRouter);
apiRouter.use("/admin", adminRouter);
