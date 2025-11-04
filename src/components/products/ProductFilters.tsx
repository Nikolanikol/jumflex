"use client";

import { useEffect, useState } from "react";
import { Category, Brand } from "@/types/database";
import { X, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  order?: string;
}

export default function ProductFilters({
  onFilterChange,
  initialFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>(initialFilters || {});

  useEffect(() => {
    // Загрузка категорий
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((error) => console.error("Error loading categories:", error));

    // Загрузка брендов
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data || []))
      .catch((error) => console.error("Error loading brands:", error));
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full btn-secondary flex items-center justify-center gap-2 mb-4"
      >
        <SlidersHorizontal size={18} />
        <span>Фильтры</span>
        {activeFiltersCount > 0 && (
          <span className="bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filters sidebar */}
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <div className="card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Фильтры</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
              >
                <X size={16} />
                Сбросить
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Категория
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => handleFilterChange("category", undefined)}
                  className="w-4 h-4 text-primary bg-light border-dark focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                  Все категории
                </span>
              </label>

              <div className="mb-6">
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.slug}
                        onChange={() =>
                          handleFilterChange("category", cat.slug)
                        }
                        className="w-4 h-4 text-primary bg-light border-dark focus:ring-primary focus:ring-2"
                      />
                      <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                        {cat.name_ru || cat.name_ko}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="divider my-6"></div>

          {/* Brand filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Бренд
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="brand"
                  checked={!filters.brand}
                  onChange={() => handleFilterChange("brand", undefined)}
                  className="w-4 h-4 text-primary bg-light border-dark focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                  Все бренды
                </span>
              </label>
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="brand"
                    checked={filters.brand === brand.id}
                    onChange={() => handleFilterChange("brand", brand.id)}
                    className="w-4 h-4 text-primary bg-light border-dark focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="divider my-6"></div>

          {/* Price filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Цена (₩)
            </label>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="От"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="input-field text-sm"
              />
              <input
                type="number"
                placeholder="До"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="divider my-6"></div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Сортировка
            </label>
            <select
              value={filters.sort || "created_at"}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="input-field text-sm"
            >
              <option value="created_at">По новизне</option>
              <option value="price">По цене</option>
              <option value="rating">По рейтингу</option>
              <option value="name_ru">По названию</option>
            </select>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleFilterChange("order", "asc")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.order === "asc"
                    ? "bg-primary text-black"
                    : "bg-light text-secondary hover:bg-lighter"
                }`}
              >
                По возрастанию
              </button>
              <button
                onClick={() => handleFilterChange("order", "desc")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.order === "desc" || !filters.order
                    ? "bg-primary text-black"
                    : "bg-light text-secondary hover:bg-lighter"
                }`}
              >
                По убыванию
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
