import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");

    if (idParam) {
      const id = Number(idParam);

      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      }

      const product = await prisma.product.findUnique({ where: { id } });

      if (!product) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(product, { status: 200 });
    }

    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "newest";
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;
    const skip = (page - 1) * pageSize;
    const where = search
      ? { name: { contains: search } }
      : {};

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "oldest") orderBy = { createdAt: "asc" };
    if (sortBy === "name-asc") orderBy = { name: "asc" };
    if (sortBy === "name-desc") orderBy = { name: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const created = await prisma.product.create({
      data: parsed.data,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/products error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Missing or invalid id" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/products error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
