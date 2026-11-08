import { Router, Request, Response } from "express";

export const servicesRouter = Router();

const SAMPLE_SERVICES = [
  {
    id: "serv-1",
    number: "01",
    title: "Bulk Commodity Supply",
    subtitle: "FCL & LCL Maritime Containers",
  },
  {
    id: "serv-2",
    number: "02",
    title: "Custom Packaging Enquiries",
    subtitle: "Industrial & Foodservice Formats",
  },
  {
    id: "serv-3",
    number: "03",
    title: "Private-Label Enquiries",
    subtitle: "OEM Contract Granulation & Blending",
  },
  {
    id: "serv-4",
    number: "04",
    title: "Export Documentation Support",
    subtitle: "Phytosanitary & Port Clearances",
  },
];

servicesRouter.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: SAMPLE_SERVICES,
  });
});
