"""Synthetic design-space exploration; NOT a survey or product accuracy benchmark.

Run: python design/compass/simulate.py
No external packages, API calls, personal data, or legal conclusions.
"""
from __future__ import annotations

import csv
import hashlib
import json
from collections import Counter
from itertools import product
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# 100 distinct goals. Contexts are constraints on the person using the guide,
# who may be acting for themselves or assisting someone else.
CATALOG = {
    "cu_tru": [
        ("nhận diện việc cần hỏi khi mới thuê trọ", "không nhầm nhu cầu với thủ tục khác"),
        ("lập phiếu chuẩn bị trước khi đăng ký tạm trú", "biết điều đã rõ và điều cần xác minh"),
        ("chuẩn bị câu hỏi cần trao đổi với chủ nhà", "không tự kết luận giấy tờ thay chủ nhà"),
        ("mở đúng kênh chính thức về đăng ký tạm trú", "tiếp tục thao tác trên kênh có thẩm quyền"),
        ("tìm bước tiếp theo khi không đăng nhập được kênh cư trú", "nhận hỗ trợ mà không giao mật khẩu hay OTP"),
        ("hiểu cần hỏi gì khi hồ sơ tạm trú được yêu cầu bổ sung", "làm rõ yêu cầu mà không tự suy đoán quyết định"),
        ("tiếp tục phiếu chuẩn bị tạm trú đang làm dở", "không phải kể lại toàn bộ nhu cầu"),
        ("mang phiếu vướng mắc tạm trú đến người hỗ trợ", "người hỗ trợ hiểu việc còn vướng"),
        ("chuyển từ nhu cầu tạm trú sang thường trú", "được chuyển sang nguồn đúng phạm vi"),
        ("hỏi trường hợp cư trú có tranh chấp hoặc yếu tố quốc tịch", "được người có thẩm quyền xem xét trường hợp riêng"),
    ],
    "kinh_doanh": [
        ("tìm hiểu trước khi mở quán ăn sáng", "biết các điều kiện cần xác minh trước khi đầu tư"),
        ("chuẩn bị mở quán cà phê", "không bỏ sót đầu mối cần hỏi"),
        ("bán đồ ăn làm tại nhà", "xác định trường hợp áp dụng qua nguồn chính thức"),
        ("mở tiệm sửa xe", "kiểm tra yêu cầu phù hợp loại hình"),
        ("bán hàng qua mạng", "phân biệt hướng dẫn chung với nghĩa vụ cụ thể"),
        ("thay đổi địa điểm hộ kinh doanh", "biết nơi xác minh thủ tục thay đổi"),
        ("tạm ngừng hoạt động kinh doanh", "tìm đúng hướng dẫn hiện hành"),
        ("hiểu việc sử dụng hóa đơn cho cơ sở nhỏ", "không áp dụng thông tin thuế lỗi thời"),
        ("hỏi điều kiện đặt biển hiệu cửa hàng", "không suy đoán quyền sử dụng không gian công cộng"),
        ("chuẩn bị câu hỏi về an toàn cơ sở kinh doanh", "nhận hướng dẫn chuyên môn theo từng trường hợp"),
    ],
    "hoc_tap": [
        ("tìm trường mầm non sau khi chuyển chỗ ở", "kiểm tra thông tin tuyển sinh phù hợp"),
        ("tìm hướng dẫn vào lớp một", "biết nguồn thông báo theo năm học"),
        ("xin chuyển trường giữa năm", "xác minh đầu mối và điều kiện tiếp nhận"),
        ("hỏi trường hợp thiếu giấy tờ nhập học", "được trường giải đáp trường hợp riêng"),
        ("tìm thông tin hỗ trợ học phí", "không bị hứa chắc quyền lợi"),
        ("tìm lớp học nghề", "so sánh cơ hội từ nguồn kiểm chứng"),
        ("tìm lớp kỹ năng số miễn phí", "biết lịch và đơn vị tổ chức đã xác nhận"),
        ("tìm học bổng cho học sinh khó khăn", "biết điều kiện và hạn nộp thực tế"),
        ("tìm hỗ trợ cho người học khuyết tật", "tiếp cận đầu mối phù hợp"),
        ("hỏi chỗ học khi đã hết đợt tuyển sinh", "nhận phương án từ đơn vị có thẩm quyền"),
    ],
    "y_te": [
        ("tìm lịch tiêm chủng của trạm y tế", "xác nhận lịch còn hiệu lực"),
        ("hỏi nơi liên hệ khi mất sổ tiêm", "tránh tự đoán lịch tiêm cá nhân"),
        ("tìm cơ sở khám gần nơi ở", "kiểm tra thông tin cơ sở chính thức"),
        ("tìm thông tin tham gia bảo hiểm y tế", "biết nguồn hướng dẫn phù hợp"),
        ("hỏi việc chuyển nơi khám ban đầu", "xác minh quy định hiện hành"),
        ("tìm hỗ trợ chăm sóc người cao tuổi", "liên hệ dịch vụ được xác minh"),
        ("tìm đầu mối tư vấn sức khỏe tinh thần", "tiếp cận hỗ trợ chuyên môn"),
        ("tìm thông tin chương trình khám cộng đồng", "không đến nhầm lịch cũ"),
        ("tìm kênh phản ánh cơ sở y tế", "gửi phản ánh đúng nơi"),
        ("hỏi nơi trợ giúp khi xuất hiện triệu chứng bất thường", "không nhận chẩn đoán từ công cụ dân sinh"),
    ],
    "an_sinh": [
        ("tìm đầu mối hỗ trợ khó khăn đột xuất", "biết nơi trình bày hoàn cảnh"),
        ("tìm thông tin trợ giúp người khuyết tật", "xác minh điều kiện qua cơ quan phụ trách"),
        ("tìm hỗ trợ trẻ em khó khăn", "bảo vệ dữ liệu của trẻ"),
        ("hỏi trợ giúp người cao tuổi", "biết điều kiện cần xác minh"),
        ("tìm hỗ trợ nhà ở cho người lao động", "không nhầm quảng cáo với chính sách"),
        ("hỏi nguồn thực phẩm hỗ trợ cộng đồng", "xác nhận chương trình còn hoạt động"),
        ("tìm hỗ trợ cho gia đình gặp thiên tai", "biết đầu mối có thẩm quyền"),
        ("tìm kênh bảo vệ người bị bạo lực", "chuyển tới hỗ trợ chuyên trách"),
        ("tìm chương trình hỗ trợ dịp lễ", "kiểm tra phạm vi và thời gian"),
        ("hỏi việc bổ sung hồ sơ trợ cấp", "không suy diễn khả năng được duyệt"),
    ],
    "viec_lam": [
        ("tìm việc làm theo ca", "kiểm tra đơn vị tuyển dụng"),
        ("tìm việc bán thời gian cho sinh viên", "tránh phải nộp phí không rõ ràng"),
        ("tìm vị trí thực tập", "biết cách liên hệ đơn vị thật"),
        ("tìm lớp đào tạo chuyển nghề", "xác nhận lịch và điều kiện tham gia"),
        ("tìm nguồn hỗ trợ viết hồ sơ xin việc", "không gửi dữ liệu cá nhân công khai"),
        ("tìm đầu mối khi bị nợ lương", "được chuyển tới tư vấn chuyên môn"),
        ("hỏi thông tin trợ cấp thất nghiệp", "tra đúng nguồn hiện hành"),
        ("tìm cơ hội cho người lao động khuyết tật", "xác nhận điều kiện công việc"),
        ("kiểm tra thông tin tuyển dụng đáng ngờ", "không bị công cụ khẳng định an toàn khi chưa xác minh"),
        ("tìm thông tin ngày hội việc làm", "biết sự kiện còn hiệu lực"),
    ],
    "moi_truong": [
        ("tìm lịch thu gom rác", "kiểm tra tuyến và lịch hiện hành"),
        ("hỏi cách phân loại rác tại nơi ở", "theo đúng hướng dẫn thu gom địa phương"),
        ("tìm nơi tiếp nhận đồ cồng kềnh", "không tự chọn điểm đổ bỏ"),
        ("tìm đơn vị tiếp nhận phế thải xây dựng", "xác minh nơi được phép tiếp nhận"),
        ("phản ánh điểm đổ rác tự phát", "dùng kênh tiếp nhận chính thức"),
        ("phản ánh tiếng ồn khu dân cư", "trình bày thông tin cần thiết"),
        ("phản ánh đèn đường hỏng", "gửi đúng vị trí và nơi tiếp nhận"),
        ("tìm nơi tiếp nhận pin cũ", "xác nhận điểm thu gom còn hoạt động"),
        ("đăng ký hoạt động làm sạch khu phố", "xác nhận đơn vị tổ chức"),
        ("phản ánh thoát nước bị tắc", "phân biệt phản ánh thường với tình huống nguy hiểm"),
    ],
    "dia_diem": [
        ("tìm điểm tiếp nhận hành chính phục vụ nơi mới đến", "kiểm tra đúng địa bàn và đúng chức năng thay vì chỉ gần nhất"),
        ("tìm đầu mối Công an phụ trách cư trú", "không tới nhầm trụ sở cấp quận cũ"),
        ("tìm trạm y tế được giới thiệu cho khu vực", "kiểm tra địa chỉ và cách liên hệ"),
        ("tìm điểm hỗ trợ số cho người mới đến", "biết điểm đã có người phụ trách xác nhận"),
        ("tìm địa điểm thiết yếu khi không chia sẻ GPS", "chọn khu vực thủ công mà vẫn xem được danh bạ"),
        ("mở chỉ đường tới một địa điểm đã chọn", "giao chỉ đường cho ứng dụng bản đồ thay vì bịa khoảng cách"),
        ("kiểm tra địa điểm trước khi đi ngoài giờ", "phân biệt giờ đã xác minh và giờ chưa biết"),
        ("lưu thẻ địa điểm và nguồn để hỏi lại", "mang theo thông tin mà không cần tài khoản"),
        ("tìm bến xe buýt và chuyến đang chạy gần đây", "không nhận lịch trình thời gian thực khi chưa có dữ liệu"),
        ("tìm trường gần nhà có thể tiếp nhận học sinh", "không đánh đồng gần nhà với đúng tuyến hoặc còn chỗ"),
    ],
    "van_hoa": [
        ("khám phá một địa điểm địa phương có nguồn giới thiệu", "biết câu chuyện và hành động tiếp theo"),
        ("đọc câu chuyện văn hóa của nơi vừa đến", "phân biệt tư liệu xác minh với nội dung sáng tác"),
        ("lưu một điểm muốn tham quan", "tự chọn đi tiếp mà không bị gợi ý lịch trình thiếu căn cứ"),
        ("tìm hiểu di tích trong phường", "phân biệt địa giới hiện hành"),
        ("tìm sản phẩm OCOP địa phương", "kiểm tra chứng nhận còn phù hợp"),
        ("tìm thông tin tham quan Nam Ô", "nhận chỉ dẫn đúng địa bàn thay vì gán nhầm phường"),
        ("tìm sự kiện cuối tuần", "kiểm tra thông báo còn hiệu lực"),
        ("tìm nơi mượn sách", "xác nhận giờ hoạt động"),
        ("đăng ký tham gia tình nguyện", "biết đơn vị tiếp nhận đã xác nhận"),
        ("tìm thông tin sản phẩm thanh niên", "phân biệt giới thiệu với bảo chứng chất lượng"),
    ],
    "du_lich_su_kien": [
        ("chọn hành trình tham quan trong hai giờ", "tính cả thời gian đi lại và điều kiện mở cửa"),
        ("tìm sự kiện thực sự diễn ra hôm nay", "không nhận lễ hội năm 2024 như sự kiện hiện tại"),
        ("tìm món ăn địa phương phù hợp ngân sách", "phân biệt thông tin giới thiệu với giá đã kiểm chứng"),
        ("đi tham quan cùng người khó đi lại", "xác minh điều kiện tiếp cận thay vì tự suy đoán"),
        ("đi khám phá khi trời mưa", "không được công cụ bảo đảm an toàn ngoài khả năng"),
        ("tìm trải nghiệm phù hợp cho trẻ nhỏ", "xác minh dịch vụ và người tổ chức"),
        ("chọn điểm tham quan ngoài phường", "thấy rõ nhãn ngoài địa bàn và nguồn tương ứng"),
        ("kiểm tra một địa điểm có còn mở cửa", "không nhầm nội dung cũ với trạng thái thời gian thực"),
        ("tìm nơi mua đặc sản có nguồn gốc", "không nhận đánh giá sao hoặc chứng nhận được bịa ra"),
        ("hỏi hỗ trợ khi bị lạc trong chuyến tham quan", "được chuyển tới trợ giúp phù hợp"),
    ],
}

