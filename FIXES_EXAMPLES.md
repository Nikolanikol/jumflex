# Примеры исправлений критических проблем

## 1. Исправление N+1 Query в Admin Users API

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /app/api/admin/users/route.tsx (строки 42-62)
const usersWithStats = await Promise.all(
  (users || []).map(async (user) => {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("user_id", user.id);

    const totalSpent = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    return { ...user, orders_count: count || 0, total_spent: totalSpent };
  })
);
```

**Проблема:** 2 запроса на каждого пользователя (N+1 problem)

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// ВАРИАНТ 1: Использовать одиночный запрос с агрегацией в БД
const { data: users, error } = await supabase
  .from("users")
  .select(`
    *,
    orders (
      id,
      total_amount
    )
  `)
  .order("created_at", { ascending: false });

if (error) throw error;

// Обработать на клиентской стороне
const usersWithStats = (users || []).map(user => {
  const orders = (user.orders || []) as any[];
  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  return {
    ...user,
    orders_count: orders.length,
    total_spent: totalSpent
  };
});

// ВАРИАНТ 2: Использовать count и select с limit (если JOIN невозможен)
const { data: users, error, count } = await supabase
  .from("users")
  .select("*", { count: "exact" })
  .order("created_at", { ascending: false });

// Получить статистику в одном запросе
const { data: stats } = await supabase
  .rpc('get_user_order_stats'); // Требует custom function в БД
```

---

## 2. Добавление проверки админ прав

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /app/api/admin/products/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Проверка прав администратора  ❌

    // Валидация
    if (!body.name_ko || !body.slug || !body.price) {
      return NextResponse.json(...)
    }
    // ... rest of code
  }
}
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Not authenticated');
  }

  if (session.user.role !== 'admin') {
    throw new Error('Not authorized');
  }

  return session;
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Проверка прав на первой строке
    await checkAdmin();

    const body = await request.json();

    if (!body.name_ko || !body.slug || !body.price) {
      return NextResponse.json(
        { error: 'Заполните обязательные поля' },
        { status: 400 }
      );
    }

    // ... rest of code
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    if (message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    if (message === 'Not authorized') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

---

## 3. Удаление debug console.log

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /components/products/RatingSection.tsx
useEffect(() => {
  console.log("📊 Loading rating stats for product:", productId);
  loadRatingStats();
}, [productId]);

useEffect(() => {
  console.log("👤 Session status:", status, "Email:", session?.user?.email);
  if (status === "authenticated" && session?.user?.email) {
    console.log("✅ Loading user rating...");
    loadUserRating();
  } else if (status === "unauthenticated") {
    console.log("❌ User not authenticated");
    setUserRating(null);
  }
}, [status, session?.user?.email, productId]);

const loadRatingStats = async () => {
  try {
    const response = await fetch(`/api/ratings/${productId}`);
    if (response.ok) {
      const data = await response.json();
      console.log("📊 Rating stats loaded:", data);
      setStats(data);
    }
  } catch (error) {
    console.error("Error loading ratings:", error);
  }
};
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// /components/products/RatingSection.tsx
// Удалить все console.log statements

useEffect(() => {
  loadRatingStats();
}, [productId]);

useEffect(() => {
  if (status === "authenticated" && session?.user?.email) {
    loadUserRating();
  } else if (status === "unauthenticated") {
    setUserRating(null);
  }
}, [status, session?.user?.email, productId]);

const loadRatingStats = async () => {
  try {
    const response = await fetch(`/api/ratings/${productId}`);
    if (response.ok) {
      const data = await response.json();
      setStats(data);
    }
  } catch (error) {
    // Логирование только в dev/production с правильным logger
    if (process.env.NODE_ENV === 'development') {
      console.error("Error loading ratings:", error);
    }
    // В production использовать правильный logger
    // logger.error('Error loading ratings', { error, productId });
  }
};
```

### Правильный логирование (если нужно):
```typescript
// utils/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (msg: string, data?: any) => {
    if (isDev) console.log(`[DEBUG] ${msg}`, data);
  },
  error: (msg: string, error?: any) => {
    if (isDev) {
      console.error(`[ERROR] ${msg}`, error);
    } else {
      // В production отправить в Sentry, LogRocket и т.д.
      // sentryClient.captureException(error);
    }
  },
};
```

---

## 4. Исправление обработки fetch ошибок

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /components/products/ProductFilters.tsx
useEffect(() => {
  fetch("/api/categories")
    .then((res) => res.json())
    .then((data) => setCategories(data || []))
    .catch((error) => console.error("Error loading categories:", error));

  fetch("/api/brands")
    .then((res) => res.json())
    .then((data) => setBrands(data || []))
    .catch((error) => console.error("Error loading brands:", error));
}, []);
```

**Проблемы:**
- Нет проверки `response.ok`
- Будет попытка парсить ошибку 404/500 как JSON
- Нет отображения ошибки пользователю

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// /components/products/ProductFilters.tsx
const [error, setError] = useState<string | null>(null);
const [loadingCategories, setLoadingCategories] = useState(false);
const [loadingBrands, setLoadingBrands] = useState(false);

useEffect(() => {
  loadCategoriesAndBrands();
}, []);

const loadCategoriesAndBrands = async () => {
  try {
    setError(null);
    
    // Загрузка категорий
    setLoadingCategories(true);
    const catResponse = await fetch("/api/categories");
    if (!catResponse.ok) {
      throw new Error(`Categories: HTTP ${catResponse.status}`);
    }
    const catData = await catResponse.json();
    setCategories(Array.isArray(catData) ? catData : []);
    
    // Загрузка брендов
    setLoadingBrands(true);
    const brandResponse = await fetch("/api/brands");
    if (!brandResponse.ok) {
      throw new Error(`Brands: HTTP ${brandResponse.status}`);
    }
    const brandData = await brandResponse.json();
    setBrands(Array.isArray(brandData) ? brandData : []);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error("Error loading filters:", errorMessage);
    setError("Не удалось загрузить фильтры");
  } finally {
    setLoadingCategories(false);
    setLoadingBrands(false);
  }
};

