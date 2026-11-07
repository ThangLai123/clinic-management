import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Invoice, PaymentMethod, InvoiceItem } from '../../../types/clinic';

export const BillingAndPaymentPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Modal Create Invoice
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReceptionId, setSelectedReceptionId] = useState('');
  const [examFee, setExamFee] = useState(150000);
  const [endoscopyFee, setEndoscopyFee] = useState(250000);
  const [medicineFee, setMedicineFee] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Modal Payment
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CHUYEN_KHOAN_QR');
  const [paidInput, setPaidInput] = useState<number>(0);

  // Modal Print Preview
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredInvoices = store.invoices.filter((inv) => {
    return (
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.phoneNumber.includes(searchTerm)
    );
  });

  const handleOpenCreateInvoice = () => {
    // Pick first reception waiting for billing
    const pendingRec = store.receptions.find(
      (r) => r.status === 'CHO_THANH_TOAN' || r.status === 'CHO_PHAT_THUOC'
    );
    if (pendingRec) {
      setSelectedReceptionId(pendingRec.id);
      // Auto calculate medicine fee if rx exists
      const rx = store.prescriptions.find((p) => p.receptionId === pendingRec.id);
      if (rx) {
        let sum = 0;
        rx.items.forEach((item) => {
          const med = store.medicines.find((m) => m.id === item.medicineId);
          sum += (med ? med.retailPrice : 20000) * item.quantity;
        });
        setMedicineFee(sum);
      } else {
        setMedicineFee(180000);
      }
    } else {
      setSelectedReceptionId(store.receptions[0]?.id || '');
      setMedicineFee(150000);
    }
    setExamFee(150000);
    setEndoscopyFee(250000);
    setDiscount(0);
    setIsCreateOpen(true);
  };

  const handleConfirmCreateInvoice = () => {
    const rec = store.receptions.find((r) => r.id === selectedReceptionId);
    if (!rec) return;

    const sub = examFee + endoscopyFee + medicineFee;
    const total = Math.max(0, sub - discount);

    const items: InvoiceItem[] = [
      {
        id: 'I-1',
        category: 'KHAM_BENH',
        description: 'Khám chuyên khoa Tai Mũi Họng',
        quantity: 1,
        unitPrice: examFee,
        totalPrice: examFee,
      },
      {
        id: 'I-2',
        category: 'NOI_SOI',
        description: 'Nội soi Tai Mũi Họng ống mềm NBI',
        quantity: 1,
        unitPrice: endoscopyFee,
        totalPrice: endoscopyFee,
      },
    ];

    if (medicineFee > 0) {
      items.push({
        id: 'I-3',
        category: 'THUOC',
        description: 'Thuốc điều trị theo đơn bác sĩ',
        quantity: 1,
        unitPrice: medicineFee,
        totalPrice: medicineFee,
      });
    }

    const newInv = store.addInvoice({
      receptionId: rec.id,
      patientId: rec.patientId,
      patientName: rec.patientName,
      phoneNumber: rec.phoneNumber,
      items,
      subtotal: sub,
      discount,
      totalAmount: total,
      paidAmount: 0,
      changeAmount: 0,
      paymentMethod: 'TIEN_MAT',
      status: 'CHO_THANH_TOAN',
      cashierName: 'Thu ngân Hoàng Thu Trang',
    });

    setIsCreateOpen(false);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaidInput(inv.totalAmount);
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    store.recordPayment(selectedInvoice.id, paymentMethod, paidInput);
    setIsPaymentOpen(false);
    // Refresh selected
    const updated = store.invoices.find((i) => i.id === selectedInvoice.id);
    setSelectedInvoice(updated || null);
    setIsPrintModalOpen(true);
  };

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Quản Lý Hóa Đơn & Thu Ngân Viện Phí"
        subtitle="Use Case 09: Tổng hợp chi phí khám, nội soi, thủ thuật, thuốc điều trị và ghi nhận giao dịch thanh toán."
        actions={
          <Button onClick={handleOpenCreateInvoice} leftIcon={<Plus className="h-4 w-4" />}>
            Lập hóa đơn mới
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          Tổng số hóa đơn: <strong className="text-slate-800">{store.invoices.length} chứng từ</strong>{' '}
          (Chờ thu: <strong className="text-amber-700">{store.invoices.filter((i) => i.status === 'CHO_THANH_TOAN').length}</strong>)
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo Mã HĐ, tên người bệnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Invoices List */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã Hóa Đơn</th>
                <th className="py-3 px-4">Bệnh nhân & SĐT</th>
                <th className="py-3 px-4">Ngày lập</th>
                <th className="py-3 px-4 text-right">Tổng chi phí (đ)</th>
                <th className="py-3 px-4 text-right">Miễn giảm (đ)</th>
                <th className="py-3 px-4 text-right font-extrabold text-blue-700">Cần thanh toán (đ)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{inv.patientName}</span>
                      <span className="text-[11px] text-slate-400">{inv.phoneNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {inv.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      {inv.subtotal.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-600">
                      {inv.discount > 0 ? `-${inv.discount.toLocaleString('vi-VN')}` : '0'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-sm text-blue-800">
                      {inv.totalAmount.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="invoice" value={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.status === 'CHO_THANH_TOAN' ? (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleOpenPayment(inv)}
                            leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                          >
                            Thu tiền
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenPrint(inv)}
                            leftIcon={<Printer className="h-3.5 w-3.5" />}
                          >
                            In biên lai
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Create Invoice */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Lập Hóa Đơn Thu Viện Phí Mới"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmCreateInvoice} variant="primary">
              Tạo phiếu hóa đơn
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Select
            label="Chọn lượt tiếp nhận cần thanh toán"
            value={selectedReceptionId}
            onChange={(e) => setSelectedReceptionId(e.target.value)}
            options={store.receptions.map((r) => ({
              value: r.id,
              label: `${r.id} - ${r.patientName} (${r.status})`,
            }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tiền khám chuyên khoa TMH (đ)"
              type="number"
              value={examFee}
              onChange={(e) => setExamFee(Number(e.target.value))}
            />
            <Input
              label="Tiền nội soi NBI / thủ thuật (đ)"
              type="number"
              value={endoscopyFee}
              onChange={(e) => setEndoscopyFee(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tiền thuốc theo đơn (đ)"
              type="number"
              value={medicineFee}
              onChange={(e) => setMedicineFee(Number(e.target.value))}
            />
            <Input
              label="Giảm giá / Ưu đãi BHYT (đ)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between font-bold text-sm text-blue-900">
            <span>Tổng số tiền người bệnh cần thanh toán:</span>
            <span>{(examFee + endoscopyFee + medicineFee - discount).toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </Modal>

      {/* MODAL: Process Payment */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Ghi Nhận Giao Dịch Thanh Toán"
        subtitle={selectedInvoice ? `Hóa đơn: ${selectedInvoice.id} - Bệnh nhân: ${selectedInvoice.patientName}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmPayment} variant="success" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Xác nhận đã nhận tiền & Xuất hóa đơn
            </Button>
          </>
        }
      >
        <div className="space-y-5 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-slate-500">Số tiền cần thu:</span>
            <p className="text-2xl font-black text-blue-800">
              {selectedInvoice?.totalAmount.toLocaleString('vi-VN')} đ
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs block">Phương thức thanh toán:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'TIEN_MAT', label: 'Tiền mặt', icon: Banknote },
                { id: 'CHUYEN_KHOAN_QR', label: 'Chuyển khoản QR', icon: QrCode },
                { id: 'THE_POS', label: 'Thẻ POS ngân hàng', icon: CreditCard },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'border-blue-700 bg-blue-50 text-blue-800 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <m.icon className="h-5 w-5" />
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'CHUYEN_KHOAN_QR' && (
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-center space-y-2">
              <div className="w-32 h-32 bg-white border border-teal-300 rounded-lg mx-auto flex items-center justify-center text-teal-800 font-mono text-xs shadow-xs">
                [ QR VietQR Demo ]
              </div>
              <p className="text-[11px] text-teal-800">
                Quét mã QR thanh toán vào tài khoản Phòng khám: <strong>Ngân hàng Vietcombank - 1900889988</strong>
              </p>
            </div>
          )}

          <Input
            label="Số tiền người bệnh thực trả (đ)"
            type="number"
            value={paidInput}
            onChange={(e) => setPaidInput(Number(e.target.value))}
          />

          {paidInput > (selectedInvoice?.totalAmount || 0) && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold flex justify-between">
              <span>Tiền thừa trả lại bệnh nhân:</span>
              <span>{(paidInput - (selectedInvoice?.totalAmount || 0)).toLocaleString('vi-VN')} đ</span>
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL: Print Invoice */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Biên Lai Thu Tiền Viện Phí & Hóa Đơn Dịch Vụ"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              In hóa đơn
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs font-sans p-2">
          <div className="text-center border-b border-slate-200 pb-3 space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase">
              Phòng Khám Chuyên Khoa Tai Mũi Họng
            </h3>
            <p className="text-[11px] text-slate-500">125 Giải Phóng, Q. Đống Đa, Hà Nội • MST: 0108998899</p>
            <h4 className="font-black text-base text-blue-900 pt-2">HÓA ĐƠN THU TIỀN DỊCH VỤ</h4>
            <p className="text-[11px] font-mono text-slate-400">Số HĐ: {selectedInvoice?.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-slate-700">
            <p><strong>Người bệnh:</strong> {selectedInvoice?.patientName}</p>
            <p><strong>Số điện thoại:</strong> {selectedInvoice?.phoneNumber}</p>
            <p><strong>Mã lượt khám:</strong> {selectedInvoice?.receptionId}</p>
            <p><strong>Ngày giờ thu:</strong> {selectedInvoice?.createdAt}</p>
            <p className="col-span-2">
              <strong>Hình thức thanh toán:</strong> {selectedInvoice?.paymentMethod}
            </p>
          </div>

          <table className="w-full text-left text-xs border border-slate-200 mt-2">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-2">Khoản mục chi phí</th>
                <th className="p-2 text-center">SL</th>
                <th className="p-2 text-right">Đơn giá (đ)</th>
                <th className="p-2 text-right">Thành tiền (đ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedInvoice?.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-medium">{it.description}</td>
                  <td className="p-2 text-center">{it.quantity}</td>
                  <td className="p-2 text-right">{it.unitPrice.toLocaleString('vi-VN')}</td>
                  <td className="p-2 text-right font-semibold">{it.totalPrice.toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1.5 border-t border-slate-200 pt-2 text-right">
            <p className="text-slate-500">Tổng cộng chi phí: <strong>{selectedInvoice?.subtotal.toLocaleString('vi-VN')} đ</strong></p>
            {selectedInvoice && selectedInvoice.discount > 0 && (
              <p className="text-rose-600">Giảm giá: <strong>-{selectedInvoice.discount.toLocaleString('vi-VN')} đ</strong></p>
            )}
            <p className="text-sm font-extrabold text-blue-900">
              Số tiền đã thanh toán: {selectedInvoice?.totalAmount.toLocaleString('vi-VN')} đ
            </p>
          </div>

          <div className="flex justify-between pt-6 text-center text-xs">
            <div>
              <p className="font-bold">Người nộp tiền</p>
              <p className="text-slate-400 text-[10px] italic mt-8">(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold">Người thu tiền</p>
              <p className="text-blue-700 font-semibold mt-8">{selectedInvoice?.cashierName}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
