import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Función para subir imagen
export async function uploadImage(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'stock-management-img', // Carpeta en Cloudinary
                        resource_type: 'auto',
                        transformation: [
                            { width: 800, height: 800, crop: 'limit' },
                            { quality: 'auto', fetch_format: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result?.secure_url || '');
                        }
                    }
                )
                .end(buffer);
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error al subir imagen a Cloudinary');
    }
}

// Función para eliminar imagen
export async function deleteImage(imageUrl: string): Promise<void> {
    try {
        // Extraer public_id de la URL de Cloudinary
        const parts = imageUrl.split('/');
        const fileWithExtension = parts[parts.length - 1];
        const publicId = `stock-management/${fileWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error);
        // No lanzamos error para no interrumpir la eliminación del producto
    }
}
