import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Search,
  CheckCircle2,
  Stethoscope,
  Activity,
  Award,
  Users,
  AlertTriangle,
  ArrowRight,
  Ear,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export const HomePage: React.FC = () => {
  const services = [
    {
      title: 'Nội Soi Tai Mũi Họng Ống Mềm NBI',
      desc: 'Công nghệ dải tần ánh sáng hẹp NBI giúp tầm soát ung thư sớm vòm họng, thanh quản, không đau, không kích ứng.',
      icon: Activity,
      tag: 'Kỹ thuật cao',
    },
    {
      title: 'Điều Trị Viêm Mũi Xoang & Dị Ứng',
      desc: 'Phác đồ điều trị viêm xoang cấp, mạn tính, polyp mũi, xịt mũi rửa xoang áp lực dương bằng dung dịch chuẩn.',
      icon: Sparkles,
      tag: 'Phổ biến',
    },
    {
      title: 'Bệnh Lý Tai & Đo Thính Lực Đồ',
      desc: 'Khám viêm tai giữa, thủng màng nhĩ, hút dịch tai, đo sức nghe thính lực đồ và nhĩ lượng chính xác.',
      icon: Ear,
      tag: 'Chuyên sâu',
    },
    {
      title: 'Khám Amidan & VA Trẻ Em',
      desc: 'Chẩn đoán viêm amidan hốc mủ, phì đại VA gây ngủ ngáy, nghẹt mũi ở trẻ nhỏ với phương pháp nhẹ nhàng.',
      icon: Stethoscope,
      tag: 'Nhi khoa',
    },
  ];

  const doctors = [
    {
      name: 'TS.BS Trần Quốc Hưng',
      title: 'Giám đốc chuyên môn',
      exp: '25 năm kinh nghiệm',
      spec: 'Chuyên gia đầu ngành Phẫu thuật Tai Mũi Họng & Nạo VA Coblation',
    },
    {
      name: 'BS.CKI Lê Hoàng Nam',
      title: 'Bác sĩ phụ trách Khám 1',
      exp: '14 năm kinh nghiệm',
      spec: 'Nội soi chẩn đoán sớm Tai Mũi Họng & Viêm xoang mạn tính',
    },
    {
      name: 'ThS.BS Vũ Minh Trang',
      title: 'Bác sĩ phụ trách Khám Nhi',
      exp: '10 năm kinh nghiệm',
      spec: 'Tai Mũi Họng Nhi, dị ứng đường hô hấp trên và viêm tai thanh dịch',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-[#F7F8FA] border-b border-slate-200/60 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
                <Award className="h-4 w-4 text-blue-700" />
                <span>Phòng khám Chuyên khoa Tai Mũi Họng Tiêu chuẩn Quốc gia</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Chăm sóc Tai Mũi Họng tận tâm với{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-600">
                  công nghệ nội soi NBI
                </span>{' '}
                hiện đại
              </h1>
              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Hệ thống đặt lịch khám trực tuyến nhanh chóng, tra cứu hồ sơ bệnh án qua OTP bảo mật, đội ngũ Bác sĩ chuyên khoa giàu kinh nghiệm và phác đồ điều trị chuẩn y khoa.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/appointments/new">
                  <Button size="lg" className="shadow-md shadow-blue-600/20" leftIcon={<Calendar className="h-5 w-5" />}>
                    Đặt lịch khám ngay (UC-01)
                  </Button>
                </Link>
                <Link to="/medical-history">
                  <Button variant="outline" size="lg" leftIcon={<Search className="h-5 w-5 text-blue-600" />}>
                    Tra cứu lịch sử khám bệnh (UC-02)
                  </Button>
                </Link>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
                <div>
                  <p className="text-2xl font-black text-blue-700">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Bác sĩ chuyên khoa</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-teal-600">15 Phút</p>
                  <p className="text-xs text-slate-500 font-medium">Thời gian chờ tối ưu</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">50.000+</p>
                  <p className="text-xs text-slate-500 font-medium">Bệnh nhân tin cậy</p>
                </div>
              </div>
            </div>

            {/* Quick Card Right */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">Đặt lịch khám nhanh</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Mở tiếp nhận hôm nay
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-3 p-3 bg-blue-50/60 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Không cần xếp hàng lấy số sớm — được ưu tiên vào buồng khám đúng khung giờ đã chọn.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-teal-50/60 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>Nội soi ống mềm không gây đau rát, an toàn tuyệt đối cho cả người lớn và trẻ nhỏ.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckCircle2 className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>Nhận kết quả và đơn thuốc điện tử qua tin nhắn bảo mật sau khi khám hoàn tất.</span>
                  </div>
                </div>

                <Link to="/appointments/new" className="block w-full">
                  <Button className="w-full justify-center" size="lg">
                    Tiến hành đặt lịch khám trực tuyến
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice Warning */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3.5 text-rose-900">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Lưu ý an toàn y tế & xử trí trường hợp cấp cứu:</p>
            <p className="text-rose-700 leading-relaxed">
              Biểu mẫu đặt lịch trực tuyến chỉ áp dụng cho khám chữa bệnh ngoại trú thông thường. Nếu bạn hoặc người thân xuất hiện các triệu chứng cấp cứu như: <strong>khó thở thanh quản co kéo, hóc dị vật sắc nhọn hoặc pin cúc áo, chảy máu mũi dữ dội không cầm, đau sưng cổ lan nhanh</strong>, vui lòng đến ngay phòng Cấp cứu bệnh viện gần nhất hoặc liên hệ Tổng đài cấp cứu <strong>115</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Chuyên khoa mũi nhọn</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Dịch vụ khám & điều trị Tai Mũi Họng</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
            Xem toàn bộ bảng giá dịch vụ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, index) => (
            <Card key={index} className="hover:border-blue-300 transition-all hover:shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to="/appointments/new" className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                  Đặt lịch dịch vụ này <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Doctor Team */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Đội ngũ chuyên gia</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Bác sĩ Chuyên khoa Tai Mũi Họng giàu kinh nghiệm</h2>
            <p className="text-xs text-slate-500">Trực tiếp thăm khám, nội soi và đồng hành suốt quá trình điều trị của bệnh nhân.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doc, idx) => (
              <div key={idx} className="bg-[#F7F8FA] rounded-2xl border border-slate-200/80 p-6 space-y-4 hover:shadow-sm transition-all">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-600/10">
                  {doc.name.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs font-semibold text-blue-700">{doc.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{doc.exp}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                  {doc.spec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl text-white p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Thời gian phục vụ</span>
              <h2 className="text-2xl sm:text-3xl font-black">Khám chữa bệnh cả ngoài giờ & cuối tuần</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Để thuận tiện cho người đi làm và học sinh, phòng khám mở cửa liên tục từ Thứ 2 đến Chủ Nhật. Khám theo lịch hẹn giúp bạn chủ động thời gian và không phải chờ đợi.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" /> Thứ Hai - Thứ Bảy: <strong>07:30 - 20:00</strong>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" /> Chủ Nhật & Ngày Lễ: <strong>08:00 - 17:00</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
              <Link to="/appointments/new">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold border-none shadow-lg">
                  Đặt hẹn trực tuyến ngay
                </Button>
              </Link>
              <a href="tel:19008899">
                <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Gọi tư vấn: 1900 8899
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