PROFILES = [
    ("P01", "người có thể tự thao tác trên điện thoại cá nhân", "self", "hiển thị ngắn, rõ từng bước"),
    ("P02", "người ít quen thao tác số", "low_literacy", "câu ngắn, lựa chọn rõ, luôn có nút nhờ hỗ trợ"),
    ("P03", "người không có điện thoại thông minh, xem qua người hỗ trợ", "no_device", "phiếu in hoặc xem cùng người hỗ trợ; không ép tạo tài khoản"),
    ("P04", "người làm việc theo ca, chỉ rảnh ngoài giờ", "shift", "lưu phiếu tự nguyện; không hứa có người trực 24/7"),
    ("P05", "người dùng máy dùng chung tại điểm hỗ trợ", "shared", "không lưu bền mặc định; kết thúc phiên phải xóa dữ liệu"),
    ("P06", "người khó đi lại", "mobility", "ưu tiên kênh tiếp cận từ xa đã xác minh, không hứa xử lý tại nhà"),
    ("P07", "người đang hỗ trợ người thân có sự đồng ý", "proxy_yes", "hỗ trợ thao tác không đồng nghĩa đại diện pháp lý"),
    ("P08", "người muốn làm giúp nhưng chưa hỏi ý kiến người liên quan", "proxy_no", "chỉ hướng dẫn chung; không tạo hoặc chia sẻ phiếu cá nhân"),
    ("P09", "người đọc tiếng Việt chưa thành thạo", "language", "bản dịch chỉ trợ đọc; trường hợp cần hiểu chính xác phải có hỗ trợ"),
    ("P10", "người quay lại sau lần trước còn vướng", "returning", "khôi phục thông tin tự chọn và hỏi việc còn vướng, không giả định hồ sơ đã nộp"),
]

