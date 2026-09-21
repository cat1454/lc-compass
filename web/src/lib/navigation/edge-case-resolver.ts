/**
 * Bộ Định Tuyến & Tháo Gỡ 10 Điểm Biên Chê Hệ Thống Thực Tế (Edge Case Resolver)
 * Căn cứ khảo sát thực địa tại Phường Liên Chiểu: KCN Hòa Khánh, các khu xóm trọ công nhân,
 * sinh viên Đại học Bách khoa, và vùng trũng thấp mùa mưa bão.
 */

export type EdgeCaseType =
  | "NO_CONTRACT" // Thuê trọ không có hợp đồng bằng văn bản
  | "OFF_HOURS" // Công nhân làm ca ngoài giờ hành chính
  | "ROOMMATE_SHARING" // Ở ghép không đứng tên hợp đồng
  | "DISASTER_FLOOD" // Bão lũ, ngập lụt cục bộ (đường Mẹ Suốt, KCN)
  | "LOST_IDENTITY" // Mất CCCD / chưa có VNeID mức 2
  | "MOBILITY_SENIOR" // Người già neo đơn / khó đi lại
  | "WARD_ADDRESS_DRIFT" // Lệch thông tin tổ dân phố sau NQ 1659
  | "FEE_WAIVER" // Miễn 100% lệ phí cho hộ nghèo/công nhân
  | "OFFLINE_MODE" // Khu trọ mất mạng/sóng yếu (LC-00008)
  | "REGULATORY_LAG" // Bị đòi sổ hộ khẩu giấy cũ (LC-00005)
  | "SHARED_DEVICE" // Máy tính dùng chung tại điểm công cộng (LC-00041)
  | "THIRD_PARTY_PROXY" // Đi làm thay người thân chưa có ủy quyền (LC-00071)
  | "REJECTED_SUPPLEMENT" // Hồ sơ bị trả về / yêu cầu bổ sung (LC-00091)
  | "OUT_OF_JURISDICTION" // Nhầm địa giới KTX phía Tây, Nam Ô (LC-00003)
  | "CHILD_SCHOOL_ADMISSION" // Con công nhân tạm trú xin học công lập (LC-02001)
  | "MICRO_BUSINESS_STARTUP"; // Thanh niên mở quán ăn sáng xóm trọ (LC-01001)

export interface EdgeCaseGuidance {
  id: string;
  type: EdgeCaseType;
  title: string;
  summary: string;
  solutionSteps: string[];
  legalBasis: string;
  actionContact: {
    label: string;
    phone: string;
    address?: string;
  };
  sampleFormNotice?: string;
}

export interface EdgeCaseResolutionResult {
  hasEdgeCase: boolean;
  matchedCases: EdgeCaseGuidance[];
  primaryCase?: EdgeCaseGuidance;
}

