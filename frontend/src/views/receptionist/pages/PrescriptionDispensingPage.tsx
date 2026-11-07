import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Search,
  User,
  Clock,
  FileCheck,
  PackageCheck,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Prescription } from '../../../types/clinic';

export const PrescriptionDispensingPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  // Filter prescriptions
  const pendingRxList = store.prescriptions.filter((p) => {
    const matchSearch =
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const handleOpenDispense = (rx: Prescription) => {
    setSelectedRx(rx);
    setIsDispenseModalOpen(true);
  };

  const handleConfirmDispense = () => {
    if (!selectedRx) return;
    store.dispensePrescription(selectedRx.id, 'Dược tá Hoàng Thu Trang');
    setIsDispenseModalOpen(false);
    setIsSlipModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quầy Phát Thuốc Theo Đơn Bác Sĩ"
        subtitle="Use Case 08: Kiểm tra đơn thuốc đã hoàn tất, đối soát tồn kho và hạn dùng lô thuốc trước khi bàn giao cho người bệnh."
      />

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Tổng số đơn thuốc trên hệ thống: <strong className="text-slate-800">{store.prescriptions.length} đơn</strong>{' '}
          (Đang chờ phát: <strong className="text-amber-700">{store.prescriptions.filter((p) => p.status === 'CHO_PHAT').length}</strong>)
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn thuốc, tên người bệnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Prescription List */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã đơn thuốc</th>
                <th className="py-3 px-4">Bệnh nhân</th>
                <th className="py-3 px-4">Bác sĩ kê đơn</th>
                <th className="py-3 px-4">Chẩn đoán</th>
                <th className="py-3 px-4">Số khoản thuốc</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingRxList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Chưa có đơn thuốc nào đang chờ phát.
                  </td>
                </tr>
              ) : (
                pendingRxList.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {rx.id}
                      <span className="block text-[10px] text-slate-400 font-normal">{rx.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{rx.patientName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">BN: {rx.patientId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {rx.doctorName}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-800">
                      <p className="line-clamp-1">{rx.diagnosis}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {rx.items.length} loại thuốc
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="prescription" value={rx.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {rx.status === 'CHO_PHAT' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenDispense(rx)}
                          leftIcon={<PackageCheck className="h-4 w-4" />}
                        >
                          Kiểm tra & Phát thuốc
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRx(rx);
                            setIsSlipModalOpen(true);
                          }}
                          leftIcon={<Printer className="h-3.5 w-3.5" />}
                        >
                          In phiếu phát
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Safety Notice */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Quy chế kiểm soát dược lâm sàng:
        </p>
        <p>
          Nhân viên phát thuốc tuyệt đối không được tự ý đổi thuốc hoặc thay đổi liều lượng đã được Bác sĩ chỉ định. Mọi thay đổi phải có xác nhận chuyên môn của Bác sĩ điều trị.
        </p>
      </div>

      {/* MODAL: Dispensing Inspection */}
      <Modal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        title="Đối Soát & Xác Nhận Cấp Phát Thuốc"
        subtitle={selectedRx ? `Đơn thuốc: ${selectedRx.id} - Người bệnh: ${selectedRx.patientName}` : ''}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDispenseModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmDispense} variant="success" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Xác nhận phát đủ thuốc & Trừ kho
            </Button>
          </>
        }
      >
        <div className="space-y-5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
            <p><strong>Bệnh nhân:</strong> {selectedRx?.patientName}</p>
            <p><strong>Bác sĩ kê đơn:</strong> {selectedRx?.doctorName}</p>
            <p className="col-span-2"><strong>Chẩn đoán:</strong> {selectedRx?.diagnosis}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Danh mục thuốc cần phát theo đơn:</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Tên thuốc & Dạng dùng</th>
                    <th className="py-2.5 px-3 text-center">SL kê</th>
                    <th className="py-2.5 px-3 text-center">Tồn kho</th>
                    <th className="py-2.5 px-3">Lô & Hạn dùng</th>
                    <th className="py-2.5 px-3">Liều & Cách dùng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedRx?.items.map((item, idx) => {
                    const medInStock = store.medicines.find((m) => m.id === item.medicineId);
                    const isEnough = medInStock ? medInStock.stockQuantity >= item.quantity : false;

                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.medicineName}
                          <span className="block text-[11px] text-slate-400 font-normal">
                            {item.route}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {medInStock ? (
                            <span
                              className={`font-bold ${
                                isEnough ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {medInStock.stockQuantity} {medInStock.unit}
                            </span>
                          ) : (
                            <span className="text-rose-500">Hết hàng</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {medInStock ? (
                            <span>
                              Lô {medInStock.batchNumber} (HSD: {medInStock.expiryDate})
                            </span>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          <span>{item.frequency}</span>
                          <span className="block text-teal-700 font-medium">{item.instructions}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRx?.advice && (
            <p className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 italic">
              Lời dặn theo dõi: "{selectedRx.advice}"
            </p>
          )}
        </div>
      </Modal>

      {/* MODAL: Dispensing Slip (Phiếu phát thuốc để in) */}
      <Modal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        title="Phiếu Xuất & Cấp Phát Thuốc Điều Trị"
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
        <div className="space-y-4 text-xs font-sans p-2">
          <div className="text-center border-b border-slate-200 pb-3 space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase">
              Phòng Khám Chuyên Khoa Tai Mũi Họng
            </h3>
            <p className="text-[11px] text-slate-500">125 Giải Phóng, Q. Đống Đa, Hà Nội • Hotline: 1900 8899</p>
            <h4 className="font-bold text-base text-blue-800 pt-2">PHIẾU PHÁT THUỐC ĐIỆN TỬ</h4>
            <p className="text-[11px] font-mono text-slate-400">Mã đơn: {selectedRx?.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <p><strong>Bệnh nhân:</strong> {selectedRx?.patientName}</p>
            <p><strong>Mã bệnh nhân:</strong> {selectedRx?.patientId}</p>
            <p><strong>Bác sĩ điều trị:</strong> {selectedRx?.doctorName}</p>
            <p><strong>Ngày phát thuốc:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="col-span-2"><strong>Chẩn đoán:</strong> {selectedRx?.diagnosis}</p>
          </div>

          <table className="w-full text-left text-xs border border-slate-200 mt-2">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-2">Tên thuốc</th>
                <th className="p-2 text-center">Số lượng</th>
                <th className="p-2">Cách dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedRx?.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-semibold">{item.medicineName}</td>
                  <td className="p-2 text-center font-bold">{item.quantity} {item.unit}</td>
                  <td className="p-2">{item.frequency} - {item.instructions}</td>
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
              <p className="font-bold">Dược tá phát thuốc</p>
              <p className="text-blue-700 font-semibold mt-8">{selectedRx?.dispensedBy || 'Hoàng Thu Trang'}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