STRESSES = [
    ("S01", "thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt", "clean", "không biến phiếu chuẩn bị thành kết luận đủ điều kiện"),
    ("S02", "chỉ biết tên quận cũ, chưa xác định phường hiện tại", "unknown_area", "không đoán địa giới từ tên đường hoặc tên quận cũ"),
    ("S03", "xác nhận việc cần giải quyết ở ngoài phường Liên Chiểu", "outside", "không áp hướng dẫn địa phương sang nơi khác"),
    ("S04", "nguồn hướng dẫn đã quá ngày rà soát quy định trong bộ dữ liệu", "stale", "không trình bày dữ liệu cũ như đang còn hiệu lực"),
    ("S05", "hai nguồn chính thức đưa thông tin khác nhau", "conflict", "không tự chọn nguồn thuận tiện hoặc ghép hai phiên bản"),
    ("S06", "người dùng chưa biết một điều kiện quyết định nhánh", "missing_fact", "cho phép không biết; không tự điền điều kiện"),
    ("S07", "người dùng định dán ảnh căn cước hoặc mã đăng nhập vào ô hỏi", "sensitive", "chặn đầu vào nhạy cảm trước khi gửi ra dịch vụ ngoài"),
    ("S08", "mất mạng sau khi đã mở được phiếu, không thể kiểm tra phiên bản mới", "offline", "chỉ xem lại phiếu có mốc thời gian; không khẳng định vừa xác minh"),
    ("S09", "dịch vụ AI hết hạn mức hoặc không phản hồi", "ai_down", "luồng lựa chọn và phiếu đã duyệt vẫn phải dùng được"),
    ("S10", "đang có nguy cơ an toàn tức thời tại nơi ở hoặc nơi người dùng hiện diện", "urgent", "ưu tiên tìm trợ giúp khẩn phù hợp, không tiếp tục hỏi thủ tục"),
]

