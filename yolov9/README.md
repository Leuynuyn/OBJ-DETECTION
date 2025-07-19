# **Object Detection Web Application with Flask, YOLOv9, and NextJS**

*Đây là backend của ứng dụng web tích hợp AI để phát hiện đối tượng, sử dụng mô hình YOLOv9 và được xây dựng bằng Flask. Dự án xử lý upload và phát hiện đối tượng từ cả hình ảnh (.jpg) và video (.mp4). Frontend được tách riêng và có thể tìm thấy tại repository sau: <a>https://github.com/Leuynuyn/OBJ-DETECTION</a>.*

---

## **Yêu cầu hệ thống**
- Python 3.12 hoặc cao hơn (cho backend)

---

## **Cấu trúc dự án**
- `webapp.py`: Xử lý upload và phát hiện đối tượng với YOLOv9.
- `requirements.txt`: Danh sách dependencies Python.
- `uploads` và `runs/detect`: Thư mục lưu trữ file tạm và kết quả.

---

## **Cài đặt và chạy ứng dụng**

### **1. Cài đặt dependencies**

- **Cài đặt Python dependencies:**
+ Mở terminal hoặc command prompt.
+ Điều hướng đến thư mục dự án (ví dụ: `cd/Object-Detection-Web-Application-with-Flask-and-YOLOv9`).
+ Tạo virtual environment (tùy chọn nhưng khuyến nghị): 
    ```
    python -m venv venv 
    source venv/bin/activate # Trên Linux/Mac
    venv\Scripts\activate # Trên Windows
    ```
+ Cài đặt các thư viện từ `requirements.txt`:
    ```
    pip install -r requirements.txt
    ```
+ Lưu ý: File `requirements.txt` đã bao gồm `ultralytics`, `Flask`, `flask-cors`, `opencv-python`, và các dependency cần thiết.

### **2. Chạy backend**

- Mở terminal, kích hoạt virtual environment (nếu dùng).
- Điều hướng đến thư mục chứa `webapp.py`:
```
cd /Object-Detection-Web-Application-with-Flask-and-YOLOv9
```
- Chạy ứng dụng Flask: 
```
python webapp.py
```
- Ứng dụng sẽ chạy trên `http://localhost:5000`.
- Lưu ý: Để ứng dụng hoạt động hoàn chỉnh, frontend cần được chạy đồng thời (xem repository frontend tại <a>https://github.com/Leuynuyn/OBJ-DETECTION</a>).

## **Lưu ý**

- Đảm bảo thư mục `uploads` và `runs/detect` có quyền ghi (thực hiện `chmod -R 755 uploads runs/detect` nếu cần).
- Trong môi trường local, cả Flask và NextJS chạy trên HTTP để tránh xung đột giao thức. Khi triển khai production, hãy cấu hình HTTPS với SSL certificate (như Let's Encrypt).
- Nếu gặp lỗi, kiểm tra log từ terminal Flask.

---

## **Tài liệu tham khảo**

- Xem video để hiểu code: <a>https://youtu.be/ObKSM6ftQ4c</a>
---

## **Hình ảnh minh họa**

<img> https://github.com/AarohiSingla/Object-Detection-Web-Application-with-Flask-and-YOLOv9/assets/60029146/d1c5eb0f-3b62-41a1-8305-bd76005e0cd9</img>