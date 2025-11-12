// ================================================
// ТИПЫ ДЛЯ БЛОГА
// ================================================

// Базовые типы таблиц
export interface BlogCategory {
  id: string;
  name_ko: string;
  name_ru: string;
  name_en: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_id: string;
  category_id: string | null;
  status: BlogPostStatus;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

export interface BlogPostTag {
  post_id: string;
  tag_id: string;
}

// ================================================
// РАСШИРЕННЫЕ ТИПЫ С RELATIONS
// ================================================

// Автор поста (из таблицы users)
export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

// Пост со всеми связями
export interface BlogPostWithRelations extends BlogPost {
  author: BlogAuthor;
  category: BlogCategory | null;
  tags: BlogTag[];
}

// Краткая версия поста для списков
export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  author: BlogAuthor;
  category: BlogCategory | null;
  status: BlogPostStatus;
  views_count: number;
  published_at: string | null;
  created_at: string;
}

// Категория с количеством постов
export interface BlogCategoryWithCount extends BlogCategory {
  posts_count: number;
}

// Тег с количеством постов
export interface BlogTagWithCount extends BlogTag {
  posts_count: number;
}

// ================================================
// ТИПЫ ДЛЯ ФОРМ И API
// ================================================

// Данные для создания поста
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author_id: string;
  category_id?: string;
  status?: BlogPostStatus;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: string[]; // ID тегов для связи
}

// Данные для обновления поста
export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category_id?: string;
  status?: BlogPostStatus;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: string[]; // ID тегов для обновления
}

// Данные для создания категории
export interface CreateBlogCategoryInput {
  name_ko: string;
  name_ru: string;
  name_en: string;
  slug: string;
  description?: string;
}

// Данные для обновления категории
export interface UpdateBlogCategoryInput {
  name_ko?: string;
  name_ru?: string;
  name_en?: string;
  slug?: string;
  description?: string;
}

// Данные для создания тега
export interface CreateBlogTagInput {
  name: string;
  slug: string;
}

// ================================================
// ТИПЫ ДЛЯ ФИЛЬТРАЦИИ И ПАГИНАЦИИ
// ================================================

export interface BlogPostsFilters {
  status?: BlogPostStatus;
  category_id?: string;
  tag_id?: string;
  author_id?: string;
  search?: string; // Поиск по title и excerpt
}

export interface BlogPostsSort {
  field: 'created_at' | 'published_at' | 'views_count' | 'title';
  order: 'asc' | 'desc';
}

export interface BlogPostsPagination {
  page: number;
  limit: number;
}

export interface BlogPostsQuery {
  filters?: BlogPostsFilters;
  sort?: BlogPostsSort;
  pagination?: BlogPostsPagination;
}

// Ответ API со списком постов
export interface BlogPostsResponse {
  posts: BlogPostWithRelations[] | BlogPostPreview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ================================================
// ТИПЫ ДЛЯ СТАТИСТИКИ
// ================================================

export interface BlogStats {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
  total_categories: number;
  total_tags: number;
}

// ================================================
// UTILITY TYPES
// ================================================

// Для проверки прав доступа
export interface BlogPostPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

// Для валидации slug
export type SlugValidationResult = {
  isValid: boolean;
  error?: string;
};

// Для подсчета времени чтения
export interface ReadingTime {
  minutes: number;
  words: number;
}