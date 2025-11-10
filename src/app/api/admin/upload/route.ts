import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  console.log("📤 Upload request received");

  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("❌ No session");
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      console.log("❌ Not admin:", session.user.role);
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    console.log("✅ Admin authorized:", session.user.email);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    console.log("📁 File:", file.name, file.type, file.size, "bytes");

    // Проверка типа
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Неподдерживаемый формат: ${file.type}` },
        { status: 400 }
      );
    }

    // Проверка размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Файл слишком большой. Максимум 5MB" },
        { status: 400 }
      );
    }

    // Генерируем имя файла
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = `products/${fileName}`;

    console.log("📝 Uploading to:", filePath);

    // Конвертируем в Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Загружаем через ADMIN клиент
    const { data, error } = await supabaseAdmin.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { error: `Ошибка Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("✅ Uploaded:", data.path);

    // Получаем публичный URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("products").getPublicUrl(filePath);

    console.log("🔗 Public URL:", publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: data.path,
    });
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка загрузки" },
      { status: 500 }
    );
  }
}