const EDGE_CASES_DATABASE: Array<{
  keywords: string[];
  guidance: EdgeCaseGuidance;
}> = [
  {
    keywords: [
      "không có hợp đồng",
      "chưa có hợp đồng",
      "hợp đồng miệng",
      "chủ trọ không làm hợp đồng",
      "không ký hợp đồng",
      "mất hợp đồng thuê",
      "hết hạn hợp đồng thuê",
    ],
    guidance: {
      id: "edge-no-contract",
      type: "NO_CONTRACT",
      title: "Giải pháp khi thuê trọ không có hợp đồng bằng văn bản",
      summary:
        "Bạn vẫn đăng ký tạm trú hợp pháp được theo Điều 5 Nghị định 62/2021/NĐ-CP bằng văn bản cam đoan và ý kiến đồng ý của chủ trọ.",
      solutionSteps: [
        "Bước 1: Điền Tờ khai thay đổi thông tin cư trú (Mẫu CT01).",
        "Bước 2: Xin chữ ký xác nhận đồng ý cho thuê/ở trọ của chủ nhà trọ tại mục ý kiến chủ hộ.",
        "Bước 3: Nộp kèm bản sao CCCD của chủ nhà trọ tại Bộ phận Một cửa Công an Phường Liên Chiểu.",
        "Trường hợp chủ trọ gây khó khăn: Liên hệ Tổ trưởng Tổ công nhân tự quản số 32 hoặc Chi đoàn thanh niên khu dân cư để được hỗ trợ hòa giải.",
      ],
      legalBasis: "Điều 5 Nghị định số 62/2021/NĐ-CP hướng dẫn Luật Cư trú",
      actionContact: {
        label: "Tổ trưởng Tổ công nhân tự quản khu nhà trọ 32",
        phone: "0905 423 233",
        address: "Khu dân cư Hòa Khánh, phường Liên Chiểu",
      },
      sampleFormNotice: "Có sẵn mẫu Tờ khai CT01 tại sảnh tiếp nhận Công an phường (66 Lạc Long Quân).",
    },
  },
  {
    keywords: [
      "làm ca",
      "làm ca đêm",
      "ngoài giờ",
      "ca kíp",
      "không rảnh giờ hành chính",
      "thứ bảy",
      "chủ nhật",
      "tối thứ 7",
      "tăng ca",
    ],
    guidance: {
      id: "edge-off-hours",
      type: "OFF_HOURS",
      title: "Hướng dẫn nộp hồ sơ dành cho công nhân làm việc theo ca",
      summary:
        "Công nhân làm ca không cần xin nghỉ việc: Thực hiện nộp trực tuyến 24/7 hoặc nhận hỗ trợ tại 'Tối thứ Bảy chuyển đổi số'.",
      solutionSteps: [
        "Cách 1: Nộp hồ sơ trực tuyến bất kỳ lúc nào qua Cổng Dịch vụ công Bộ Công an (dichvucong.bocongan.gov.vn).",
        "Cách 2: Đăng ký nhận kết quả qua dịch vụ bưu chính công ích VNPost chuyển tận phòng trọ (không cần trực tiếp đi lấy).",
        "Cách 3: Đến điểm hỗ trợ số của Đoàn Thanh niên phường vào Tối thứ Bảy (19h00–21h00) tại 68 Lạc Long Quân.",
      ],
      legalBasis: "Quyết định số 06/QĐ-TTg về phát triển ứng dụng dữ liệu dân cư và dịch vụ công trực tuyến",
      actionContact: {
        label: "Đoàn TNCS Hồ Chí Minh Phường Liên Chiểu (Hỗ trợ ngoài giờ)",
        phone: "0905 423 233",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "ở ghép",
      "ở chung phòng",
      "bạn cùng phòng",
      "phòng nhiều người",
      "không đứng tên hợp đồng",
      "ở cùng sinh viên",
    ],
    guidance: {
      id: "edge-roommate-sharing",
      type: "ROOMMATE_SHARING",
      title: "Thủ tục tạm trú dành cho sinh viên / người ở ghép phòng trọ",
      summary:
        "Khi hợp đồng thuê trọ chỉ đứng tên 01 người đại diện, các thành viên ở ghép vẫn đăng ký tạm trú đầy đủ bằng phụ lục.",
      solutionSteps: [
        "Bước 1: Lập Phụ lục bổ sung danh sách thành viên cùng thuê phòng trọ (hoặc ghi rõ tên các thành viên trong hợp đồng).",
        "Bước 2: Có xác nhận đồng ý của chủ nhà trọ cho phép các cá nhân cư trú tại địa chỉ đó.",
        "Bước 3: Mỗi người làm một Tờ khai CT01 cá nhân nộp kèm bản chụp/bản sao CCCD và Hợp đồng chính.",
      ],
      legalBasis: "Khoản 1 Điều 28 Luật Cư trú năm 2020",
      actionContact: {
        label: "Công an Phường Liên Chiểu (Bộ phận Cư trú)",
        phone: "0236 3842 113",
        address: "66 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "mất cccd",
      "mất căn cước",
      "chưa có cccd",
      "cmnd 9 số",
      "chưa có vneid mức 2",
      "quên mật khẩu vneid",
      "khóa tài khoản vneid",
    ],
    guidance: {
      id: "edge-lost-identity",
      type: "LOST_IDENTITY",
      title: "Phương án thay thế khi mất Căn cước hoặc chưa kích hoạt VNeID",
      summary:
        "Trong thời gian chờ cấp lại Căn cước, bạn được sử dụng Giấy xác nhận thông tin cư trú (CT07) để chứng minh nhân thân.",
      solutionSteps: [
        "Bước 1: Đến Công an Phường Liên Chiểu đề nghị cấp Giấy xác nhận thông tin cư trú (Mẫu CT07).",
        "Bước 2: Làm thủ tục cấp đổi/cấp lại Thẻ căn cước mới theo Luật Căn cước 2023.",
        "Bước 3: Kích hoạt tài khoản định danh điện tử VNeID Mức 2 miễn phí tại quầy Một cửa Công an.",
      ],
      legalBasis: "Luật Căn cước số 26/2023/QH15 và Thông tư 116/2026/TT-BCA",
      actionContact: {
        label: "Tổ Cấp Căn cước & Định danh điện tử - CAP Liên Chiểu",
        phone: "0236 3842 113",
        address: "66 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "ngập lụt",
      "ngập nước",
      "ngập đường",
      "bão",
      "sơ tán",
      "tránh bão",
      "cứu hộ bão lũ",
      "nước dâng",
      "đường mẹ suốt",
    ],
    guidance: {
      id: "edge-disaster-flood",
      type: "DISASTER_FLOOD",
      title: "CẢNH BÁO THIÊN TAI: Điểm sơ tán bão & Cứu nạn khẩn cấp Phường Liên Chiểu",
      summary:
        "Các thủ tục hành chính tạm hoãn. Ưu tiên bảo toàn tính mạng: Di chuyển ngay đến các điểm tránh bão kiên cố của phường.",
      solutionSteps: [
        "Điểm sơ tán 1: Trường THPT Nguyễn Trãi (01 Phan Văn Định) — Nhà đa năng 3 tầng cao ráo.",
        "Điểm sơ tán 2: Trường THCS Nguyễn Lương Bằng (27 Nguyễn Lương Bằng).",
        "Điểm sơ tán 3: Trung tâm Văn hóa Thể thao Công nhân KCN Hòa Khánh (Đường số 2 KCN).",
        "Lưu ý: Ngắt toàn bộ cầu dao điện tầng thấp, kê cao tài sản và gọi ngay lực lượng cứu nạn khi nước ngập quá 0.5m.",
      ],
      legalBasis: "Phương án Phòng chống Thiên tai & Tìm kiếm Cứu nạn UBND Phường Liên Chiểu",
      actionContact: {
        label: "Ban Chỉ huy PCTT & TKCN Phường Liên Chiểu (Trực 24/7)",
        phone: "0236 1022",
        address: "Sở chỉ huy: 68 Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "người già neo đơn",
      "liệt giường",
      "không đi lại được",
      "khuyết tật nặng",
      "bệnh nặng",
      "tại nhà",
      "lưu động tại nhà",
    ],
    guidance: {
      id: "edge-mobility-senior",
      type: "MOBILITY_SENIOR",
      title: "Chính sách 'Dịch vụ công lưu động tại nhà' cho người cao tuổi, neo đơn",
      summary:
        "Người già yếu, người khuyết tật nặng không cần đi lại: Cán bộ Một cửa và Đoàn thanh niên hỗ trợ tận nơi.",
      solutionSteps: [
        "Bước 1: Người thân hoặc Tổ trưởng dân phố gọi điện đăng ký hỗ trợ dịch vụ công tại nhà.",
        "Bước 2: Đoàn thanh niên phường phối hợp cán bộ tư pháp - công an hẹn lịch và mang hồ sơ đến tận nhà.",
        "Bước 3: Chụp ảnh, lấy vân tay và trả kết quả tận tay tại nơi ở của công dân.",
      ],
      legalBasis: "Chương trình cải cách hành chính vì nhân dân phục vụ của UBND TP. Đà Nẵng",
      actionContact: {
        label: "Tổ hỗ trợ DVC lưu động tại nhà Phường Liên Chiểu",
        phone: "0905 423 233",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "miễn lệ phí",
      "giảm lệ phí",
      "hộ nghèo",
      "cận nghèo",
      "hoàn cảnh khó khăn",
      "chính sách hỗ trợ",
      "không có tiền",
      "miễn tiền",
    ],
    guidance: {
      id: "edge-fee-waiver",
      type: "FEE_WAIVER",
      title: "Chính sách miễn 100% lệ phí cư trú và hỗ trợ học phí TP. Đà Nẵng",
      summary:
        "Thành phố Đà Nẵng áp dụng chính sách an sinh xã hội đặc thù: Miễn 100% học phí công lập và miễn lệ phí DVC trực tuyến.",
      solutionSteps: [
        "Đối với cư trú: Nộp trực tuyến qua Cổng DVC được giảm 50% đến 100% lệ phí theo quy định.",
        "Đối với hộ nghèo, cận nghèo, người có công: Xuất trình Sổ hộ nghèo hoặc Giấy xác nhận của UBND phường để được miễn 100% toàn bộ lệ phí chứng thực, đăng ký cư trú.",
        "Đối với học sinh: Hỗ trợ 100% học phí công lập theo Nghị quyết của HĐND TP. Đà Nẵng.",
      ],
      legalBasis: "Nghị quyết HĐND TP. Đà Nẵng về chính sách an sinh xã hội và miễn giảm phí, lệ phí",
      actionContact: {
        label: "Bộ phận Lao động - Thương binh & Xã hội Phường",
        phone: "0236 1022",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "tổ dân phố cũ",
      "tổ cũ",
      "đổi tổ",
      "sai tổ",
      "sáp nhập tổ",
      "hòa liên cũ",
      "hòa khánh bắc cũ",
    ],
    guidance: {
      id: "edge-ward-address-drift",
      type: "WARD_ADDRESS_DRIFT",
      title: "Tra cứu chuyển đổi mã Tổ dân phố mới theo Nghị quyết 1659",
      summary:
        "Các tổ dân phố sau sáp nhập đã được đánh số lại. Vui lòng kiểm tra mã tổ mới để tránh bị trả lại hồ sơ.",
      solutionSteps: [
        "Bước 1: Tra cứu tên tổ cũ của Hòa Khánh Bắc hoặc xã Hòa Liên trên danh bạ địa phương.",
        "Bước 2: Ghi rõ trong Tờ khai: 'Tổ mới... (trước đây là Tổ... phường Hòa Khánh Bắc cũ)'.",
        "Bước 3: Cán bộ Một cửa sẽ đối chiếu cơ sở dữ liệu và chuẩn hóa địa chỉ điện tử tự động.",
      ],
      legalBasis: "Nghị quyết số 1659/NQ-UBTVQH15 của Ủy ban Thường vụ Quốc hội",
      actionContact: {
        label: "Bộ phận Một cửa UBND Phường Liên Chiểu",
        phone: "0236 1022",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "mất mạng",
      "không có mạng",
      "mất kết nối",
      "sóng yếu",
      "offline",
      "không có 4g",
      "mất wifi",
    ],
    guidance: {
      id: "edge-offline-mode",
      type: "OFFLINE_MODE",
      title: "Chế độ tra cứu ngoại tuyến khi mất sóng/mất mạng trong xóm trọ",
      summary:
        "Ứng dụng tự động lưu trữ các thẻ hướng dẫn trên thiết bị: Bạn vẫn xem và đọc được toàn bộ thông tin mà không cần kết nối mạng.",
      solutionSteps: [
        "Bước 1: Mở lại ứng dụng trên trình duyệt điện thoại — toàn bộ dữ liệu 24 thẻ đã được nạp sẵn vào bộ nhớ đệm.",
        "Bước 2: Sử dụng nút 'In / Lưu phiếu A5' để tải về định dạng PDF lưu trong máy xem bất cứ lúc nào.",
        "Bước 3: Đến Điểm hỗ trợ số cộng đồng tại 68 Lạc Long Quân hoặc Nhà văn hóa KCN để dùng wifi miễn phí.",
      ],
      legalBasis: "Kiến trúc Offline-First phục vụ công nhân vùng sóng yếu",
      actionContact: {
        label: "Điểm Wifi miễn phí & Hỗ trợ số thanh niên",
        phone: "0905 423 233",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "sổ hộ khẩu",
      "sổ hộ khẩu giấy",
      "sổ tạm trú giấy",
      "đòi sổ hộ khẩu",
      "thu sổ hộ khẩu",
      "bắt nộp sổ hộ khẩu",
    ],
    guidance: {
      id: "edge-regulatory-lag",
      type: "REGULATORY_LAG",
      title: "Căn cứ pháp lý: Nghiêm cấm yêu cầu xuất trình Sổ hộ khẩu giấy",
      summary:
        "Từ ngày 01/01/2023, Sổ hộ khẩu giấy và Sổ tạm trú giấy đã chính thức hết giá trị sử dụng theo quy định của Quốc hội.",
      solutionSteps: [
        "Bước 1: Xuất trình Thẻ Căn cước công dân gắn chip hoặc Ứng dụng VNeID Mức 2 đã tích hợp thông tin cư trú.",
        "Bước 2: Nếu cơ quan/chủ trọ yêu cầu văn bản giấy: Đề nghị cấp Giấy xác nhận thông tin cư trú (Mẫu CT07).",
        "Bước 3: Nhắc nhở quy định: Khoản 3 Điều 38 Luật Cư trú 2020 nghiêm cấm cán bộ yêu cầu công dân xuất trình sổ hộ khẩu giấy.",
      ],
      legalBasis: "Khoản 3 Điều 38 Luật Cư trú năm 2020 và Nghị định 104/2022/NĐ-CP",
      actionContact: {
        label: "Đường dây nóng phản ánh TTHC UBND TP. Đà Nẵng",
        phone: "0236 1022",
        address: "Trung tâm Thông tin Dịch vụ công Đà Nẵng",
      },
    },
  },
  {
    keywords: [
      "máy tính quán net",
      "quán internet",
      "máy dùng chung",
      "kiosk một cửa",
      "bảo mật máy chung",
      "xóa lịch sử máy",
      "máy tính công cộng",
    ],
    guidance: {
      id: "edge-shared-device",
      type: "SHARED_DEVICE",
      title: "Nguyên tắc an toàn bảo mật khi sử dụng máy tính dùng chung/quán net",
      summary:
        "Khi thao tác trên thiết bị công cộng, luôn xóa phiên làm việc để tránh lộ lọt tài khoản và thông tin nhân thân.",
      solutionSteps: [
        "Bước 1: Luôn mở trình duyệt ở chế độ Ẩn danh (Incognito/Private Window) trước khi đăng nhập VNeID/DVC.",
        "Bước 2: Tuyệt đối không bấm 'Lưu mật khẩu' (Save Password) trên trình duyệt của máy công cộng.",
        "Bước 3: Đăng xuất hoàn toàn và đóng toàn bộ cửa sổ trình duyệt trước khi rời khỏi máy.",
      ],
      legalBasis: "Quy định an toàn thông tin cá nhân trên môi trường số",
      actionContact: {
        label: "Tổ Công nghệ số cộng đồng Phường Liên Chiểu",
        phone: "0905 423 233",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "làm thay",
      "nộp thay",
      "làm giùm",
      "nộp giùm",
      "đi làm hộ",
      "không có giấy ủy quyền",
      "giấy ủy quyền",
      "ủy quyền",
    ],
    guidance: {
      id: "edge-third-party-proxy",
      type: "THIRD_PARTY_PROXY",
      title: "Quy định pháp lý khi đi làm thủ tục hành chính thay người thân",
      summary:
        "Để tránh bị từ chối tiếp nhận, người đi làm thay bắt buộc phải có văn bản ủy quyền hợp pháp theo luật định.",
      solutionSteps: [
        "Trường hợp con chưa thành niên: Cha mẹ được đương nhiên đại diện nộp hồ sơ, chỉ cần xuất trình Giấy khai sinh của con.",
        "Trường hợp người thân khác: Bắt buộc lập Giấy ủy quyền có chứng thực chữ ký của UBND cấp xã hoặc Văn phòng công chứng.",
        "Trường hợp người già yếu: Liên hệ Đoàn Thanh niên phường để được hỗ trợ mô hình Dịch vụ công lưu động tại nhà.",
      ],
      legalBasis: "Nghị định số 23/2015/NĐ-CP về cấp bản sao và chứng thực chữ ký",
      actionContact: {
        label: "Bộ phận Tư pháp - Hộ tịch Phường Liên Chiểu",
        phone: "0236 1022",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "hồ sơ bị trả lại",
      "bị từ chối hồ sơ",
      "yêu cầu bổ sung",
      "bổ sung giấy tờ",
      "sửa đổi hồ sơ",
      "hồ sơ không hợp lệ",
      "phiếu yêu cầu bổ sung",
    ],
    guidance: {
      id: "edge-rejected-supplement",
      type: "REJECTED_SUPPLEMENT",
      title: "Hướng dẫn xử lý khi hồ sơ trực tuyến bị yêu cầu chỉnh sửa/bổ sung",
      summary:
        "Bạn không cần làm lại từ đầu: Chỉ cần bổ sung đúng giấy tờ còn thiếu theo mã hồ sơ trong thời hạn quy định.",
      solutionSteps: [
        "Bước 1: Kiểm tra tin nhắn SMS/Email để lấy Mã hồ sơ và lý do cụ thể cán bộ yêu cầu bổ sung.",
        "Bước 2: Đăng nhập Cổng DVC $\to$ Vào mục 'Hồ sơ của tôi' $\to$ Chọn 'Bổ sung hồ sơ' $\to$ Tải lên giấy tờ đính kèm.",
        "Bước 3: Không nộp lại hồ sơ mới (tránh trùng lặp mã hồ sơ). Không phải đóng lại lệ phí đã thanh toán.",
      ],
      legalBasis: "Điều 12 Nghị định số 61/2018/NĐ-CP về cơ chế một cửa, một cửa liên thông",
      actionContact: {
        label: "Bộ phận Tiếp nhận và Trả kết quả Phường Liên Chiểu",
        phone: "0236 1022",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
  {
    keywords: [
      "ktx phía tây",
      "08 hà văn tính",
      "nam ô",
      "làng nam ô",
      "nước mắm nam ô",
      "hòa minh",
      "hòa khánh nam",
      "hải vân",
    ],
    guidance: {
      id: "edge-out-of-jurisdiction",
      type: "OUT_OF_JURISDICTION",
      title: "CẢNH BÁO ĐỊA GIỚI: Địa điểm tra cứu KHÔNG thuộc Phường Liên Chiểu mới",
      summary:
        "Theo Nghị quyết 1659/NQ-UBTVQH15, KTX phía Tây thuộc Phường Hòa Khánh; Làng Nam Ô thuộc Phường Hải Vân.",
      solutionSteps: [
        "Nếu bạn ở Ký túc xá phía Tây (08 Hà Văn Tính): Hãy liên hệ UBND/Công an Phường Hòa Khánh mới để làm thủ tục.",
        "Nếu bạn ở Làng Nam Ô: Hãy liên hệ UBND/Công an Phường Hải Vân mới (phường Hòa Hiệp cũ).",
        "Nếu bạn ở Phường Liên Chiểu mới (khu vực Hòa Khánh Bắc cũ và Hòa Liên): Tiếp tục làm thủ tục tại 68 & 66 Lạc Long Quân.",
      ],
      legalBasis: "Nghị quyết số 1659/NQ-UBTVQH15 của Ủy ban Thường vụ Quốc hội về sắp xếp ĐVHC",
      actionContact: {
        label: "Tổng đài hướng dẫn địa giới hành chính Đà Nẵng",
        phone: "0236 1022",
        address: "Trung tâm Thông tin Dịch vụ công TP. Đà Nẵng",
      },
    },
  },
  {
    keywords: [
      "xin học cho con",
      "con học trường nào",
      "chuyển trường mầm non",
      "xin học tiểu học",
      "học sinh tạm trú",
      "tuyển sinh đầu cấp",
      "trường mầm non công lập",
    ],
    guidance: {
      id: "edge-child-school-admission",
      type: "CHILD_SCHOOL_ADMISSION",
      title: "Chính sách tiếp nhận học sinh diện tạm trú cho con em công nhân KCN",
      summary:
        "Con em công nhân có đăng ký tạm trú hợp pháp được phân tuyến học tại các trường công lập trên địa bàn theo quy định.",
      solutionSteps: [
        "Bước 1: Hoàn thành đăng ký tạm trú cho gia đình tại Công an Phường Liên Chiểu (hoặc xin Giấy CT07).",
        "Bước 2: Theo dõi thông báo tuyển sinh đầu cấp (tháng 5–tháng 7) của UBND quận và các trường trên địa bàn.",
        "Bước 3: Nộp hồ sơ xét tuyển gồm: Đơn xin học, Bản sao Giấy khai sinh, Giấy tờ xác nhận nơi cư trú (CT07/VNeID).",
      ],
      legalBasis: "Kế hoạch tuyển sinh đầu cấp hàng năm của Phòng Giáo dục & Đào tạo quận Liên Chiểu",
      actionContact: {
        label: "Trường Tiểu học Âu Cơ / THCS Nguyễn Lương Bằng",
        phone: "0236 1022",
        address: "Địa bàn phường Liên Chiểu, TP. Đà Nẵng",
      },
    },
  },
  {
    keywords: [
      "mở quán ăn sáng",
      "mở quán cà phê",
      "kinh doanh nhỏ",
      "hộ kinh doanh cá thể",
      "đăng ký kinh doanh",
      "vệ sinh an toàn thực phẩm",
      "bán đồ ăn sáng xóm trọ",
    ],
    guidance: {
      id: "edge-micro-business-startup",
      type: "MICRO_BUSINESS_STARTUP",
      title: "Thủ tục đăng ký Hộ kinh doanh cá thể & An toàn thực phẩm cho thanh niên",
      summary:
        "Thủ tục tinh gọn, chi phí thấp: Đăng ký một cửa tại UBND cấp huyện/phường và ký cam kết bảo đảm an toàn thực phẩm.",
      solutionSteps: [
        "Bước 1: Điền Giấy đề nghị đăng ký hộ kinh doanh cá thể (Mẫu Phụ lục III-1) kèm bản sao CCCD của chủ hộ.",
        "Bước 2: Nộp tại Bộ phận Một cửa (hoặc nộp trực tuyến qua Cổng DVC thành phố); lệ phí theo quy định HĐND.",
        "Bước 3: Đối với quán ăn/uống nhỏ: Tham gia tập huấn kiến thức ATTP và ký Bản cam kết sản xuất, kinh doanh thực phẩm an toàn.",
      ],
      legalBasis: "Nghị định số 01/2021/NĐ-CP về đăng ký doanh nghiệp và Luật An toàn thực phẩm",
      actionContact: {
        label: "Bộ phận Đăng ký kinh doanh Một cửa Liên Chiểu",
        phone: "0236 1022",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu",
      },
    },
  },
];

/**
 * Phân tích và phát hiện các điểm biên chê dân sinh từ câu hỏi của người dân
 */
export function resolveEdgeCases(query: string): EdgeCaseResolutionResult {
  if (!query || typeof query !== "string") {
    return {
      hasEdgeCase: false,
      matchedCases: [],
    };
  }

  const lowerQuery = query.toLowerCase().trim();
  const matchedCases: EdgeCaseGuidance[] = [];

  for (const item of EDGE_CASES_DATABASE) {
    const isMatched = item.keywords.some((kw) => lowerQuery.includes(kw));
    if (isMatched) {
      matchedCases.push(item.guidance);
    }
  }

  return {
    hasEdgeCase: matchedCases.length > 0,
    matchedCases,
    primaryCase: matchedCases[0],
  };
}
