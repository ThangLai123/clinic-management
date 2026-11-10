import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Search,
  User,
  Clock,
  PackageCheck,
  CheckSquare,
  Eye,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Dispensation, DispensationStatus } from '../../../types/clinic';
import { DISPENSATION_STATUS_MAP } from '../../../types/database';

export const PrescriptionDispensingPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [selectedDisp, setSelectedDisp] = useState<Dispensation | null>(null);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // Filter dispensations
  const filteredDispensations = store.dispensations.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (d.dispensationCode || '').toLowerCase().includes(q) ||
      (d.prescriptionCode || '').toLowerCase().includes(q) ||
      (d.patientName || '').toLowerCase().includes(q);

    const matchStatus = statusFilter === 'ALL' || d.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleOpenDispense = (disp: Dispensation) => {
    setSelectedDisp(disp);
    setIsDispenseModalOpen(true);
  };

  const handleConfirmDispense = () => {
    if (!selectedDisp) return;
    store.dispensePrescription(selectedDisp.id, '3'); // Dược tá Hoàng Thu Trang
    setIsDispenseModalOpen(false);
    setIsSlipModalOpen(true);
  };

  const handleOpenPrint = (disp: Dispensation) => {
    setSelectedDisp(disp);
    setIsSlipModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Phát thuốc theo đơn"
        subtitle="Kiểm tra đơn đã xác nhận, chọn lô và ghi nhận phát thuốc."
      />

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'ALL', label: 'Tất cả phiếu phát', count: store.dispensations.length },
            {
              key: 'PENDING',
              label: 'Chờ phát thuốc',
              count: store.dispensations.filter((d) => d.status === 'PENDING').length,
            },
            {
              key: 'COMPLETED',
              label: 'Đã hoàn tất',
              count: store.dispensations.filter((d) => d.status === 'COMPLETED').length,
            },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key as any)}
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

        <div className="relative w-full sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm phiếu phát, đơn, bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Dispensations Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã phiếu phát</th>
                <th className="py-3 px-4">Mã đơn thuốc</th>
                <th className="py-3 px-4">Bệnh nhân</th>
                <th className="py-3 px-4">Số lượng thuốc</th>
                <th className="py-3 px-4">Nhân viên phụ trách</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDispensations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy phiếu phát thuốc nào theo điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredDispensations.map((disp) => {
                  const isPending = disp.status === 'PENDING';

                  return (
                    <tr key={disp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {disp.dispensationCode}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {disp.createdAt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        {disp.prescriptionCode}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {disp.patientName || 'Chưa có thông tin'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {disp.items.length} mặt hàng
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {disp.dispensedByStaffName || 'Hoàng Thu Trang'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge type="dispensation" status={disp.status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isPending ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenDispense(disp)}
                            leftIcon={<PackageCheck className="h-4 w-4" />}
                          >
                            Kiểm tra & phát
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDispense(disp)}
                              leftIcon={<Eye className="h-3.5 w-3.5" />}
                            >
                              Xem phiếu
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPrint(disp)}
                              leftIcon={<Printer className="h-3.5 w-3.5" />}
                            >
                              In phiếu
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Safety Notice */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Quy chế kiểm soát cấp phát thuốc Tai Mũi Họng:</p>
          <p className="mt-0.5 text-amber-800">
            Hệ thống chỉ cho phép lập và xử lý phát thuốc đối với các đơn thuốc đã được Bác sĩ ký xác nhận. 
            Khi hoàn tất phát thuốc, hệ thống sẽ tự động cập nhật giảm số lượng tồn kho theo lô tương ứng và lưu lịch sử xuất kho của phòng khám.
          </p>
        </div>
      </div>

      {/* MODAL: Dispense Inspection & Confirmation */}
      <Modal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        title={
          selectedDisp?.status === 'COMPLETED'
            ? 'Chi Tiết Phiếu Phát Thuốc'
            : 'Đối Soát & Xác Nhận Cấp Phát Thuốc'
        }
        subtitle={selectedDisp ? `Mã phiếu: ${selectedDisp.dispensationCode} • Đơn thuốc: ${selectedDisp.prescriptionCode}` : ''}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDispenseModalOpen(false)}>
              Đóng
            </Button>
            {selectedDisp?.status === 'PENDING' && (
              <Button
                onClick={handleConfirmDispense}
                variant="success"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                Xác nhận phát thuốc & Trừ kho
              </Button>
            )}
            {selectedDisp?.status === 'COMPLETED' && (
              <Button
                onClick={() => {
                  setIsDispenseModalOpen(false);
                  setIsSlipModalOpen(true);
                }}
                variant="primary"
                leftIcon={<Printer className="h-4 w-4" />}
              >
                In phiếu phát
              </Button>
            )}
          </>
        }
      >
        {selectedDisp && (
          <div className="space-y-4 text-xs text-slate-700">
            {/* Meta summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Người nhận thuốc:</span>
                <span className="font-bold text-slate-900">{selectedDisp.patientName || 'Chưa có thông tin'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Dược tá bàn giao:</span>
                <span className="font-semibold text-slate-800">{selectedDisp.dispensedByStaffName || 'Chưa cập nhật'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Trạng thái phiếu:</span>
                <StatusBadge type="dispensation" status={selectedDisp.status} />
              </div>
            </div>

            {/* Dispensation Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Danh sách thuốc cấp phát:
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Tên thuốc</th>
                      <th className="py-2.5 px-3">Lô chỉ định</th>
                      <th className="py-2.5 px-3 text-center">Số lượng</th>
                      <th className="py-2.5 px-3 text-right">Đơn giá</th>
                      <th className="py-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedDisp.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.medicineName}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-blue-700">
                          {item.lotNumber}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {item.unitPrice.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {(item.totalPrice || item.quantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedDisp.status === 'COMPLETED' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Phiếu phát thuốc đã hoàn tất vào lúc <strong>{selectedDisp.dispensedAt}</strong>. Dữ liệu đã khóa và không thể chỉnh sửa.
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* MODAL: Printable Dispensing Slip */}
      <Modal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        title="Phiếu Cấp Phát Thuốc Điều Trị"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSlipModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              In phiếu phát thuốc
            </Button>
          </>
        }
      >
        {selectedDisp && (
          <div className="space-y-4 text-xs font-sans p-2">
            <div className="text-center border-b border-slate-200 pb-3 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                Phòng Khám Chuyên Khoa Tai Mũi Họng
              </h3>
              <p className="text-[11px] text-slate-500">33 Đ. Bùi Thế Đạt, Vinh Phú, Nghệ An • Hotline: 1900 8899</p>
              <h4 className="font-bold text-base text-blue-800 pt-2">PHIẾU PHÁT THUỐC BỆNH NHÂN</h4>
              <p className="text-[11px] font-mono text-slate-400">Mã phiếu: {selectedDisp.dispensationCode}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <p><strong>Bệnh nhân:</strong> {selectedDisp.patientName}</p>
              <p><strong>Đơn thuốc số:</strong> {selectedDisp.prescriptionCode}</p>
              <p><strong>Dược tá thực hiện:</strong> {selectedDisp.dispensedByStaffName}</p>
              <p><strong>Thời gian cấp phát:</strong> {selectedDisp.dispensedAt || selectedDisp.createdAt}</p>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 mt-2">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-2">Tên thuốc</th>
                  <th className="p-2 font-mono">Số lô</th>
                  <th className="p-2 text-center">Số lượng</th>
                  <th className="p-2 text-right">Đơn giá</th>
                  <th className="p-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedDisp.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold">{item.medicineName}</td>
                    <td className="p-2 font-mono text-blue-700">{item.lotNumber}</td>
                    <td className="p-2 text-center font-bold">{item.quantity} {item.unit}</td>
                    <td className="p-2 text-right">{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-2 text-right font-bold">{(item.totalPrice || item.quantity * item.unitPrice).toLocaleString('vi-VN')} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between pt-6 text-center text-xs">
              <div>
                <p className="font-bold">Người nhận thuốc</p>
                <p className="text-slate-400 text-[10px] italic mt-8">(Ký và ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold">Dược tá phụ trách</p>
                <p className="text-blue-700 font-semibold mt-8">{selectedDisp.dispensedByStaffName}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};