import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const categoryId = searchParams.get('categoryId');
        const inStock = searchParams.get('inStock');

        const products = await prisma.product.findMany({
            where: {
                ...(search && {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                }),
                ...(categoryId && { categoryId }),
                ...(inStock === 'true' && { stock: { gt: 0 } }),
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ data: products });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = ProductSchema.parse(body);

        const product = await prisma.product.create({
            data: validatedData,
            include: {
                category: true,
            },
        });

        return NextResponse.json({ data: product }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}
