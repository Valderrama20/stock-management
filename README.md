# Stock Management App - Next.js + TypeScript + Prisma + PostgreSQL

## Estructura del Proyecto

```
stock-management-app/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── products/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── modal.tsx
│   │   ├── product/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-form.tsx
│   │   │   └── product-filters.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── search-bar.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── validations.ts
│   │   ├── utils.ts
│   │   └── types.ts
│   └── hooks/
│       ├── use-products.ts
│       └── use-categories.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```