ACTION_TEXT = {
    "PREPARE": "Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.",
    "ASK_AREA": "Hỏi lại phường hiện tại hoặc hỗ trợ xác minh địa bàn; chưa xuất checklist địa phương.",
    "OUTSIDE": "Thông báo ngoài địa bàn; mở danh mục chính thức để người dùng chọn nơi phù hợp.",
    "REVIEW_SOURCE": "Tạm ngừng chi tiết bị ảnh hưởng; hiển thị nhu cầu cần xác minh và đầu mối đã xác nhận nếu có.",
    "ASK_FACT": "Hỏi một điều kiện còn thiếu bằng lựa chọn có phương án không biết; nếu vẫn thiếu, lập phiếu câu hỏi.",
    "REMOVE_SENSITIVE": "Không nhận ảnh giấy tờ, mật khẩu, OTP; bỏ nội dung nhạy cảm và tiếp tục bằng thông tin phân loại.",
    "OFFLINE_VIEW": "Xem lại phiếu và ngày rà soát đã lưu tự nguyện; chờ có mạng để xác minh tiếp, không gửi gì.",
    "URGENT_HELP": "Dừng hành trình thủ tục; ưu tiên liên hệ trợ giúp khẩn đã xác minh hoặc người hỗ trợ tại chỗ.",
    "GENERAL_ONLY": "Chỉ hiển thị hướng dẫn chung; không cá nhân hóa hoặc chia sẻ thông tin người khác khi chưa có đồng ý.",
    "LANGUAGE_HELP": "Dùng hướng dẫn đơn giản và đề nghị trợ đọc; không kết luận pháp lý từ bản dịch tự động.",
    "OFFICIAL_REDIRECT": "Nêu rõ chưa hỗ trợ nhu cầu này; dẫn danh mục chính thức, không bịa câu trả lời để giữ người dùng.",
}

