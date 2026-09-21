import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CitizenServiceView } from "../src/components/CitizenServiceView";
import { PublicPlaceCardDTO, PublicServiceCardDTO } from "../src/contracts/card";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

const mockServiceCard: PublicServiceCardDTO = {
  id: "service-chuan-bi-tam-tru",
  type: "SERVICE",
  version: "1.0.0",
  title: "Chuẩn bị thông tin đăng ký tạm trú",
  intentIds: ["cu_tru-01"],
  jurisdiction: { id: "lien-chieu-2025", label: "Phường Liên Chiểu, TP. Đà Nẵng" },
  applicability: ["Người dân và người mới đến phường Liên Chiểu"],
  exclusions: ["Chưa xác minh cơ quan tiếp nhận"],
  sources: [
    {
      id: "src-1",
      url: "https://danang.gov.vn",
      title: "Cổng thông tin Đà Nẵng",
      publisher: "UBND TP Đà Nẵng",
      fetchedAt: "2026-09-19T00:00:00+07:00",
      relevantExcerpt: "Trích đoạn nguồn",
    },
  ],
  review: {
    status: "review",
    reviewDue: "2026-10-19",
    isVerified: false,
  },
  actions: [],
  availability: "available",
  displayStatus: "sourced_pending",
  isSynthetic: false,
  body: {
    summary: "Tóm tắt dịch vụ",
    questions: [],
    steps: [
      {
        id: "step-1",
        stepNumber: 1,
        stepType: "procedural",
        title: "Bước 1",
        description: "Mô tả bước 1",
        requiredDocs: [],
        claimIds: ["claim-1"],
        branches: [],
      },
    ],
    unknownOption: { label: "Chưa rõ", guidance: "Hướng dẫn" },
    missingQuestions: [],
    claimsWithSources: [{ id: "claim-1", claim: "Khẳng định 1", sourceId: "src-1" }],
  },
};

