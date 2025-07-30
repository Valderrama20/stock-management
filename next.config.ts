import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["https://cloudinary.com"], // AGREGAR dominio de Cloudinary
  },
  // AGREGAR configuración para archivos grandes
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default nextConfig;
