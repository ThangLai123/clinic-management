import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Printer,
  Calendar,
  User,
  Stethoscope,
  Pill,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { useClinicStore } from '../../../mock/clinicStore';
import type { MedicalRecord } from '../../../types/clinic';

export const MedicalRecordDetailPage: React.FC = () => {
  const store = useClinicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord>(store.medicalRecords[0] || null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredRecords = store.medicalRecords.filter((r) => {
    return (
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản Lý Hồ Sơ Bệnh Án Điện Tử Tai Mũi Họng"
        subtitle="Use Case 11: Tổng hợp bệnh sử, kết quả khám lâm sàng, nội soi NBI, chẩn đoán ICD-10 và lưu trữ bệnh án điện tử."
        actions={
          selectedRecord && (
            <Button onClick={() => setIsPrintModalOpen(true)} leftIcon={<Printer className="h-4 w-4" />}>
              In bệnh án tóm tắt
            </Button>
          )
        }
      />

      {/* Grid: Records List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Records list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Mã BA, tên người bệnh, chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredRecords.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">Không tìm thấy bệnh án nào.</p>
            ) : (
              filteredRecords.map((rec) => {
                const isSelected = selectedRecord?.id === rec.id;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{rec.patientName}</span>
                      <span className="font-mono text-[10px] text-blue-700 font-bold">{rec.id}</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{rec.diagnosis}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{rec.examDate}</span>
                      <span>BS: {rec.doctorName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Record Detail View */}
        <div className="lg:col-span-8">
          {selectedRecord ? (
            <Card
              title={
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-700" />
                  <span>Bệnh Án Điện Tử: {selectedRecord.id}</span>
                </div>
              }
              action={
                <Badge variant="green" dot>
                  Hồ sơ đã hoàn tất
                </Badge>
              }
            >
              <div className="space-y-6 text-xs text-slate-700">
                {/* Patient administrative header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bệnh nhân:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedRecord.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Giới tính / Ngày sinh:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedRecord.gender} • {selectedRecord.birthDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mã bệnh nhân:</span>
                    <span className="font-mono font-bold text-blue-700">{selectedRecord.patientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bác sĩ phụ trách:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.doctorName}</span>
                  </div>
                </div>

                {/* Complaint and History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800">
                    1. Lý do khám & Diễn biến bệnh sử
                  </h4>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p><strong>Lý do vào viện:</strong> {selectedRecord.chiefComplaint}</p>
                    <p className="text-slate-600"><strong>Bệnh sử & tiền sử:</strong> {selectedRecord.medicalHistory}</p>
                  </div>
                </div>

                {/* Exam Findings */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800">
                    2. Kết quả thăm khám Tai Mũi Họng lâm sàng
                  </h4>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 leading-relaxed">
                    <p>{selectedRecord.examinationSummary}</p>
                    {selectedRecord.endoscopySummary && (
                      <p className="text-blue-900 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 font-medium">
                        <strong>Nội soi NBI:</strong> {selectedRecord.endoscopySummary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Diagnosis & Treatment */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-blue-800">
                    3. Chẩn đoán kết luận & Phác đồ điều trị
                  </h4>
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
                    <p className="text-sm font-bold text-emerald-900">
                      Chẩn đoán: {selectedRecord.diagnosis}{' '}
                      {selectedRecord.icdCode && (
                        <span className="text-xs font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                          Mã ICD-10: {selectedRecord.icdCode}
                        </span>
                      )}
                    </p>
                    <p>
                      <strong>Hướng điều trị:</strong> {selectedRecord.treatmentPlan}
                    </p>
                    {selectedRecord.followUpDate && (
                      <p className="font-bold text-blue-800 pt-1">
                        📅 Hẹn tái khám: {selectedRecord.followUpDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Hồ sơ lưu trữ điện tử lúc: {selectedRecord.createdAt}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`/doctor/prescriptions?receptionId=${selectedRecord.receptionId}`}>
                      <Button size="sm" variant="outline" leftIcon={<Pill className="h-4 w-4" />}>
                        Đơn thuốc liên kết (UC-12)
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-center py-10 text-xs text-slate-400">Vui lòng chọn một hồ sơ bệnh án bên trái để xem chi tiết.</p>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL: Print Medical Record */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Bệnh Án Điện Tử Tóm Tắt (Medical Record Slip)"
        maxWidth="2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              In bệnh án
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
            <h4 className="font-black text-base text-blue-900 pt-2">PHIẾU KẾT QUẢ KHÁM BỆNH</h4>
            <p className="text-[11px] font-mono text-slate-400">Số BA: {selectedRecord?.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <p><strong>Họ tên:</strong> {selectedRecord?.patientName}</p>
            <p><strong>Mã BN:</strong> {selectedRecord?.patientId}</p>
            <p><strong>Ngày sinh / Giới tính:</strong> {selectedRecord?.birthDate} ({selectedRecord?.gender})</p>
            <p><strong>Ngày khám:</strong> {selectedRecord?.examDate}</p>
            <p className="col-span-2"><strong>Lý do đến khám:</strong> {selectedRecord?.chiefComplaint}</p>
          </div>

          <div className="space-y-1.5 border-t border-slate-200 pt-2">
            <p><strong>Khám lâm sàng TMH:</strong> {selectedRecord?.examinationSummary}</p>
            {selectedRecord?.endoscopySummary && (
              <p><strong>Kết quả nội soi:</strong> {selectedRecord?.endoscopySummary}</p>
            )}
            <p className="text-sm font-bold text-slate-900 pt-1">
              Chẩn đoán: {selectedRecord?.diagnosis} ({selectedRecord?.icdCode})
            </p>
            <p><strong>Hướng điều trị:</strong> {selectedRecord?.treatmentPlan}</p>
            {selectedRecord?.followUpDate && (
              <p className="font-bold">Hẹn tái khám ngày: {selectedRecord?.followUpDate}</p>
            )}
          </div>

          <div className="flex justify-between pt-8 text-center text-xs">
            <div>
              <p className="font-bold">Bệnh nhân / Người nhà</p>
              <p className="text-slate-400 text-[10px] italic mt-8">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold">Bác sĩ khám bệnh</p>
              <p className="text-blue-700 font-semibold mt-8">{selectedRecord?.doctorName}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