describe("Sửa lỗi đích bản đồ và địa điểm tiếp nhận trong CitizenServiceView", () => {
  it("Thẻ chưa có địa điểm tiếp nhận được xác minh không hiển thị liên kết Công an gán cứng và không dùng minimap SVG như bản đồ thật", () => {
    const html = renderToStaticMarkup(
      React.createElement(CitizenServiceView, {
        primaryCard: mockServiceCard,
        otherServices: [],
        caPlaceCard: null,
      })
    );

    // Không chứa URL Google Maps gán cứng tới Công an phường
    expect(html).not.toContain("maps.google.com/?q=Cong+an+phuong+Lien+Chieu+Da+Nang");
    expect(html).not.toContain("Cong+an+phuong+Lien+Chieu+Da+Nang");
    // Không dùng minimap.svg như vị trí thật
    expect(html).not.toContain("minimap.svg");
    // Hiển thị trạng thái chưa có bản đồ và chưa xác minh chỉ đường
    expect(html).toContain("Chưa có bản đồ");
    expect(html).toContain("Chưa có chỉ đường đã xác minh");
    expect(html).toContain("Vị trí và bản đồ");
    expect(html).toContain("Chưa xác minh cơ quan tiếp nhận hồ sơ tại địa bàn");
  });

  it("Thẻ có action đúng được cung cấp từ thẻ địa điểm tiếp nhận sẽ mở đúng URL hành động", () => {
    const verifiedUrl = "https://maps.google.com/?api=1&query=16.0747%2C108.1534";
    const verifiedPlaceCard: PublicPlaceCardDTO = {
      id: "place-co-quan-xac-minh",
      type: "PLACE",
      version: "1.0.0",
      title: "Cơ quan Tiếp nhận Đã Xác minh",
      intentIds: ["dia_diem-01"],
      jurisdiction: { id: "lien-chieu-2025", label: "Phường Liên Chiểu, TP. Đà Nẵng" },
      applicability: [],
      exclusions: [],
      sources: [
        {
          id: "src-place",
          url: "https://danang.gov.vn",
          title: "Nguồn địa điểm",
          publisher: "UBND TP Đà Nẵng",
          fetchedAt: "2026-09-19T00:00:00+07:00",
          relevantExcerpt: "Trích đoạn",
        },
      ],
      review: {
        status: "review",
        reviewDue: "2026-10-19",
        isVerified: false,
      },
      actions: [
        {
          id: "act-directions",
          type: "external_link",
          label: "Tìm trên Google Maps",
          url: verifiedUrl,
        },
      ],
      availability: "available",
      displayStatus: "sourced_pending",
      isSynthetic: false,
      body: {
        function: "Tiếp nhận hồ sơ",
        address: "68 đường Lạc Long Quân, phường Liên Chiểu, TP. Đà Nẵng",
        jurisdictionDetail: "Phường Liên Chiểu mới",
        openingHours: "7:30 - 11:30 | 13:30 - 17:00",
        contactPhone: "0236 1022",
        claimsWithSources: [{ id: "cl-1", claim: "Khẳng định địa chỉ", sourceId: "src-place" }],
      },
    };

    const html = renderToStaticMarkup(
      React.createElement(CitizenServiceView, {
        primaryCard: mockServiceCard,
        otherServices: [],
        caPlaceCard: verifiedPlaceCard,
      })
    );

    // Mở đúng URL hành động đã xác minh (HTML escape & -> &amp;)
    expect(html).toContain(verifiedUrl.replace(/&/g, "&amp;"));
    expect(html).toContain("Tìm trên Google Maps");
    expect(html).toContain("Chỉ đường");
    expect(html).toContain("68 đường Lạc Long Quân, phường Liên Chiểu, TP. Đà Nẵng");
    // Không chứa link gán cứng cũ
    expect(html).not.toContain("Cong+an+phuong+Lien+Chieu+Da+Nang");
  });

  it("Không nhận nhầm liên kết ngoài thông thường của địa điểm làm đích chỉ đường bản đồ", () => {
    const placeWithGenericLink: PublicPlaceCardDTO = {
      id: "place-dai-hoc-bach-khoa",
      type: "PLACE",
      version: "1.0.0",
      title: "Trường Đại học Bách khoa",
      intentIds: ["dia_diem-05"],
      jurisdiction: { id: "lien-chieu-2025", label: "Phường Liên Chiểu, TP. Đà Nẵng" },
      applicability: [],
      exclusions: [],
      sources: [
        {
          id: "src-dut",
          url: "https://dut.udn.vn",
          title: "Trang chủ Bách khoa",
          publisher: "ĐH Bách khoa",
          fetchedAt: "2026-09-19T00:00:00+07:00",
          relevantExcerpt: "Trích đoạn",
        },
      ],
      review: {
        status: "review",
        reviewDue: "2026-10-19",
        isVerified: false,
      },
      actions: [
        {
          id: "act-homepage",
          type: "external_link",
          label: "Trang chủ nhà trường",
          url: "https://dut.udn.vn",
        },
      ],
      availability: "available",
      displayStatus: "sourced_pending",
      isSynthetic: false,
      body: {
        function: "Đào tạo đại học",
        address: "54 đường Nguyễn Lương Bằng, phường Liên Chiểu, TP. Đà Nẵng",
        jurisdictionDetail: "Phường Liên Chiểu mới",
        openingHours: "Giờ hành chính",
        claimsWithSources: [{ id: "cl-dut", claim: "Địa chỉ trường", sourceId: "src-dut" }],
      },
    };

    const html = renderToStaticMarkup(
      React.createElement(CitizenServiceView, {
        primaryCard: mockServiceCard,
        otherServices: [],
        caPlaceCard: placeWithGenericLink,
      })
    );

    // Không được biến trang chủ trường học thành đích nút chỉ đường!
    expect(html).toContain("Chưa có chỉ đường đã xác minh");
    expect(html).toContain("Chưa có bản đồ");
    expect(html).not.toContain('href="https://dut.udn.vn"');
  });
});
