import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Pill,
  Search,
  Plus,
  Trash2,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Lock,
  Save,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Prescription, PrescriptionItem, Medicine, Reception, Patient } from '../../../types/clinic';
import { PRESCRIPTION_STATUS_MAP } from '../../../types/database';

export const PrescriptionFormPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const examIdParam = searchParams.get('examId') || store.examinations[0]?.id;

  const [activeExam, setActiveExam] = useState(
    store.examinations.find((e) => e.id === examIdParam) || store.examinations[0] || null
  );
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);

  // Form states
  const [instructions, setInstructions] = useState('Uống thuốc sau ăn, kiêng đồ ăn lạnh, súc họng nước muối sinh lý hàng ngày.');
  const [items, setItems] = useState<Omit<PrescriptionItem, 'id' | 'prescriptionId' | 'createdAt'>[]>([
    {
      medicineId: '1',
      medicineName: 'Augmentin 1g',
      unit: 'Viên',
      dosage: '1 viên/lần',
      frequency: '2 lần/ngày (Sáng 1 - Tối 1)',
      durationDays: 7,
      quantity: 14,
      instructions: 'Uống ngay đầu bữa ăn để giảm kích ứng dạ dày',
    },
    {
      medicineId: '2',
      medicineName: 'Avamys Nasal Spray 120 sprays',
      unit: 'Lọ',
      dosage: '2 nhát xịt/bên mũi/lần',
      frequency: '1 lần/ngày vào buổi sáng',
      durationDays: 30,
      quantity: 1,
      instructions: 'Xịt sau khi đã rửa sạch mũi, lắc đều lọ thuốc trước khi xịt',
    },
  ]);

  // Modal Add Medicine
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string>(store.medicines[0]?.id || '1');
  const [dosage, setDosage] = useState('1 viên/lần');
  const [frequency, setFrequency] = useState('2 lần/ngày (Sáng 1, Tối 1)');
  const [durationDays, setDurationDays] = useState(5);
  const [quantity, setQuantity] = useState(10);
  const [itemInstructions, setItemInstructions] = useState('Uống sau bữa ăn no 15 phút');

  // Load existing prescription if already created for this examination
  useEffect(() => {
    if (activeExam) {
      const rx = store.prescriptions.find((p) => p.examinationId === activeExam.id);
      if (rx) {
        setActivePrescription(rx);
        setInstructions(rx.instructions || '');
        setItems(rx.items);
      }
    }
  }, [activeExam, store.prescriptions]);

  const isSigned = activePrescription?.status === 'SIGNED';

  const handleAddItem = () => {
    const med = store.medicines.find((m) => m.id === selectedMedId);
    if (!med || med.status !== 'ACTIVE') {
      window.alert('Thuốc này đã ngừng sử dụng. Vui lòng chọn thuốc khác.');
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        medicineId: med.id,
        medicineName: med.medicineName,
        unit: med.unit,
        dosage,
        frequency,
        durationDays: Number(durationDays),
        quantity: Number(quantity),
        instructions: itemInstructions,
      },
    ]);

    setIsAddMedModalOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    if (isSigned) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = () => {
    if (!activeExam) return;
    const newRx = store.createPrescription({
      examinationId: activeExam.id,
      doctorStaffId: '2',
      status: 'DRAFT',
      instructions,
      items,
    });
    setActivePrescription(newRx);
    alert('Đã lưu bản nháp đơn thuốc (DRAFT)!');
  };

  const handleSignPrescription = () => {
    if (!activeExam) return;
    if (items.length === 0) {
      alert('Vui lòng thêm ít nhất một thuốc vào đơn thuốc.');
      return;
    }

    if (window.confirm('Xác nhận KÝ SỐ đơn thuốc (SIGNED)? Đơn thuốc sẽ tự động chuyển sang quầy dược để phát thuốc và khóa chỉnh sửa.')) {
      const signedRx = store.createPrescription({
        examinationId: activeExam.id,
        doctorStaffId: '2',
        status: 'SIGNED',
        instructions,
        items,
      });
      setActivePrescription(signedRx);
    }
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Kê đơn thuốc"
        subtitle="Chọn thuốc, nhập liều dùng và xác nhận đơn."
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} variant="outline" leftIcon={<Printer className="h-4 w-4" />}>
              In đơn thuốc
            </Button>
          </div>
        }
      />

      {/* Prescription Card */}
      <Card
        title={`Đơn thuốc • ${activeExam?.examinationCode || 'Chưa chọn lượt khám'}`}
        subtitle={`Người bệnh: ${activePrescription?.patientName || 'Chưa có thông tin'} • Bác sĩ kê đơn: ${activePrescription?.doctorName || 'BS.CKI Lê Hoàng Nam'}`}
        action={
          activePrescription ? (
            <StatusBadge type="prescription" status={activePrescription.status} />
          ) : (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Đang soạn thảo
            </span>
          )
        }
      >
        <div className="space-y-5 text-xs">
          {isSigned && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                Đơn thuốc đã được ký duyệt vào lúc <strong>{activePrescription?.signedAt}</strong>. Dữ liệu đã chuyển sang quầy dược và được khóa chỉnh sửa.
              </span>
            </div>
          )}

          {/* Prescription Items Table */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Danh sách thuốc chỉ định ({items.length} loại)
              </h4>
              {!isSigned && (
                <Button size="sm" onClick={() => {
                  const firstActive = store.medicines.find((m) => m.status === 'ACTIVE');
                  if (!firstActive) {
                    window.alert('Không có thuốc đang sử dụng trong danh mục.');
                    return;
                  }
                  if (!store.medicines.some((m) => m.id === selectedMedId && m.status === 'ACTIVE')) {
                    setSelectedMedId(firstActive.id);
                  }
                  setIsAddMedModalOpen(true);
                }} leftIcon={<Plus className="h-3.5 w-3.5" />}>
                  Thêm thuốc vào đơn
                </Button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Tên thuốc & Biệt dược</th>
                    <th className="py-2.5 px-3 text-center">Số lượng</th>
                    <th className="py-2.5 px-3">Liều lượng</th>
                    <th className="py-2.5 px-3">Tần suất dùng</th>
                    <th className="py-2.5 px-3 text-center">Số ngày</th>
                    <th className="py-2.5 px-3">Hướng dẫn sử dụng</th>
                    {!isSigned && <th className="py-2.5 px-3 text-center">Xóa</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Chưa có thuốc nào trong đơn. Nhấn "Thêm thuốc vào đơn" để chọn.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.medicineName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{item.dosage}</td>
                        <td className="py-2.5 px-3 text-slate-700">{item.frequency}</td>
                        <td className="py-2.5 px-3 text-center text-slate-700">{item.durationDays} ngày</td>
                        <td className="py-2.5 px-3 text-teal-800 font-medium">{item.instructions}</td>
                        {!isSigned && (
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prescription General Instructions */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 text-xs block">
              Lời dặn dò & Hướng dẫn dùng thuốc:
            </label>
            <textarea
              rows={3}
              disabled={isSigned}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Uống thuốc sau bữa ăn, không tự ý ngừng thuốc, tái khám đúng hẹn..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
            />
          </div>

          {/* Action Buttons if not signed */}
          {!isSigned && (
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="outline" onClick={handleSaveDraft} leftIcon={<Save className="h-4 w-4" />}>
                Lưu bản nháp
              </Button>
              <Button size="sm" variant="success" onClick={handleSignPrescription} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
                Xác nhận đơn
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* MODAL: Add Medicine Item */}
      <Modal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        title="Thêm Thuốc Vào Đơn"
        subtitle="Chọn thuốc từ danh mục chuẩn hóa và chỉ định liều lượng cụ thể"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddMedModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddItem} variant="primary">
              Thêm vào đơn
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Select
            label="Chọn thuốc trong danh mục *"
            value={selectedMedId}
            onChange={(e) => setSelectedMedId(e.target.value)}
            options={store.medicines
              .filter((m) => m.status === 'ACTIVE')
              .map((m) => ({
                value: m.id,
                label: `${m.medicineName} (${m.activeIngredient || 'Dược phẩm'}) - ${m.unit}`,
              }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Liều dùng một lần *"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="1 viên/lần, 2 nhát xịt/lần..."
              required
            />
            <Input
              label="Tần suất dùng trong ngày *"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="2 lần/ngày (Sáng 1 - Tối 1)..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Số ngày điều trị *"
              type="number"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              min={1}
              required
            />
            <Input
              label="Tổng số lượng cấp *"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              required
            />
          </div>

          <Input
            label="Hướng dẫn uống / dùng chi tiết"
            value={itemInstructions}
            onChange={(e) => setItemInstructions(e.target.value)}
            placeholder="Uống sau bữa ăn no 15 phút với nhiều nước..."
          />
        </div>
      </Modal>
    </div>
  );
};