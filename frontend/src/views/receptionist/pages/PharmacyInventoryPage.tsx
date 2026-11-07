import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Calendar,
  Building,
  Layers,
  ArrowUpDown,
  History,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Medicine } from '../../../types/clinic';

export const PharmacyInventoryPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'LOW_STOCK' | 'NEAR_EXPIRY'>('ALL');

  // Modal Import Stock State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMedForImport, setSelectedMedForImport] = useState<Medicine | null>(null);
  const [importQty, setImportQty] = useState<number>(100);
  const [importBatch, setImportBatch] = useState<string>('L241201');
  const [importExpiry, setImportExpiry] = useState<string>('2027-12-31');
  const [importPrice, setImportPrice] = useState<number>(20000);

  // Modal New Medicine State
  const [isNewMedModalOpen, setIsNewMedModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newActiveIngredient, setNewActiveIngredient] = useState('');
  const [newDosageForm, setNewDosageForm] = useState('Viên nén bao phim');
  const [newUnit, setNewUnit] = useState('Viên');
  const [newBatch, setNewBatch] = useState('L241120');
  const [newExpiry, setNewExpiry] = useState('2027-10-31');
  const [newStock, setNewStock] = useState(200);
  const [newMinStock, setNewMinStock] = useState(50);
  const [newImportPrice, setNewImportPrice] = useState(15000);
  const [newRetailPrice, setNewRetailPrice] = useState(18000);
  const [newSupplier, setNewSupplier] = useState('Dược phẩm Hậu Giang (DHG)');

  // Filter medicines
  const filteredMeds = store.medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (filterType === 'LOW_STOCK') {
      return m.stockQuantity <= m.minStockLevel;
    }
    if (filterType === 'NEAR_EXPIRY') {
      // Expiry within 6 months
      return m.expiryDate <= '2027-01-01';
    }
    return true;
  });

  const handleOpenImport = (med: Medicine) => {
    setSelectedMedForImport(med);
    setImportPrice(med.importPrice);
    setIsImportModalOpen(true);
  };

  const handleConfirmImport = () => {
    if (!selectedMedForImport || importQty <= 0) return;
    store.importStock(selectedMedForImport.id, importQty, importBatch, importExpiry, importPrice);
    setIsImportModalOpen(false);
  };

  const handleCreateNewMed = () => {
    if (!newMedName.trim()) return;
    store.addMedicine({
      name: newMedName.trim(),
      brandName: newBrandName.trim() || newMedName.trim(),
      activeIngredient: newActiveIngredient.trim(),
      dosageForm: newDosageForm,
      unit: newUnit,
      batchNumber: newBatch,
      expiryDate: newExpiry,
      stockQuantity: Number(newStock),
      minStockLevel: Number(newMinStock),
      importPrice: Number(newImportPrice),
      retailPrice: Number(newRetailPrice),
      supplier: newSupplier,
      isActive: true,
    });
    setIsNewMedModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản Lý Nghiệp Vụ Kho Thuốc Tai Mũi Họng"
        subtitle="Use Case 03: Theo dõi danh mục thuốc, quản lý lô hạn dùng, nhập kho và kiểm soát tồn an toàn."
        actions={
          <Button onClick={() => setIsNewMedModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Thêm danh mục thuốc mới
          </Button>
        }
      />

      {/* Filter and Summary Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả danh mục ({store.medicines.length})
          </button>
          <button
            onClick={() => setFilterType('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
              filterType === 'LOW_STOCK'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Tồn kho thấp (
            {store.medicines.filter((m) => m.stockQuantity <= m.minStockLevel).length})
          </button>
          <button
            onClick={() => setFilterType('NEAR_EXPIRY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
              filterType === 'NEAR_EXPIRY'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Cận hạn dùng
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên thuốc, hoạt chất, mã TH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Medicines Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã & Tên Thuốc</th>
                <th className="py-3 px-4">Hoạt chất & Hàm lượng</th>
                <th className="py-3 px-4">Đơn vị & Dạng</th>
                <th className="py-3 px-4">Số lô / Hạn dùng</th>
                <th className="py-3 px-4 text-right">Giá bán (đ)</th>
                <th className="py-3 px-4 text-center">Tồn kho</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy thuốc nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredMeds.map((med) => {
                  const isLow = med.stockQuantity <= med.minStockLevel;
                  const isExpiringSoon = med.expiryDate <= '2026-12-31';

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {med.id}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 block">{med.name}</span>
                            <span className="text-[11px] text-blue-700 font-medium">
                              Biệt dược: {med.brandName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span>{med.activeIngredient}</span>
                        <span className="block text-[10px] text-slate-400">
                          NCC: {med.supplier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{med.unit}</span>
                        <span className="block text-[11px] text-slate-500">{med.dosageForm}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-700 block">Lô: {med.batchNumber}</span>
                        <span
                          className={`text-[11px] font-semibold ${
                            isExpiringSoon ? 'text-rose-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          HSD: {med.expiryDate} {isExpiringSoon && '⚠️ (Gần hết)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {med.retailPrice.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full ${
                              isLow
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {med.stockQuantity} {med.unit}
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-rose-600 font-semibold mt-0.5">
                              Tồn tối thiểu: {med.minStockLevel}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenImport(med)}
                          className="text-[11px]"
                        >
                          Nhập thêm lô
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Import Stock (Phiếu nhập lô thuốc) */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Lập Phiếu Nhập Kho Bổ Sung Thuốc"
        subtitle={selectedMedForImport ? `${selectedMedForImport.name} (${selectedMedForImport.brandName})` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmImport} variant="primary">
              Xác nhận nhập kho
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-1">
            <p><strong>Mã thuốc:</strong> {selectedMedForImport?.id}</p>
            <p><strong>Tồn kho hiện tại:</strong> {selectedMedForImport?.stockQuantity} {selectedMedForImport?.unit}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng nhập bổ sung"
              type="number"
              min={1}
              value={importQty}
              onChange={(e) => setImportQty(Number(e.target.value))}
              required
            />
            <Input
              label="Đơn vị tính"
              value={selectedMedForImport?.unit || ''}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lô sản xuất"
              value={importBatch}
              onChange={(e) => setImportBatch(e.target.value)}
              required
            />
            <Input
              label="Hạn sử dụng"
              type="date"
              value={importExpiry}
              onChange={(e) => setImportExpiry(e.target.value)}
              required
            />
          </div>

          <Input
            label="Đơn giá nhập (VNĐ)"
            type="number"
            value={importPrice}
            onChange={(e) => setImportPrice(Number(e.target.value))}
            helperText={`Tổng chi phí nhập lô: ${(importQty * importPrice).toLocaleString('vi-VN')} đ`}
          />
        </div>
      </Modal>

      {/* MODAL: New Medicine Catalog */}
      <Modal
        isOpen={isNewMedModalOpen}
        onClose={() => setIsNewMedModalOpen(false)}
        title="Thêm Thuốc Mới Vào Danh Mục Quầy Dược"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewMedModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateNewMed} variant="primary">
              Lưu thuốc mới
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tên gốc / Hoạt chất chính"
              placeholder="Ví dụ: Cefixime 200mg"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              required
            />
            <Input
              label="Biệt dược thương mại"
              placeholder="Ví dụ: Zifi 200"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
          </div>

          <Input
            label="Hoạt chất & Hàm lượng chi tiết"
            placeholder="Ví dụ: Cefixime trihydrate 200mg"
            value={newActiveIngredient}
            onChange={(e) => setNewActiveIngredient(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Dạng bào chế"
              value={newDosageForm}
              onChange={(e) => setNewDosageForm(e.target.value)}
              options={[
                { value: 'Viên nén bao phim', label: 'Viên nén bao phim' },
                { value: 'Viên nang cứng', label: 'Viên nang cứng' },
                { value: 'Hỗn dịch nhỏ tai', label: 'Hỗn dịch nhỏ tai' },
                { value: 'Dung dịch xịt mũi', label: 'Dung dịch xịt mũi' },
                { value: 'Dung dịch súc họng', label: 'Dung dịch súc họng' },
                { value: 'Gói bột pha hỗn dịch', label: 'Gói bột pha hỗn dịch' },
              ]}
            />
            <Input
              label="Đơn vị tính"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="Viên / Chai / Lọ / Gói"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lô ban đầu"
              value={newBatch}
              onChange={(e) => setNewBatch(e.target.value)}
            />
            <Input
              label="Hạn sử dụng"
              type="date"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng nhập kho đầu kỳ"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
            />
            <Input
              label="Mức tồn tối thiểu (cảnh báo)"
              type="number"
              value={newMinStock}
              onChange={(e) => setNewMinStock(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá nhập dự kiến (đ)"
              type="number"
              value={newImportPrice}
              onChange={(e) => setNewImportPrice(Number(e.target.value))}
            />
            <Input
              label="Giá bán niêm yết (đ)"
              type="number"
              value={newRetailPrice}
              onChange={(e) => setNewRetailPrice(Number(e.target.value))}
            />
          </div>

          <Input
            label="Công ty / Nhà cung cấp dược phẩm"
            value={newSupplier}
            onChange={(e) => setNewSupplier(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

