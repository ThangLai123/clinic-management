import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Building,
  Layers,
  ArrowUpDown,
  History,
  CheckCircle2,
  Lock,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type {
  Medicine,
  MedicineLot,
  MedicineSupplier,
  InventoryMovement,
  InventoryMovementType,
  MedicineLotStatus,
} from '../../../types/clinic';
import {
  INVENTORY_MOVEMENT_TYPE_MAP,
  MEDICINE_LOT_STATUS_MAP,
} from '../../../types/database';

export const PharmacyInventoryPage: React.FC = () => {
  const store = useClinicStore();

  const [activeTab, setActiveTab] = useState<'MEDICINES' | 'LOTS' | 'SUPPLIERS' | 'MOVEMENTS'>('MEDICINES');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Modal: Create / Edit Medicine ---
  const [isNewMedModalOpen, setIsNewMedModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicineFormError, setMedicineFormError] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('Viên nén');
  const [unit, setUnit] = useState('Viên');
  const [salePrice, setSalePrice] = useState(0);
  const [medNotes, setMedNotes] = useState('');

  // --- Modal: Add Lot (Bảng medicine_lots) ---
  const [isNewLotModalOpen, setIsNewLotModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<MedicineLot | null>(null);
  const [lotFormError, setLotFormError] = useState('');
  const [lotMedicineId, setLotMedicineId] = useState(store.medicines[0]?.id || '1');
  const [lotNumber, setLotNumber] = useState('');
  const [lotExpiryDate, setLotExpiryDate] = useState('2027-12-31');
  const [lotInitialQty, setLotInitialQty] = useState(100);

  // --- Modal: Record Movement (Bảng inventory_movements) ---
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementLotId, setMovementLotId] = useState(store.medicineLots[0]?.id || '1');
  const [movementType, setMovementType] = useState<InventoryMovementType>('ADJUSTMENT');
  const [quantityChange, setQuantityChange] = useState<number>(10);
  const [movementNotes, setMovementNotes] = useState('Kiểm kê định kỳ phát hiện chênh lệch');
  const [movementError, setMovementError] = useState('');

  // --- Modal: Add Supplier (Bảng medicine_suppliers) ---
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<MedicineSupplier | null>(null);
  const [supplierError, setSupplierError] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierTaxCode, setSupplierTaxCode] = useState('');

  // Handlers
  const handleOpenNewMed = () => {
    setEditingMedicine(null);
    setMedicineName('');
    setActiveIngredient('');
    setStrength('');
    setDosageForm('');
    setUnit('Viên');
    setSalePrice(0);
    setMedNotes('');
    setMedicineFormError('');
    setIsNewMedModalOpen(true);
  };

  const handleOpenEditMed = (med: Medicine) => {
    setEditingMedicine(med);
    setMedicineName(med.medicineName);
    setActiveIngredient(med.activeIngredient || '');
    setStrength(med.strength || '');
    setDosageForm(med.dosageForm || '');
    setUnit(med.unit);
    setSalePrice(med.salePrice);
    setMedNotes(med.notes || '');
    setMedicineFormError('');
    setIsNewMedModalOpen(true);
  };

  const handleSaveNewMed = () => {
    if (!medicineName.trim() || !unit.trim() || !Number.isFinite(salePrice) || salePrice < 0) {
      setMedicineFormError('Nhập tên thuốc, đơn vị tính và đơn giá hợp lệ (không âm).');
      return;
    }
    const values = {
      medicineName: medicineName.trim(),
      activeIngredient: activeIngredient.trim() || undefined,
      strength: strength.trim() || undefined,
      dosageForm: dosageForm.trim() || undefined,
      unit: unit.trim(),
      salePrice: Number(salePrice),
      notes: medNotes.trim() || undefined,
    };
    if (editingMedicine) {
      if (!store.updateMedicine(editingMedicine.id, values)) {
        setMedicineFormError('Không tìm thấy thuốc cần cập nhật. Vui lòng tải lại danh sách.');
        return;
      }
    } else {
      store.addMedicine({ ...values, name: values.medicineName });
    }
    setIsNewMedModalOpen(false);
    setEditingMedicine(null);
  };

  const handleDeleteMed = (med: Medicine) => {
    if (med.status === 'ACTIVE') {
      const confirmed = window.confirm(
        `Ngừng sử dụng thuốc "${med.medicineName}"?\nThuốc sẽ không còn được chọn cho đơn mới. Lịch sử đơn thuốc và xuất kho vẫn được giữ lại.`
      );
      if (!confirmed) return;
      store.setMedicineStatus(med.id, 'INACTIVE');
    } else {
      store.setMedicineStatus(med.id, 'ACTIVE');
    }
  };

  const handleOpenNewLot = () => {
    setEditingLot(null);
    setLotMedicineId(store.medicines.find((m) => m.status === 'ACTIVE')?.id || '');
    setLotNumber('');
    setLotExpiryDate('');
    setLotInitialQty(0);
    setLotFormError('');
    setIsNewLotModalOpen(true);
  };

  const handleEditLot = (lot: MedicineLot) => {
    setEditingLot(lot);
    setLotMedicineId(lot.medicineId);
    setLotNumber(lot.lotNumber);
    setLotExpiryDate(lot.expiryDate);
    setLotFormError('');
    setIsNewLotModalOpen(true);
  };

  const handleSaveNewLot = () => {
    if (!lotNumber.trim() || !lotExpiryDate || (!editingLot && (!lotMedicineId || !Number.isFinite(lotInitialQty) || lotInitialQty < 0))) {
      setLotFormError('Nhập đầy đủ số lô, hạn dùng và số lượng hợp lệ.');
      return;
    }
    try {
      if (editingLot) {
        if (!store.updateMedicineLot(editingLot.id, { lotNumber: lotNumber.trim(), expiryDate: lotExpiryDate })) {
          throw new Error('Không tìm thấy lô thuốc.');
        }
      } else {
        if (store.medicineLots.some(l => l.medicineId === lotMedicineId && l.lotNumber === lotNumber.trim() && l.expiryDate === lotExpiryDate)) {
          throw new Error('Số lô và hạn sử dụng này đã tồn tại cho thuốc đã chọn.');
        }
        store.addMedicineLot({
          medicineId: lotMedicineId,
          lotNumber: lotNumber.trim(),
          expiryDate: lotExpiryDate,
          quantity: Number(lotInitialQty),
        });
      }
      setIsNewLotModalOpen(false);
      setEditingLot(null);
    } catch (error) {
      setLotFormError(error instanceof Error ? error.message : 'Không thể lưu lô thuốc.');
    }
  };

  const handleToggleLot = (lot: MedicineLot) => {
    const isBlocking = lot.status !== 'BLOCKED';
    if (isBlocking && !window.confirm(`Khóa lô "${lot.lotNumber}"? Lịch sử xuất nhập vẫn được giữ.`)) return;
    if (!isBlocking && lot.expiryDate < new Date().toISOString().slice(0, 10)) {
      window.alert('Không thể mở khóa lô đã hết hạn.');
      return;
    }
    store.setMedicineLotStatus(lot.id, isBlocking ? 'BLOCKED' : 'AVAILABLE');
  };

  const handleSaveMovement = () => {
    if (!movementNotes.trim() || quantityChange === 0) {
      alert('Vui lòng nhập lý do biến động và số lượng thay đổi khác 0.');
      return;
    }
    try {
      store.recordInventoryMovement({
        medicineLotId: movementLotId,
        movementType,
        quantityChange: Number(quantityChange),
        performedByStaffId: '3', // Hoàng Thu Trang
        notes: movementNotes.trim(),
      });
      setMovementError('');
      setIsMovementModalOpen(false);
    } catch (error) {
      setMovementError(error instanceof Error ? error.message : 'Không thể ghi nhận biến động kho.');
    }
  };

  const handleOpenNewSupplier = () => {
    setEditingSupplier(null);
    setSupplierName('');
    setSupplierPhone('');
    setSupplierEmail('');
    setSupplierAddress('');
    setSupplierTaxCode('');
    setSupplierError('');
    setIsSupplierModalOpen(true);
  };

  const handleEditSupplier = (supplier: MedicineSupplier) => {
    setEditingSupplier(supplier);
    setSupplierName(supplier.supplierName);
    setSupplierPhone(supplier.phone || '');
    setSupplierEmail(supplier.email || '');
    setSupplierAddress(supplier.address || '');
    setSupplierTaxCode(supplier.taxCode || '');
    setSupplierError('');
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!supplierName.trim()) {
      setSupplierError('Tên nhà cung cấp là bắt buộc.');
      return;
    }
    const values = {
      supplierName: supplierName.trim(),
      phone: supplierPhone.trim() || undefined,
      email: supplierEmail.trim() || undefined,
      address: supplierAddress.trim() || undefined,
      taxCode: supplierTaxCode.trim() || undefined,
    };
    if (editingSupplier) {
      if (!store.updateSupplier(editingSupplier.id, values)) {
        setSupplierError('Không tìm thấy nhà cung cấp để cập nhật.');
        return;
      }
    } else {
      store.addSupplier(values);
    }
    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (supplier: MedicineSupplier) => {
    if (supplier.status === 'ACTIVE') {
      if (!window.confirm(`Ngừng sử dụng nhà cung cấp "${supplier.supplierName}"? Thông tin sẽ được lưu lại để tra cứu.`)) return;
      store.setSupplierStatus(supplier.id, 'INACTIVE');
    } else {
      store.setSupplierStatus(supplier.id, 'ACTIVE');
    }
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản lý kho thuốc"
        subtitle="Danh mục thuốc, hạn dùng, nhà cung cấp và tồn kho."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMovementModalOpen(true)}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Nhập / xuất kho
            </Button>
            {activeTab === 'MEDICINES' && (
              <Button size="sm" onClick={handleOpenNewMed} leftIcon={<Plus className="h-4 w-4" />}>
                Thêm thuốc
              </Button>
            )}
            {activeTab === 'LOTS' && (
              <Button size="sm" onClick={handleOpenNewLot} leftIcon={<Plus className="h-4 w-4" />}>
                Thêm lô
              </Button>
            )}
            {activeTab === 'SUPPLIERS' && (
              <Button size="sm" onClick={handleOpenNewSupplier} leftIcon={<Plus className="h-4 w-4" />}>
                Thêm NCC
              </Button>
            )}
          </div>
        }
      />

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'MEDICINES', label: 'Danh mục thuốc', count: store.medicines.length },
            { key: 'LOTS', label: 'Lô thuốc & Hạn dùng', count: store.medicineLots.length },
            { key: 'SUPPLIERS', label: 'Nhà cung cấp', count: store.suppliers.length },
            { key: 'MOVEMENTS', label: 'Lịch sử nhập xuất kho', count: store.inventoryMovements.length },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-60 lg:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên thuốc, số lô..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* TAB 1: Danh mục thuốc (medicines) */}
      {activeTab === 'MEDICINES' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã thuốc</th>
                  <th className="py-3 px-4">Tên biệt dược & Hoạt chất</th>
                  <th className="py-3 px-4">Hàm lượng & Dạng bào chế</th>
                  <th className="py-3 px-4">Đơn vị</th>
                  <th className="py-3 px-4 text-right">Đơn giá bán</th>
                  <th className="py-3 px-4 text-center">Tổng tồn kho</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.medicines
                  .filter((m) => {
                    const q = searchTerm.toLowerCase();
                    return (
                      m.medicineCode.toLowerCase().includes(q) ||
                      m.medicineName.toLowerCase().includes(q) ||
                      (m.activeIngredient && m.activeIngredient.toLowerCase().includes(q))
                    );
                  })
                  .map((m) => {
                    // Compute total quantity across available lots
                    const lots = store.medicineLots.filter((l) => l.medicineId === m.id);
                    const totalQty = lots.reduce((sum, l) => sum + l.quantity, 0);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                          {m.medicineCode}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {m.medicineName}
                          {m.activeIngredient && (
                            <span className="block text-[11px] text-slate-500 font-normal">
                              Hoạt chất: {m.activeIngredient}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <span>{m.strength || 'Theo nhãn'}</span>
                          <span className="block text-[10px] text-slate-400">
                            {m.dosageForm || 'Viên nén'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{m.unit}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {m.salePrice.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              totalQty <= 20
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {totalQty} {m.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              m.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.status === 'ACTIVE' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditMed(m)}
                              leftIcon={<Pencil className="h-3 w-3" />}
                              className="!px-2 !py-1 text-[11px]"
                            >
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title={m.status === 'ACTIVE' ? 'Ngừng dùng thuốc (giữ lịch sử)' : 'Cho phép sử dụng thuốc trở lại'}
                              onClick={() => handleDeleteMed(m)}
                              leftIcon={m.status === 'ACTIVE' ? <Trash2 className="h-3 w-3" /> : <RefreshCw className="h-3 w-3" />}
                              className={`!px-2 !py-1 text-[11px] ${m.status === 'ACTIVE' ? 'text-rose-700 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'}`}
                            >
                              {m.status === 'ACTIVE' ? 'Xóa' : 'Khôi phục'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: Lô thuốc & Hạn dùng (medicine_lots) */}
      {activeTab === 'LOTS' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Số lô sản xuất</th>
                  <th className="py-3 px-4">Tên thuốc liên kết</th>
                  <th className="py-3 px-4">Hạn sử dụng</th>
                  <th className="py-3 px-4 text-center">Tồn kho lô</th>
                  <th className="py-3 px-4 text-center">Trạng thái lô</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.medicineLots
                  .filter((l) => {
                    const q = searchTerm.toLowerCase();
                    return (
                      l.lotNumber.toLowerCase().includes(q) ||
                      (l.medicineName && l.medicineName.toLowerCase().includes(q))
                    );
                  })
                  .map((lot) => {
                    const daysUntilExpiry = Math.ceil((new Date(lot.expiryDate + 'T23:59:59').getTime() - Date.now()) / 86400000);
                    const isExpired = daysUntilExpiry < 0;
                    const isNearExpiry = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

                    return (
                      <tr key={lot.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {lot.lotNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{lot.medicineName}</span>
                          <span className="font-mono text-[10px] text-blue-700">{lot.medicineCode}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              (isNearExpiry || isExpired) ? 'text-rose-600 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {lot.expiryDate.split('-').reverse().join('/')}
                          </span>
                          {(isNearExpiry || isExpired) && (
                            <span className="block text-[10px] text-rose-500 font-medium">
                              {isExpired ? 'Đã hết hạn' : 'Sắp hết hạn'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                          {lot.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <StatusBadge type="lot" status={lot.status} />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                            <Button size="sm" variant="outline" className="!px-2 !py-1 text-[11px]" onClick={() => handleEditLot(lot)}>
                              Sửa
                            </Button>
                            <Button size="sm" variant="ghost" className="!px-2 !py-1 text-[11px] text-blue-700" onClick={() => {
                              setMovementLotId(lot.id);
                              setMovementError('');
                              setIsMovementModalOpen(true);
                            }}>
                              Tồn kho
                            </Button>
                            <Button size="sm" variant="ghost"
                              className={`!px-2 !py-1 text-[11px] ${lot.status === 'BLOCKED' ? 'text-emerald-700' : 'text-rose-700'}`}
                              onClick={() => handleToggleLot(lot)}>
                              {lot.status === 'BLOCKED' ? 'Mở khóa' : 'Khóa'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: Nhà cung cấp (medicine_suppliers) */}
      {activeTab === 'SUPPLIERS' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã NCC</th>
                  <th className="py-3 px-4">Tên nhà cung cấp</th>
                  <th className="py-3 px-4">Điện thoại / Email</th>
                  <th className="py-3 px-4">Mã số thuế</th>
                  <th className="py-3 px-4">Địa chỉ trụ sở</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.suppliers
                  .filter((s) => {
                    const q = searchTerm.toLowerCase();
                    return (
                      s.supplierName.toLowerCase().includes(q) ||
                      s.supplierCode.toLowerCase().includes(q)
                    );
                  })
                  .map((sup) => (
                    <tr key={sup.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {sup.supplierCode}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{sup.supplierName}</td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <span>{sup.phone || 'Chưa có SĐT'}</span>
                        {sup.email && (
                          <span className="block text-[10px] text-slate-400">{sup.email}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {sup.taxCode || 'Chưa cập nhật'}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs text-slate-600 line-clamp-1">
                        {sup.address || 'Chưa cập nhật'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sup.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {sup.status === 'ACTIVE' ? 'Đang hợp tác' : 'Ngừng hợp tác'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                          <Button size="sm" variant="outline" className="!px-2 !py-1 text-[11px]" onClick={() => handleEditSupplier(sup)}>
                            Sửa
                          </Button>
                          <Button size="sm" variant="ghost"
                            className={`!px-2 !py-1 text-[11px] ${sup.status === 'ACTIVE' ? 'text-rose-700' : 'text-emerald-700'}`}
                            onClick={() => handleDeleteSupplier(sup)}>
                            {sup.status === 'ACTIVE' ? 'Xóa' : 'Khôi phục'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: Lịch sử biến động kho (inventory_movements) */}
      {activeTab === 'MOVEMENTS' && (
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Mã lô thuốc</th>
                  <th className="py-3 px-4 text-center">Loại biến động</th>
                  <th className="py-3 px-4 text-right">Số lượng thay đổi</th>
                  <th className="py-3 px-4">Nhân viên thực hiện</th>
                  <th className="py-3 px-4">Lý do & Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.inventoryMovements.map((mov) => {
                  const lot = store.medicineLots.find((l) => l.id === mov.medicineLotId);

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{mov.createdAt}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {lot?.lotNumber || 'Lô chưa xác định'}
                        {lot?.medicineName && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {lot.medicineName}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            mov.movementType === 'IN'
                              ? 'bg-emerald-100 text-emerald-800'
                              : mov.movementType === 'OUT'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {INVENTORY_MOVEMENT_TYPE_MAP[mov.movementType]}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold ${
                          mov.quantityChange > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {mov.performedByStaffName || 'Nhân viên kho'}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm text-slate-600">
                        {mov.notes || 'Không ghi'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: Add / Edit Medicine */}
      <Modal
        isOpen={isNewMedModalOpen}
        onClose={() => setIsNewMedModalOpen(false)}
        title={editingMedicine ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}
        subtitle={editingMedicine ? `Mã thuốc: ${editingMedicine.medicineCode}` : 'Nhập thông tin thuốc dùng cho kê đơn và quản lý kho'}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewMedModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveNewMed} variant="primary">
              {editingMedicine ? 'Lưu thay đổi' : 'Thêm thuốc'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {medicineFormError && (
            <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{medicineFormError}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Tên biệt dược / Tên thuốc"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="Ví dụ: Augmentin 1g"
              required
            />
            <Input
              label="Hoạt chất chính"
              value={activeIngredient}
              onChange={(e) => setActiveIngredient(e.target.value)}
              placeholder="Amoxicillin + Clavulanic acid"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Hàm lượng"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder="Ví dụ: 1000mg, 16mg, 120 liều..."
            />
            <Input
              label="Dạng bào chế"
              value={dosageForm}
              onChange={(e) => setDosageForm(e.target.value)}
              placeholder="Viên nén bao phim, xịt mũi..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Đơn vị tính"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Viên, Lọ, Chai, Vỉ..."
              required
            />
            <Input
              label="Đơn giá bán niêm yết (₫)"
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Ghi chú dược lý / Chỉ định"
            value={medNotes}
            onChange={(e) => setMedNotes(e.target.value)}
            placeholder="Kháng sinh diệt khuẩn, chống viêm corticoid..."
          />
        </div>
      </Modal>

      {/* MODAL: Add New Lot */}
      <Modal
        isOpen={isNewLotModalOpen}
        onClose={() => setIsNewLotModalOpen(false)}
        title={editingLot ? 'Sửa thông tin lô thuốc' : 'Thêm lô thuốc mới'}
        subtitle={editingLot ? 'Số lượng tồn kho chỉ được thay đổi qua nhập, xuất hoặc kiểm kê.' : 'Quản lý số lô và hạn sử dụng'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsNewLotModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveNewLot} variant="primary">
              {editingLot ? 'Lưu thay đổi' : 'Tạo lô thuốc'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {lotFormError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{lotFormError}</p>}
          <Select
            label="Thuốc liên kết"
            value={lotMedicineId}
            onChange={(e) => setLotMedicineId(e.target.value)}
            disabled={Boolean(editingLot)}
            options={store.medicines.filter((m) => m.status === 'ACTIVE' || m.id === editingLot?.medicineId).map((m) => ({
              value: m.id,
              label: `${m.medicineName} (${m.medicineCode})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Số lô sản xuất"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="L241120..."
              required
            />
            <Input
              label="Hạn sử dụng"
              type="date"
              value={lotExpiryDate}
              onChange={(e) => setLotExpiryDate(e.target.value)}
              required
            />
          </div>

          {!editingLot && <Input
            label="Số lượng nhập ban đầu"
            type="number"
            value={lotInitialQty}
            onChange={(e) => setLotInitialQty(Number(e.target.value))}
            min={0}
            required
          />}
        </div>
      </Modal>

      {/* MODAL: Record Inventory Movement */}
      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        title="Ghi Nhận Nhập Xuất Kho Thuốc"
        subtitle="Không sửa trực tiếp tồn kho: Mọi thay đổi đều được lưu vết qua nhật ký nhập xuất"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsMovementModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveMovement} variant="primary">
              Xác nhận ghi nhận kho
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {movementError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{movementError}</p>}
          <Select
            label="Chọn lô thuốc cần ghi nhận"
            value={movementLotId}
            onChange={(e) => setMovementLotId(e.target.value)}
            options={store.medicineLots.map((l) => ({
              value: l.id,
              label: `Lô ${l.lotNumber} - ${l.medicineName} (Hiện có: ${l.quantity})`,
            }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Hình thức nhập xuất"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as InventoryMovementType)}
              options={[
                { value: 'IN', label: 'Nhập thêm vào kho' },
                { value: 'OUT', label: 'Xuất kho / Hủy hỏng' },
                { value: 'ADJUSTMENT', label: 'Kiểm kê điều chỉnh sai lệch' },
              ]}
            />
            <Input
              label="Số lượng thay đổi (+ hoặc -)"
              type="number"
              value={quantityChange}
              onChange={(e) => setQuantityChange(Number(e.target.value))}
              helperText="Nhập số âm nếu giảm tồn (ví dụ: -5) hoặc số dương nếu tăng tồn."
              required
            />
          </div>

          <Input
            label="Lý do ghi nhận biến động"
            value={movementNotes}
            onChange={(e) => setMovementNotes(e.target.value)}
            placeholder="Kiểm kê cuối tháng phát hiện chênh lệch, vỡ hỏng do vận chuyển..."
            required
          />
        </div>
      </Modal>

      {/* MODAL: Add Supplier */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title={editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
        subtitle={editingSupplier ? `Mã NCC: ${editingSupplier.supplierCode}` : 'Thông tin đối tác cung ứng thuốc'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSupplierModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveSupplier} variant="primary">
              {editingSupplier ? 'Lưu thay đổi' : 'Thêm nhà cung cấp'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {supplierError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">{supplierError}</p>}
          <Input
            label="Tên nhà cung cấp / Công ty dược"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            placeholder="Ví dụ: Công ty Cổ phần Dược Hậu Giang"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Số điện thoại"
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
              placeholder="024..."
            />
            <Input
              label="Email liên hệ"
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
              placeholder="contact@dhg.vn"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Mã số thuế"
              value={supplierTaxCode}
              onChange={(e) => setSupplierTaxCode(e.target.value)}
              placeholder="1800156..."
            />
            <Input
              label="Địa chỉ trụ sở"
              value={supplierAddress}
              onChange={(e) => setSupplierAddress(e.target.value)}
              placeholder="288 Bis Nguyễn Văn Cừ, Cần Thơ"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};