INTENTS = [
    {"id": f"{domain}-{i:02d}", "domain": domain, "goal": goal, "benefit": benefit}
    for domain, goals in CATALOG.items()
    for i, (goal, benefit) in enumerate(goals, 1)
]
ALL_IDS = {i["id"] for i in INTENTS}
RESIDENCE_IDS = {f"cu_tru-{i:02d}" for i in range(1, 9)}
PLACE_IDS = {f"dia_diem-{i:02d}" for i in range(1, 9)}
DISCOVERY_IDS = {f"van_hoa-{i:02d}" for i in range(1, 4)}
MVP_IDS = RESIDENCE_IDS | PLACE_IDS | DISCOVERY_IDS
CANDIDATES = {
    "A_broad": ALL_IDS,
    "B_business": {i["id"] for i in INTENTS if i["domain"] == "kinh_doanh"},
    "C_newcomer_bundle": {i["id"] for i in INTENTS if i["domain"] in {"cu_tru", "hoc_tap", "y_te"}},
    "D_residence_only": RESIDENCE_IDS,
    "E_three_entries_curated": MVP_IDS,
}


def decide(intent_id: str, profile: str, flags: set[str], supported: set[str]) -> tuple[str, str]:
    """Proposed routing policy over explicit metadata, NOT a tested AI classifier."""
    # Global handling order. Privacy remains mandatory even for emergency screens.
    if "urgent" in flags:
        return "URGENT_HELP", "Nguy cơ tức thời được ưu tiên hơn hành trình thủ tục."
    if "sensitive" in flags:
        return "REMOVE_SENSITIVE", "Đầu vào nhạy cảm không cần thiết cho nhiệm vụ chuẩn bị."
    if "unknown_area" in flags:
        return "ASK_AREA", "Chưa xác định địa bàn thì không áp nội dung địa phương."
    if "outside" in flags:
        return "OUTSIDE", "Phạm vi hướng dẫn phụ thuộc địa bàn được xác nhận."
    if intent_id not in supported:
        return "OFFICIAL_REDIRECT", "Nhu cầu này chưa nằm trong gói nội dung thí điểm."
    if profile == "proxy_no" and not intent_id.startswith(("dia_diem-", "van_hoa-")):
        return "GENERAL_ONLY", "Chưa có sự đồng ý để cá nhân hóa hoặc chia sẻ cho người được hỗ trợ."
    if "stale" in flags or "conflict" in flags:
        return "REVIEW_SOURCE", "Nguồn không đạt điều kiện phát hành hướng dẫn chi tiết."
    if "offline" in flags:
        return "OFFLINE_VIEW", "Có thể xem lại phiếu, nhưng không thể xác minh tính mới khi mất mạng."
    if "missing_fact" in flags:
        return "ASK_FACT", "Thiếu thông tin để chọn nhánh; cần làm rõ trước."
    if profile == "language":
        return "LANGUAGE_HELP", "Khả năng hiểu nội dung phải được bảo đảm trước khi tự thực hiện."
    return "PREPARE", "Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt."


