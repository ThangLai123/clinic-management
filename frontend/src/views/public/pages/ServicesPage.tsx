import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Activity, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface ServiceItem {
  id: string;
  name: string;
  category: 'KHAM_SOI' | 'THU_THUAT' | 'NHI_KHOA' | 'THINH_LUC';
  price: number;
  duration: string;
  description: string;
  indications: string[];
}

export const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const services: ServiceItem[] = [
    {
      id: 'DV-01',
      name: 'Khám chuyên khoa Tai Mũi Họng tổng quát',
      category: 'KHAM_SOI',
      price: 150000,
      duration: '15 - 20 phút',
      description: 'Bác sĩ chuyên khoa thăm khám lâm sàng tỉ mỉ vùng tai, mũi, họng, tư vấn phác đồ điều trị và kê đơn thuốc.',
      indications: ['Đau họng, ho kéo dài', 'Nghẹt mũi, sổ mũi', 'Ù tai, đau tai'],
    },
    {
      id: 'DV-02',
      name: 'Nội soi Tai Mũi Họng ống mềm NBI không đau',
      category: 'KHAM_SOI',
      price: 250000,
      duration: '10 - 15 phút',
      description: 'Sử dụng dây soi mềm siêu nhỏ đường kính 2.8mm, tích hợp ánh sáng dải tần hẹp NBI phát hiện sớm tổn thương niêm mạc và khối u vòm họng.',
      indications: ['Khàn tiếng trên 2 tuần', 'Nuốt vướng, nghẹn', 'Nghi ngờ ung thư vòm mũi họng'],
    },
    {
      id: 'DV-03',
      name: 'Đo Thính Lực Đồ & Nhĩ Lượng Chuyên Sâu',
      category: 'THINH_LUC',
      price: 200000,
      duration: '20 - 30 phút',
      description: 'Đánh giá chính xác ngưỡng nghe của từng tai, kiểm tra độ đàn hồi màng nhĩ và áp lực hòm nhĩ trong phòng cách âm tiêu chuẩn.',
      indications: ['Giảm sức nghe đột ngột hoặc từ từ', 'Ù tai tiếng ve kêu, tiếng nước chảy', 'Viêm tai thanh dịch'],
    },
    {
      id: 'DV-04',
      name: 'Lấy dị vật Tai / Mũi / Họng kỹ thuật cao',
      category: 'THU_THUAT',
      price: 180000,
      duration: '10 - 20 phút',
      description: 'Gắp dị vật xương cá họng, hạt dị vật mũi hoặc côn trùng chui vào tai dưới hướng dẫn của kính soi phóng đại, hạn chế trầy xước niêm mạc.',
      indications: ['Hóc xương cá', 'Trẻ nhét hạt vào mũi', 'Côn trùng bay vào tai'],
    },
    {
      id: 'DV-05',
      name: 'Hút rửa xoang & Làm sạch hốc mũi dưới áp lực dương',
      category: 'THU_THUAT',
      price: 120000,
      duration: '15 phút',
      description: 'Phương pháp Proetz đưa dung dịch kháng viêm vào các xoang cạnh mũi, hút sạch dịch mủ ứ đọng, giải phóng đường thở tức thì.',
      indications: ['Viêm xoang cấp, mạn tính', 'Xoang hàm ứ dịch', 'Nghẹt mũi đặc đờm xanh'],
    },
    {
      id: 'DV-06',
      name: 'Khám & Nội soi VA, Amidan cho trẻ em',
      category: 'NHI_KHOA',
      price: 250000,
      duration: '15 - 20 phút',
      description: 'Bác sĩ nhi khoa khám nhẹ nhàng, nội soi ống mềm không gây sợ hãi, đánh giá chính xác độ quá phát của VA gây ngủ ngáy.',
      indications: ['Bé ngủ ngáy, thở bằng miệng', 'Thường xuyên viêm mũi họng tái phát', 'Chậm lớn do thiếu oxy khi ngủ'],
    },
  ];

  const filtered = services.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Danh mục dịch vụ y tế</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Bảng giá dịch vụ Tai Mũi Họng</h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Bảng giá niêm yết công khai, minh bạch theo quy định của Sở Y Tế. Mọi chỉ định thăm khám, nội soi và thủ thuật đều được Bác sĩ giải thích rõ ràng trước khi thực hiện.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Tất cả dịch vụ' },
            { id: 'KHAM_SOI', label: 'Khám & Nội soi NBI' },
            { id: 'THINH_LUC', label: 'Đo thính lực' },
            { id: 'THU_THUAT', label: 'Thủ thuật TMH' },
            { id: 'NHI_KHOA', label: 'TMH Trẻ em' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm dịch vụ hoặc triệu chứng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <Card key={service.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {service.id}
                </span>
                <span className="text-base font-extrabold text-blue-700">
                  {service.price.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{service.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Thời gian thực hiện: {service.duration}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-700">Chỉ định phù hợp khi:</p>
                <ul className="space-y-1">
                  {service.indications.map((ind, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                      <Check className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Link to="/appointments/new" className="block w-full">
                <Button className="w-full justify-center text-xs" leftIcon={<Calendar className="h-4 w-4" />}>
                  Đặt lịch khám dịch vụ này
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

