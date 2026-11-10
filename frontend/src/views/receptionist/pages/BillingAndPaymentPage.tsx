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
  Eye,
  FileText,
  Calendar,
} from 'lucide-react';
import { Topbar } from '../../../components/shared/Topbar';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { useClinicStore } from '../../../mock/clinicStore';
import type { Invoice, PaymentMethod } from '../../../types/clinic';
import {
  INVOICE_STATUS_MAP,
  PAYMENT_METHOD_MAP,
} from '../../../types/database';

export const BillingAndPaymentPage: React.FC = () => {
  const store = useClinicStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNPAID' | 'PARTIAL' | 'PAID'>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Modal Create Invoice
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedReceptionId, setSelectedReceptionId] = useState('');
  const [createDiscount, setCreateDiscount] = useState<number>(0);

  // Modal Record Payment
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Modal Details & Print Preview
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const filteredInvoices = store.invoices.filter((inv) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      inv.invoiceCode.toLowerCase().includes(q) ||
      (inv.patientName || '').toLowerCase().includes(q) ||
      (inv.phoneNumber && inv.phoneNumber.includes(q));

    const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleOpenCreateInvoice = () => {
    // Pick first reception without invoice
    const pendingRec = store.receptions.find(
      (r) => !store.invoices.some((inv) => inv.receptionId === r.id)
    ) || store.receptions[0];

    setSelectedReceptionId(pendingRec?.id || '');
    setCreateDiscount(0);
    setIsCreateOpen(true);
  };

  const handleConfirmCreateInvoice = () => {
    if (!selectedReceptionId) {
      alert('Vui lòng chọn lượt tiếp nhận khám.');
      return;
    }

    store.createInvoice(selectedReceptionId, '3', Number(createDiscount));
    setIsCreateOpen(false);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.remainingAmount || (inv.totalAmount - (inv.paidAmount || 0)));
    setPaymentMethod('BANK_TRANSFER');
    setTransactionCode(`TXN${Date.now().toString().slice(-6)}`);
    setPaymentNotes('Thanh toán viện phí qua VietQR');
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    if (paymentAmount <= 0) {
      alert('Số tiền thanh toán phải lớn hơn 0.');
      return;
    }

    store.recordPayment({
      invoiceId: selectedInvoice.id,
      amount: Number(paymentAmount),
      paymentMethod,
      transactionCode: paymentMethod === 'BANK_TRANSFER' ? transactionCode : undefined,
      receivedByStaffId: '3', // Lễ tân Hoàng Thu Trang
      notes: paymentNotes || undefined,
    });

    setIsPaymentOpen(false);
    // Refresh selected invoice
    const updated = store.invoices.find((i) => i.id === selectedInvoice.id);
    setSelectedInvoice(updated || null);
    setIsPrintModalOpen(true);
  };

  const handleOpenDetail = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsDetailOpen(true);
  };

  const handleOpenPrint = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Hóa đơn và thanh toán"
        subtitle="Theo dõi chi phí khám, tiền thuốc và các khoản đã thu."
        actions={
          <Button size="sm" onClick={handleOpenCreateInvoice} leftIcon={<Plus className="h-4 w-4" />}>
            Lập hóa đơn
          </Button>
        }
      />

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'ALL', label: 'Tất cả hóa đơn', count: store.invoices.length },
            {
              key: 'UNPAID',
              label: 'Chưa thanh toán',
              count: store.invoices.filter((i) => i.status === 'UNPAID').length,
            },
            {
              key: 'PARTIAL',
              label: 'Thanh toán một phần',
              count: store.invoices.filter((i) => i.status === 'PARTIAL').length,
            },
            {
              key: 'PAID',
              label: 'Đã hoàn tất',
              count: store.invoices.filter((i) => i.status === 'PAID').length,
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
            placeholder="Tìm hóa đơn, bệnh nhân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Invoices List */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã Hóa Đơn</th>
                <th className="py-3 px-4">Bệnh nhân & SĐT</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Tổng chi phí</th>
                <th className="py-3 px-4 text-right">Giảm giá</th>
                <th className="py-3 px-4 text-right font-extrabold text-blue-700">Số tiền phải thu</th>
                <th className="py-3 px-4 text-right">Đã thu / Còn nợ</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Không tìm thấy hóa đơn viện phí nào.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {inv.invoiceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{inv.patientName || 'Chưa có thông tin'}</span>
                      <span className="text-[11px] text-slate-400">{inv.phoneNumber || 'Chưa cập nhật'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {inv.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-800">
                      {inv.subtotal.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-600">
                      {inv.discount > 0 ? `-${inv.discount.toLocaleString('vi-VN')} ₫` : '0 ₫'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-sm text-blue-800">
                      {inv.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-emerald-700 block">
                        {(inv.paidAmount || 0).toLocaleString('vi-VN')} ₫
                      </span>
                      {(inv.remainingAmount || 0) > 0 && (
                        <span className="text-[10px] text-rose-600 font-semibold">
                          Còn nợ: {(inv.remainingAmount || 0).toLocaleString('vi-VN')} ₫
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge type="invoice" status={inv.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenDetail(inv)}
                          leftIcon={<Eye className="h-3.5 w-3.5" />}
                          title="Xem chi tiết các khoản thu"
                        >
                          Chi tiết
                        </Button>

                        {inv.status !== 'PAID' && inv.status !== 'CANCELLED' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleOpenPayment(inv)}
                            leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                          >
                            Thu tiền
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPrint(inv)}
                          leftIcon={<Printer className="h-3.5 w-3.5" />}
                        >
                          In phiếu
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notice about Billing & Payment Policy */}
      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          Quy định thanh toán & Xuất hóa đơn:
        </p>
        <p className="text-blue-800 leading-relaxed">
          Số tiền phải thu được hệ thống tự động tính toán dựa trên tổng chi phí dịch vụ thực hiện và các khoản thuốc đã phát, trừ đi số tiền miễn giảm (nếu có). Nhân viên thu ngân kiểm tra kỹ số tiền trước khi xác nhận biên lai.
        </p>
      </div>

      {/* MODAL: Create Invoice */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Lập Hóa Đơn Viện Phí"
        subtitle="Hệ thống tự động gom các dịch vụ khám lâm sàng và các khoản phát thuốc"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmCreateInvoice} variant="primary">
              Tạo hóa đơn viện phí
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Select
            label="Chọn lượt tiếp nhận cần kết toán viện phí"
            value={selectedReceptionId}
            onChange={(e) => setSelectedReceptionId(e.target.value)}
            options={store.receptions.map((r) => ({
              value: r.id,
              label: `${r.receptionCode} - ${r.patientName} (${r.receptionType === 'APPOINTMENT' ? 'Có hẹn' : 'Trực tiếp'})`,
            }))}
          />

          <Input
            label="Chiết khấu / Miễn giảm viện phí (₫)"
            type="number"
            value={createDiscount}
            onChange={(e) => setCreateDiscount(Number(e.target.value))}
            min={0}
            helperText="Nhập 0 nếu không áp dụng chính sách miễn giảm"
          />

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
            Hóa đơn sau khi lập sẽ tự động tổng hợp tất cả các dịch vụ khám thực hiện và các khoản thuốc phát thành danh sách chi tiết.
          </div>
        </div>
      </Modal>

      {/* MODAL: Record Payment */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Thu Tiền & Ghi Nhận Thanh Toán"
        subtitle={selectedInvoice ? `Hóa đơn: ${selectedInvoice.invoiceCode} • Người bệnh: ${selectedInvoice.patientName || 'Chưa có thông tin'}` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmPayment} variant="success" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
              Xác nhận thu tiền
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-slate-700">
          {/* Balance Overview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block">Tổng tiền HĐ:</span>
              <span className="font-bold text-slate-900">
                {selectedInvoice?.totalAmount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Đã thanh toán:</span>
              <span className="font-bold text-emerald-700">
                {((selectedInvoice?.paidAmount) || 0).toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Còn phải thu:</span>
              <span className="font-extrabold text-blue-700">
                {((selectedInvoice?.remainingAmount) || 0).toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Số tiền thực thu lần này (₫) *"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              min={1}
              required
            />
            <Select
              label="Phương thức thanh toán *"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              options={[
                { value: 'BANK_TRANSFER', label: 'Chuyển khoản / VietQR' },
                { value: 'CASH', label: 'Tiền mặt tại quầy' },
              ]}
            />
          </div>

          {paymentMethod === 'BANK_TRANSFER' && (
            <Input
              label="Mã giao dịch ngân hàng / Ref Code"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              placeholder="FT24..."
            />
          )}

          <Input
            label="Ghi chú thanh toán"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            placeholder="Thanh toán viện phí đầy đủ..."
          />
        </div>
      </Modal>

      {/* MODAL: View Invoice Details */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi Tiết Hóa Đơn & Lịch Sử Giao Dịch"
        subtitle={selectedInvoice ? `Hóa đơn: ${selectedInvoice.invoiceCode} • Bệnh nhân: ${selectedInvoice.patientName || 'Chưa có thông tin'}` : ''}
        maxWidth="2xl"
        footer={
          <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
            Đóng
          </Button>
        }
      >
        {selectedInvoice && (
          <div className="space-y-5 text-xs text-slate-700">
            {/* Invoice Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Chi tiết các khoản mục chi phí:
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Khoản mục</th>
                      <th className="py-2.5 px-3">Phân loại</th>
                      <th className="py-2.5 px-3 text-center">Số lượng</th>
                      <th className="py-2.5 px-3 text-right">Đơn giá</th>
                      <th className="py-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.description}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.itemType === 'SERVICE'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {item.itemType === 'SERVICE' ? 'Dịch vụ' : 'Thuốc'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {item.unitPrice.toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {item.totalPrice.toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments History Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Lịch sử các lần thanh toán:
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Mã GD</th>
                      <th className="py-2.5 px-3">Hình thức</th>
                      <th className="py-2.5 px-3 text-right">Số tiền</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Nhân viên thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!selectedInvoice.payments || selectedInvoice.payments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-400">
                          Chưa có giao dịch thanh toán nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      selectedInvoice.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                            {p.paymentCode}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {PAYMENT_METHOD_MAP[p.paymentMethod]}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                            {p.amount.toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {p.paidAt}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {p.receivedByStaffName}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: Printable Receipt */}
      <Modal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title="Biên Lai Thu Tiền Viện Phí"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsPrintModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" />}>
              In biên lai
            </Button>
          </>
        }
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs font-sans p-2">
            <div className="text-center border-b border-slate-200 pb-3 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase">
                Phòng Khám Chuyên Khoa Tai Mũi Họng
              </h3>
              <p className="text-[11px] text-slate-500">33 Đ. Bùi Thế Đạt, Vinh Phú, Nghệ An • Hotline: 1900 8899</p>
              <h4 className="font-bold text-base text-blue-800 pt-2">HÓA ĐƠN THU TIỀN VIỆN PHÍ</h4>
              <p className="text-[11px] font-mono text-slate-400">Mã HĐ: {selectedInvoice.invoiceCode}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <p><strong>Người nộp tiền:</strong> {selectedInvoice.patientName || 'Chưa có thông tin'}</p>
              <p><strong>Số điện thoại:</strong> {selectedInvoice.phoneNumber || 'Chưa cập nhật'}</p>
              <p><strong>Thu ngân lập phiếu:</strong> {selectedInvoice.createdByStaffName}</p>
              <p><strong>Ngày lập:</strong> {selectedInvoice.createdAt}</p>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 mt-2">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-2">Nội dung chi phí</th>
                  <th className="p-2 text-center">SL</th>
                  <th className="p-2 text-right">Đơn giá</th>
                  <th className="p-2 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium">{item.description}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                    <td className="p-2 text-right font-bold">{item.totalPrice.toLocaleString('vi-VN')} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1 text-right text-xs pt-2 border-t border-slate-200">
              <p>Cộng tiền viện phí: <strong>{selectedInvoice.subtotal.toLocaleString('vi-VN')} ₫</strong></p>
              <p>Miễn giảm / Chiết khấu: <strong>-{selectedInvoice.discount.toLocaleString('vi-VN')} ₫</strong></p>
              <p className="text-sm font-extrabold text-blue-900 pt-1">
                Tổng cộng thanh toán: {selectedInvoice.totalAmount.toLocaleString('vi-VN')} ₫
              </p>
              <p className="text-xs font-bold text-emerald-800">
                Số tiền đã thu: {(selectedInvoice.paidAmount || 0).toLocaleString('vi-VN')} ₫
              </p>
            </div>

            <div className="flex justify-between pt-6 text-center text-xs">
              <div>
                <p className="font-bold">Người nộp tiền</p>
                <p className="text-slate-400 text-[10px] italic mt-8">(Ký và ghi rõ họ tên)</p>
              </div>
              <div>
                <p className="font-bold">Thu ngân viện phí</p>
                <p className="text-blue-700 font-semibold mt-8">{selectedInvoice.createdByStaffName}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};