def scenarios():
    for n, (intent, profile, stress) in enumerate(product(INTENTS, PROFILES, STRESSES), 1):
        pid, persona, mode, adaptation = profile
        sid, state, flag, hazard = stress
        action, why = decide(intent["id"], mode, {flag}, MVP_IDS)
        output_type = "SERVICE" if intent["id"] in RESIDENCE_IDS else "PLACE" if intent["id"] in PLACE_IDS else "DISCOVER" if intent["id"] in DISCOVERY_IDS else "OUT_OF_SCOPE"
        action_text = ACTION_TEXT[action]
        if action == "PREPARE" and output_type == "PLACE":
            action_text = "Hiển thị thẻ địa điểm đã duyệt, chức năng phục vụ, nguồn, ngày rà soát; chỉ đường bằng ứng dụng bản đồ ngoài."
        if action == "PREPARE" and output_type == "DISCOVER":
            action_text = "Hiển thị thẻ khám phá đã biên tập, câu chuyện có nguồn và nơi tham khảo; không sinh tour hoặc giờ mở cửa."
        yield {
            "id": f"LC-{n:05d}", "intent_id": intent["id"], "domain": intent["domain"],
            "profile_id": pid, "stress_id": sid, "profile_mode": mode, "flag": flag,
            "synthetic": True,
            "base_story": f"Là {persona}, tôi muốn {intent['goal']}, để {intent['benefit']}.",
            "user_story": f"Là {persona}, tôi muốn {intent['goal']}, để {intent['benefit']}. Bối cảnh hiện tại: {state}.",
            "given": state,
            "when": "Người dùng bắt đầu hoặc tiếp tục nhu cầu trên LC Compass.",
            "scope_supported": intent["id"] in MVP_IDS,
            "decision_reason": why, "expected_action": action,
            "output_type": output_type, "then": action_text, "ui_requirement": adaptation,
            "failure_to_avoid": hazard,
            "acceptance": f"Thực hiện {action}; {adaptation}; {hazard}.",
            "evidence_status": "Giả định cho thiết kế; chưa kiểm tra trên người thật hoặc AI thật.",
        }


def verify(rows):
    """Independent invariants and explicit combined-fault cases, not self-rated accuracy."""
    assert len(rows) == 10000
    assert len({r["id"] for r in rows}) == 10000
    assert len({(r["intent_id"], r["profile_id"], r["stress_id"]) for r in rows}) == 10000
    assert len({(r["user_story"], r["given"]) for r in rows}) == 10000
    # There are 1,000 base story sentences, each exercised under 10 distinct states.
    assert len({r["base_story"] for r in rows}) == 1000
    assert len({r["user_story"] for r in rows}) == 10000
    assert set(Counter(r["domain"] for r in rows).values()) == {1000}
    assert set(Counter(r["profile_id"] for r in rows).values()) == {1000}
    assert set(Counter(r["stress_id"] for r in rows).values()) == {1000}
    assertions = 0
    for r in rows:
        action, flag = r["expected_action"], r["flag"]
        if action == "PREPARE":
            assert r["scope_supported"] and flag in {"clean", "ai_down"}
            assert r["profile_mode"] != "language"
            if r["profile_mode"] == "proxy_no":
                assert r["output_type"] in {"PLACE", "DISCOVER"}
        if flag == "urgent":
            assert action == "URGENT_HELP"
        if flag == "sensitive":
            assert action == "REMOVE_SENSITIVE"
        if flag in {"stale", "conflict", "missing_fact", "outside", "unknown_area", "offline"}:
            assert action != "PREPARE"
        if not r["scope_supported"]:
            assert action != "PREPARE"
        assertions += 1
    for intent in INTENTS:
        for p in PROFILES:
            assert decide(intent["id"], p[2], {"clean"}, MVP_IDS) == decide(intent["id"], p[2], {"ai_down"}, MVP_IDS)
    combinations = [
        ("cu_tru-02", "self", {"urgent", "sensitive", "stale"}, "URGENT_HELP"),
        ("cu_tru-02", "shared", {"sensitive", "offline"}, "REMOVE_SENSITIVE"),
        ("cu_tru-02", "self", {"unknown_area", "stale"}, "ASK_AREA"),
        ("cu_tru-02", "proxy_no", {"conflict", "offline"}, "GENERAL_ONLY"),
        ("cu_tru-02", "self", {"conflict", "offline"}, "REVIEW_SOURCE"),
        ("cu_tru-02", "self", {"stale", "ai_down"}, "REVIEW_SOURCE"),
        ("cu_tru-02", "self", {"offline", "missing_fact"}, "OFFLINE_VIEW"),
        ("cu_tru-02", "language", {"missing_fact", "ai_down"}, "ASK_FACT"),
        ("cu_tru-09", "self", {"clean"}, "OFFICIAL_REDIRECT"),
        ("kinh_doanh-01", "self", {"urgent", "outside"}, "URGENT_HELP"),
        ("cu_tru-02", "self", {"outside", "ai_down"}, "OUTSIDE"),
        ("cu_tru-02", "proxy_yes", {"clean"}, "PREPARE"),
        ("dia_diem-01", "proxy_no", {"clean"}, "PREPARE"),
        ("van_hoa-01", "proxy_no", {"clean"}, "PREPARE"),
    ]
    for iid, mode, flags, expected in combinations:
        assert decide(iid, mode, flags, MVP_IDS)[0] == expected
    return {"record_invariant_checks": assertions, "ai_outage_equivalence_pairs": 1000,
            "combined_fault_checks": len(combinations), "status": "passed",
            "limits": "Only the routing model is checked. No UI, live knowledge, LLM, external service, or legal correctness is verified."}


