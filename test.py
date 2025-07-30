import os
import json

def check_tarot_card_images(json_file_path):
    """
    Kiểm tra xem mỗi lá bài Tarot trong file JSON có file ảnh tương ứng hay không.

    Args:
        json_file_path (str): Đường dẫn đến file JSON chứa dữ liệu lá bài Tarot.
    """
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            tarot_cards = json.load(f)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file JSON tại đường dẫn '{json_file_path}'")
        return
    except json.JSONDecodeError:
        print(f"Lỗi: Không thể đọc file JSON '{json_file_path}'. Đảm bảo định dạng JSON hợp lệ.")
        return

    print(f"Bắt đầu kiểm tra file ảnh cho {len(tarot_cards)} lá bài...")
    missing_images = []

    for card in tarot_cards:
        card_id = card.get('id', 'N/A')
        image_path = card.get('image')

        if image_path:
            # Kiểm tra xem file có tồn tại không
            if not os.path.exists(image_path):
                missing_images.append(f"ID: {card_id}, Đường dẫn: {image_path}")
        else:
            missing_images.append(f"ID: {card_id}, Lỗi: Không có đường dẫn ảnh (image path) trong dữ liệu JSON.")

    if missing_images:
        print("\n--- Các file ảnh bị thiếu hoặc không hợp lệ ---")
        for item in missing_images:
            print(item)
    else:
        print("\nHoàn tất! Tất cả các file ảnh đều được tìm thấy.")

# Đường dẫn tới file JSON của bạn
json_file = 'data/json/tarot_card_all.json'

# Gọi hàm để kiểm tra
check_tarot_card_images(json_file)