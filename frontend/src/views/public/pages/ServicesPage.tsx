import React, { useState, useEffect, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Check, AlertCircle, RefreshCw, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { getBaseUrl } from '../../../api/client';

interface ServiceCategory {
  id: string;
  code: string;
  name: string;
}

interface ClinicalServiceItem {
  id: string;
  serviceCode: string;
  serviceName: string;
  categoryCode: string;
  categoryName: string;
  description: string | null;
  price: number;
  durationMin: number | null;
  durationMax: number | null;
  indications: string[];
}

interface ClinicalServiceListResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  items: ClinicalServiceItem[];
}

export const ServicesPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(true);

  const [services, setServices] = useState<ClinicalServiceItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load categories once on mount
  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/services/categories`);
      if (!res.ok) {
        throw new Error(`Lỗi tải danh mục: ${res.status}`);
      }
      const data: ServiceCategory[] = await res.json();
      setCategories(data);
    } catch (err: unknown) {
      console.error('Không thể tải danh mục dịch vụ:', err);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch clinical services whenever filters or page change
  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'ALL') {
      queryParams.append('categoryCode', selectedCategory);
    }
    if (debouncedSearch) {
      queryParams.append('keyword', debouncedSearch);
    }
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    try {
      const res = await fetch(`${getBaseUrl()}/api/services?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Không thể kết nối đến máy chủ (${res.status}). Vui lòng thử lại.`);
      }
      const data: ClinicalServiceListResponse = await res.json();
      setServices(data.items);
      setTotalItems(data.totalItems);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải danh sách dịch vụ.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, debouncedSearch, page]);

  const handleCategoryChange = (code: string) => {
    setSelectedCategory(code);
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const formatDuration = (min: number | null, max: number | null): string => {
    if (min != null && max != null) {
      if (min === max) return `${min} phút`;
      return `${min} - ${max} phút`;
    }
    if (min != null) return `${min} phút`;
    if (max != null) return `${max} phút`;
    return '15 - 30 phút';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Danh mục dịch vụ y tế</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Bảng giá dịch vụ Tai Mũi Họng</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Bảng giá niêm yết công khai, minh bạch theo quy định của Sở Y Tế. Mọi chỉ định thăm khám, nội soi và thủ thuật đều được Bác sĩ giải thích rõ ràng trước khi thực hiện.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleCategoryChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-blue-700 text-white font-semibold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả dịch vụ
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.code}
              onClick={() => handleCategoryChange(cat.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.code
                  ? 'bg-blue-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {isCategoriesLoading && (
            <span className="flex items-center text-xs text-slate-400 px-2 py-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Đang tải danh mục...
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm dịch vụ hoặc triệu chứng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-600">Đang tải danh sách dịch vụ y tế...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="py-12 px-4 flex flex-col items-center justify-center space-y-3 bg-red-50/50 rounded-xl border border-red-200 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-red-800">Không thể tải dữ liệu dịch vụ</h3>
          <p className="text-xs text-red-600 max-w-md">{error}</p>
          <Button
            onClick={() => {
              fetchCategories();
              fetchServices();
            }}
            variant="outline"
            className="text-xs mt-2 border-red-300 text-red-700 hover:bg-red-100/60"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && services.length === 0 && (
        <div className="py-16 px-4 flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy dịch vụ phù hợp.</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Vui lòng thử điều chỉnh từ khóa tìm kiếm hoặc chọn nhóm danh mục dịch vụ khác.
          </p>
          {(searchTerm || selectedCategory !== 'ALL') && (
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setPage(1);
              }}
              variant="outline"
              className="text-xs mt-2"
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && !error && services.length > 0 && (
        <>
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Tìm thấy <strong className="text-slate-800">{totalItems}</strong> dịch vụ y tế
            </span>
            {totalPages > 1 && (
              <span>
                Trang {page} / {totalPages}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((service) => {
              const isFree = service.price === 0;

              return (
                <Card
                  key={service.id}
                  className="h-full hover:shadow-md transition-shadow [&>div]:flex [&>div]:h-full [&>div]:flex-col"
                >
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{service.serviceName}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Thời gian thực hiện: {formatDuration(service.durationMin, service.durationMax)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5">
                      <span className="text-xs font-medium text-slate-600">Giá dịch vụ</span>
                      <span className={`shrink-0 text-base font-extrabold tabular-nums ${isFree ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {service.price.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {service.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                    )}

                    {service.indications && service.indications.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700">Chỉ định phù hợp khi:</p>
                        <ul className="space-y-1">
                          {service.indications.map((ind, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                              <Check className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                              <span>{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <Link
                      to={`/appointments/new?serviceCode=${encodeURIComponent(service.serviceCode)}`}
                      className="block w-full"
                    >
                      <Button className="w-full justify-center text-xs" leftIcon={<Calendar className="h-4 w-4" />}>
                        Đặt lịch khám dịch vụ này
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Hiển thị {services.length} trên tổng số {totalItems} dịch vụ (Trang {page}/{totalPages})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs px-2.5 py-1"
                  leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                >
                  Trang trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium cursor-pointer transition-colors ${
                      page === p
                        ? 'bg-blue-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="text-xs px-2.5 py-1"
                  rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