def main():
    rows = list(scenarios())
    checks = verify(rows)
    with (ROOT / "scenarios_10000.jsonl").open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    with (ROOT / "scenarios_10000.csv").open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    comparison = {}
    for name, supported in CANDIDATES.items():
        count = Counter(decide(r["intent_id"], r["profile_mode"], {r["flag"]}, supported)[0] for r in rows)
        comparison[name] = {"supported_goal_count": len(supported),
                            "synthetic_scope_rows": sum(r["intent_id"] in supported for r in rows),
                            "routing_counts": dict(sorted(count.items()))}
    stats = {
        "date": "2026-09-18", "seed": "none; exhaustive Cartesian product",
        "method": "100 goals x 10 user contexts x 10 source/system states",
        "records": len(rows), "unique_base_stories": 1000, "unique_contextual_stories": 10000,
        "unique_story_state_pairs": 10000,
        "warning": "Designed balance, not population frequency. Candidate outputs assume the SAME proposed safeguards; these are not product comparisons or success rates.",
        "mvp_supported_goal_ids": sorted(MVP_IDS),
        "domain_counts": dict(Counter(r["domain"] for r in rows)),
        "mvp_routing_counts": dict(sorted(Counter(r["expected_action"] for r in rows).items())),
        "mvp_in_scope_routing_counts": dict(sorted(Counter(r["expected_action"] for r in rows if r["scope_supported"]).items())),
        "candidate_scope_comparison": comparison,
        "verification": checks,
        "jsonl_sha256": hashlib.sha256((ROOT / "scenarios_10000.jsonl").read_bytes()).hexdigest(),
    }
    (ROOT / "simulation_summary.json").write_text(json.dumps(stats, ensure_ascii=False, indent=2), encoding="utf-8")
    # Small browser data: regenerate a selected story from the axes; full records stay in JSONL/CSV.
    data = {"intents": INTENTS, "profiles": PROFILES, "stresses": STRESSES,
            "actions": ACTION_TEXT, "summary": stats,
            "routes": {r["id"]: [r["expected_action"], r["decision_reason"], r["then"], r["output_type"]] for r in rows}}
    (ROOT / "explorer_data.js").write_text("window.COMPASS_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
    lines = ["# 30 trường hợp đối chiếu thiết kế", "", "Các mẫu này là giả định, không phải phỏng vấn. Xem toàn bộ 10.000 tổ hợp trong CSV/JSONL.", ""]
    ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 31, 41, 51, 61, 71, 81, 91,
           101, 206, 309, 407, 506, 608, 701, 801, 1001, 2001, 9001]
    for n in ids:
        r = rows[n - 1]
        lines.extend([f"## {r['id']}", r["user_story"], "", f"- Điều kiện: {r['given']}",
                      f"- Căn cứ thiết kế: {r['decision_reason']}", f"- Hành động: {r['then']}",
                      f"- Điều chỉnh giao diện: {r['ui_requirement']}", f"- Tránh: {r['failure_to_avoid']}", ""])
    (ROOT / "CASES_30.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
