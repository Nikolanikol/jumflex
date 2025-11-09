import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      items,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method,
      total_amount,
      discount_amount,
      shipping_cost,
      notes,
    } = body;

    // Валидация
    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !shipping_address
    ) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    // Генерация номера заказа
    const order_number = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Создание заказа
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        payment_method: payment_method || "card",
        total_amount,
        discount_amount: discount_amount || 0,
        shipping_cost: shipping_cost || 0,
        notes,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Создание позиций заказа
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // TODO: Отправить email уведомление

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