// В JSX показать ошибку:
{error && (
  <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 mb-4">
    {error}
  </div>
)}
```

---

## 5. Исправление null checks

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /lib/auth.ts
export async function checkRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return false
  }

  // ❌ session.user может быть undefined!
  return allowedRoles.includes(session.user.role)
}

// /app/api/admin/users/route.tsx
if (!session || session.user.role !== "admin") {  // ❌ Рискованно
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// /lib/auth.ts
export async function checkRole(allowedRoles: string[]): Promise<boolean> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {  // ✅ Проверка всей цепочки
    return false;
  }

  return allowedRoles.includes(session.user.role);
}

// /app/api/admin/users/route.tsx
async function checkAdmin() {
  const session = await getServerSession(authOptions);

  // ✅ Правильная проверка
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Not authorized" },
      { status: 403 }
    );
  }

  return null;
}

export async function GET(request: Request) {
  const authError = await checkAdmin();
  if (authError) return authError;
  // ... rest of code
}
```

---

## 6. Оптимизация статистики рейтинга

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /app/api/ratings/[productId]/route.ts
const distribution = {
  5: ratings.filter((r) => r.rating === 5).length,
  4: ratings.filter((r) => r.rating === 4).length,
  3: ratings.filter((r) => r.rating === 3).length,
  2: ratings.filter((r) => r.rating === 2).length,
  1: ratings.filter((r) => r.rating === 1).length,
};
```

**Проблема:** 5 итераций через массив вместо 1

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// /app/api/ratings/[productId]/route.ts
const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

ratings.forEach((r) => {
  const rating = r.rating as 1 | 2 | 3 | 4 | 5;
  distribution[rating]++;
});

// Или еще более компактно:
const distribution = ratings.reduce(
  (acc, r) => {
    acc[r.rating as 1 | 2 | 3 | 4 | 5]++;
    return acc;
  },
  { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
);
```

---

## 7. Замена alert на toast

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /components/products/RatingSection.tsx
const handleRatingClick = async (rating: number) => {
  if (!session) {
    alert("Необходимо войти в систему для оценки товара");  // ❌
    return;
  }

  if (userRating !== null) {
    alert("Вы уже оценили этот товар");  // ❌
    return;
  }
  // ...
};
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
import toast from "react-hot-toast";

const handleRatingClick = async (rating: number) => {
  if (!session) {
    toast.error("Необходимо войти в систему для оценки товара");
    return;
  }

  if (userRating !== null) {
    toast.error("Вы уже оценили этот товар");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, rating }),
    });

    if (response.ok) {
      setUserRating(rating);
      await loadRatingStats();
      toast.success("Спасибо за вашу оценку!");
    } else {
      const error = await response.json();
      toast.error(error.error || "Ошибка при сохранении оценки");
    }
  } catch (error) {
    console.error("Error submitting rating:", error);
    toast.error("Произошла ошибка. Попробуйте еще раз");
  } finally {
    setLoading(false);
  }
};
```

---

## 8. Добавление useEffect cleanup

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /components/products/RatingSection.tsx
useEffect(() => {
  loadRatingStats();
}, [productId]); // ❌ Нет cleanup при переключении товара
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    try {
      const response = await fetch(`/api/ratings/${productId}`);
      if (response.ok) {
        const data = await response.json();
        // ✅ Проверяем, что компонент еще примонтирован
        if (isMounted) {
          setStats(data);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error loading ratings:", error);
      }
    }
  };

  loadData();

  // ✅ Cleanup функция
  return () => {
    isMounted = false;
  };
}, [productId]);
```

---

## 9. Замена hardcoded values на config

### ❌ НЕПРАВИЛЬНО (текущий код)
```typescript
// /app/checkout/page.tsx
const shippingCost = subtotal >= 50000 ? 0 : 3000;

if (subtotal < 50000) {
  // ...добавьте товаров на ₩{(50000 - subtotal).toLocaleString()}
}
```

### ✅ ПРАВИЛЬНОЕ ИСПРАВЛЕНИЕ
```typescript
// src/config/shipping.ts
export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 50000,  // от этой суммы доставка бесплатна
  SHIPPING_COST: 3000,             // стандартная стоимость доставки
  CURRENCY: 'KRW',
} as const;

// /app/checkout/page.tsx
import { SHIPPING_CONFIG } from '@/config/shipping';

const shippingCost = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD 
  ? 0 
  : SHIPPING_CONFIG.SHIPPING_COST;

const amountNeeded = Math.max(0, SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal);

if (amountNeeded > 0) {
  <p className="text-xs text-secondary">
    Добавьте товаров на ₩{amountNeeded.toLocaleString()} 
    для бесплатной доставки
  </p>
}
```

---

## Краткий checklist исправлений

- [ ] N+1 Query в admin/users
- [ ] Admin auth check в 4+ API routes  
- [ ] Удалить console.log (22 places)
- [ ] Заменить 8+ `any` типов
- [ ] Исправить fetch обработку ошибок
- [ ] Добавить null checks
- [ ] Заменить alert на toast (12+ мест)
- [ ] Добавить useEffect cleanup (3 места)
- [ ] Реализовать TODO функции
- [ ] Переместить hardcoded values в config
- [ ] Добавить пагинацию для комментариев
- [ ] Оптимизировать статистику рейтинга
