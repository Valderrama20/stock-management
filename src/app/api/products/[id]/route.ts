import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductSchema } from "@/lib/validations";
import { deleteImage } from "@/lib/cloudinary"; 

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // MODIFICADO: Obtener el producto antes de eliminarlo para eliminar la imagen
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar imagen de Cloudinary si existe
    if (product.imageUrl) {
      await deleteImage(product.imageUrl);
    }

    // Eliminar producto de la base de datos
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
