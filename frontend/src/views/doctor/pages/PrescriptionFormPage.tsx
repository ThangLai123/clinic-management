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
  FileCheck,
  User,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { useClinicStore } from '../../../mock/clinicStore';
import type { PrescriptionItem, Medicine, Reception, Patient } from '../../../types/clinic';

export const PrescriptionFormPage: React.FC = () => {
  const store = useClinicStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const receptionIdParam = searchParams.get('receptionId') || store.receptions[0]?.id;
  const diagnosisParam = searchParams.get('diagnosis') || 'Viêm mũi xoang cấp mủ (J01.9)';

  const [activeReception, setActiveReception] = useState<Reception | null>(null);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState(diagnosisParam);
  const [advice, setAdvice] = useState('Uống thuốc sau ăn, kiêng đồ ăn lạnh, uống nhiều nước ấm, giữ ấm vùng cổ họng.');
  const [followUpDate, setFollowUpDate] = useState('2026-11-14');

  // Items in this prescription
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    {
      medicineId: 'TH-001',
      medicineName: 'Cefuroxime Axetil 500mg (Zinnat)',
      unit: 'Viên',
      quantity: 10,
      route: 'Đường uống',
      dosage: '1 viên/lần',
      frequency: '2 lần/ngày (Sáng 1 - Tối 1)',
      days: 5,
      instructions: 'Uống sau bữa ăn no 15 phút',
    },
    {
      medicineId: 'TH-005',
      medicineName: 'Desloratadine 5mg (Aerius)',
      unit: 'Viên',
      quantity: 7,
      route: 'Đường uống',
      dosage: '1 viên/lần',
      frequency: '1 lần/ngày (Uống trước khi đi ngủ)',
      days: 7,
      instructions: 'Uống với nước ấm',
    },
    {
      medicineId: 'TH-003',
      medicineName: 'Xylometazoline 0.05% (Otrivin)',
      unit: 'Lọ',
      quantity: 1,
      route: 'Xịt mũi tại chỗ',
      dosage: '1 nhát xịt/bên mũi/lần',
      frequency: '2 - 3 lần/ngày',
      days: 5,
      instructions: 'Xịt sau khi đã làm sạch hốc mũi bằng nước muối sinh lý',
    },
  ]);

  // Modal Add Medicine
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [searchMedQuery, setSearchMedQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medicine>(store.medicines[0]);
  const [route, setRoute] = useState('Đường uống');
  const [dosage, setDosage] = useState('1 viên/lần');
  const [frequency, setFrequency] = useState('2 lần/ngày (Sáng 1, Tối 1)');
  const [days, setDays] = useState(5);
  const [quantity, setQuantity] = useState(10);
  const [instructions, setInstructions] = useState('Uống sau bữa ăn');

  // Modal Print Preview
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [createdRxId, setCreatedRxId] = useState<string>('');

  useEffect(() => {
    const rec = store.receptions.find((r) => r.id === receptionIdParam) || store.receptions[0] || null;
    setActiveReception(rec);
    if (rec) {
      const p = store.patients.find((item) => item.id === rec.patientId) || null;
      setActivePatient(p);
    }
  }, [receptionIdParam, store.receptions, store.patients]);

  const handleRemoveItem = (index: number) => {
    setPrescriptionItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMedicineToRx = () => {
    if (!selectedMed || quantity <= 0) return;

    const newItem: PrescriptionItem = {
      medicineId: selectedMed.id,
      medicineName: `${selectedMed.name} (${selectedMed.brandName})`,
      unit: selectedMed.unit,
      quantity,
      route,
      dosage,
      frequency,
      days,
      instructions,
    };

    setPrescriptionItems((prev) => [...prev, newItem]);
    setIsAddMedModalOpen(false);
  };

  const handleSaveDraft = () => {
    alert('Đã lưu bản nháp đơn thuốc thành công!');
  };

  const handleFinalizePrescription = () => {
    if (!activeReception || !activePatient || prescriptionItems.length === 0) {
      alert('Vui lòng thêm ít nhất 1 loại thuốc vào đơn!');
      return;
    }

    const rx = store.addPrescription({
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      receptionId: activeReception.id,
      doctorName: activeReception.assignedDoctorName || 'BS.CKI Lê Hoàng Nam',
      diagnosis,
      items: prescriptionItems,
      advice,
      followUpDate,
      status: 'CHO_PHAT', // Ready for receptionist to dispense
    });

    setCreatedRxId(rx.id);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Lập Đơn Thuốc Điện Tử Chuyên Khoa Tai Mũi Họng"
        subtitle="Use Case 12: Kê đơn thuốc từ danh mục quầy dược phòng khám, kiểm tra tiền sử dị ứng và chuyển quầy phát thuốc (UC-08)."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              Lưu bản nháp
            </Button>
            <Button size="sm" variant="success" onClick={handleFinalizePrescription} leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Hoàn tất đơn & Chuyển phát thuốc
            </Button>
          </div>
        }
      />

      {/* Patient info & Allergy Warning */}
      {activePatient && (
        <Card className="border-blue-200 bg-blue-50/40">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{activePatient.fullName}</h3>
                  <span className="font-mono text-slate-500">Mã: {activePatient.id}</span>
                  <span className="text-slate-400">|</span>
                  <span>{activePatient.birthDate} ({activePatient.gender})</span>
                </div>
                <p className="text-slate-600 font-medium mt-0.5">
                  Chẩn đoán: <strong className="text-blue-800">{diagnosis}</strong>
                </p>
              </div>
            </div>

            {/* Prominent Allergy Box */}
            <div className="p-2.5 bg-rose-100/80 border border-rose-300 rounded-xl text-rose-950 font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>
                TIỀN SỬ DỊ ỨNG:{' '}
                {activePatient.allergies && activePatient.allergies.length > 0
                  ? activePatient.allergies.join(', ')
                  : 'Không ghi nhận'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Prescription Builder Table */}
      <Card
        title={`Danh mục thuốc đã kê (${prescriptionItems.length} khoản)`}
        action={
          <Button size="sm" onClick={() => setIsAddMedModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            Thêm thuốc vào đơn
          </Button>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Tên Thuốc & Biệt Dược</th>
                <th className="py-3 px-4">Đường Dùng</th>
                <th className="py-3 px-4 text-center">Số Lượng</th>
                <th className="py-3 px-4">Liều Dùng & Hướng Dẫn Sử Dụng</th>
                <th className="py-3 px-4 text-center">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptionItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Chưa có loại thuốc nào trong đơn. Nhấn "Thêm thuốc vào đơn" để chọn từ danh mục.
                  </td>
                </tr>
              ) : (
                prescriptionItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{item.medicineName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Mã: {item.medicineId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{item.route}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-blue-800 text-sm">
                      {item.quantity} {item.unit}
                      <span className="block text-[10px] text-slate-400 font-normal">({item.days} ngày)</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <p className="font-semibold">{item.frequency} • {item.dosage}</p>
                      <p className="text-[11px] text-teal-700 font-medium mt-0.5">{item.instructions}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Xóa thuốc"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Doctor Advice & Follow-up */}
      <Card title="Lời dặn của Bác sĩ & Hẹn ngày tái khám">
        <div className="space-y-4 text-xs">
          <Textarea
            label="Lời dặn dò chế độ sinh hoạt & dinh dưỡng"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={2}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hẹn ngày tái khám"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
            <div className="flex items-end">
              <p className="text-slate-500 text-[11px] pb-2">
                * Đơn thuốc sau khi hoàn tất sẽ được chuyển ngay đến <strong>Quầy phát thuốc của Lễ tân (UC-08)</strong> để kiểm tra lô hạn dùng và phát cho bệnh nhân.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* MODAL: Add Medicine To Prescription */}
      <Modal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        title="Chọn Thuốc Từ Danh Mục Quầy Dược"
        maxWidth="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddMedModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddMedicineToRx} variant="primary">
              Thêm vào đơn thuốc
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <Input
              label="Tìm kiếm thuốc theo tên hoặc hoạt chất"
              placeholder="Gõ tên thuốc (Augmentin, Zinnat, Otrivin...)"
              value={searchMedQuery}
              onChange={(e) => setSearchMedQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />

            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
              {store.medicines
                .filter(
                  (m) =>
                    m.name.toLowerCase().includes(searchMedQuery.toLowerCase()) ||
                    m.brandName.toLowerCase().includes(searchMedQuery.toLowerCase())
                )
                .map((m) => {
                  const isSelected = selectedMed?.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMed(m)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="font-bold">{m.name} ({m.brandName})</span>
                        <span className="text-[11px] text-slate-500 block">{m.activeIngredient}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        Tồn: {m.stockQuantity} {m.unit}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <Select
              label="Đường dùng"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              options={[
                { value: 'Đường uống', label: 'Đường uống' },
                { value: 'Xịt mũi tại chỗ', label: 'Xịt mũi tại chỗ' },
                { value: 'Nhỏ tai tại chỗ', label: 'Nhỏ tai tại chỗ' },
                { value: 'Súc họng tại chỗ', label: 'Súc họng tại chỗ' },
                { value: 'Khí dung mũi họng', label: 'Khí dung mũi họng' },
              ]}
            />
            <Input
              label="Liều lượng mỗi lần"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="1 viên/lần, 10ml/lần..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input
                label="Tần suất dùng trong ngày"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="2 lần/ngày (Sáng 1 - Tối 1)"
              />
            </div>
            <Input
              label="Số ngày dùng"
              type="number"
              min={1}
              value={days}
              onChange={(e) => {
                const d = Number(e.target.value);
                setDays(d);
                setQuantity(d * 2); // default 2 pills/day
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Tổng số lượng kê (${selectedMed?.unit || 'đơn vị'})`}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
            <Input
              label="Thời điểm uống"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Uống sau ăn 15 phút"
            />
          </div>
        </div>
      </Modal>

      {/* MODAL: Print Prescription Preview */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Đơn Thuốc Điện Tử (Official Prescription)"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              In đơn thuốc
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs font-sans p-2">
          <div className="text-center border-b border-slate-200 pb-3 space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase">
              Phòng Khám Chuyên Khoa Tai Mũi Họng
            </h3>
            <p className="text-[11px] text-slate-500">125 Giải Phóng, Q. Đống Đa, Hà Nội • Điện thoại: 1900 8899</p>
            <h4 className="font-black text-base text-blue-900 pt-2">ĐƠN THUỐC ĐIỆN TỬ</h4>
            <p className="text-[11px] font-mono text-slate-400">Mã đơn: {createdRxId || 'DT-20261107-DEMO'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <p><strong>Người bệnh:</strong> {activePatient?.fullName}</p>
            <p><strong>Năm sinh:</strong> {activePatient?.birthDate} ({activePatient?.gender})</p>
            <p><strong>Địa chỉ:</strong> {activePatient?.address || 'Hà Nội'}</p>
            <p><strong>Ngày kê đơn:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="col-span-2"><strong>Chẩn đoán:</strong> {diagnosis}</p>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3">
            <h5 className="font-bold text-slate-900">Danh mục thuốc điều trị:</h5>
            {prescriptionItems.map((item, idx) => (
              <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{idx + 1}. {item.medicineName}</span>
                  <span className="text-blue-800">{item.quantity} {item.unit}</span>
                </div>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  Cách dùng: {item.route} - {item.frequency} ({item.dosage}) • {item.instructions}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-2 space-y-1 text-slate-600">
            <p><strong>Lời dặn:</strong> {advice}</p>
            <p><strong>Tái khám:</strong> Hẹn khám lại vào ngày {followUpDate}</p>
          </div>

          <div className="flex justify-between pt-6 text-center text-xs">
            <div>
              <p className="font-bold">Bệnh nhân / Người nhà</p>
              <p className="text-slate-400 text-[10px] italic mt-8">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold">Bác sĩ điều trị</p>
              <p className="text-blue-700 font-semibold mt-8">{activeReception?.assignedDoctorName || 'BS.CKI Lê Hoàng Nam'}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

