import argparse
from PIL import Image
import torch
import cv2
import numpy as np
import imghdr
from flask import Flask, request, Response, url_for, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import time
from ultralytics import YOLO
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

basepath = os.path.dirname(__file__)
print("Basepath:", basepath)  # Debug thư mục chứa webapp.py
UPLOAD_FOLDER = os.path.join(basepath, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

RUNS_DETECT_FOLDER = os.path.join(basepath, 'runs/detect')
if not os.path.exists(RUNS_DETECT_FOLDER):
    os.makedirs(RUNS_DETECT_FOLDER)

@app.route("/api/upload", methods=["POST"])
def predict_img():
    print("Request headers:", request.headers)
    print("Request files:", request.files)
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, secure_filename(f.filename))
    print("upload folder is ", filepath)
    f.save(filepath)
    f.close()  # Đảm bảo flush file
    print("File saved, checking existence:", os.path.exists(filepath))  # Debug
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found after saving at " + filepath}), 500

    # Kiểm tra quyền đọc
    try:
        with open(filepath, 'rb') as test_file:
            content = test_file.read()  # Đọc toàn bộ nội dung
            print("File readable, size:", len(content), "bytes")
    except IOError as e:
        print("File read error:", str(e))
        return jsonify({"error": "Cannot read file due to IO error: " + str(e)}), 400

    file_extension = f.filename.rsplit('.', 1)[1].lower()
    if file_extension == 'jpg':
        # Kiểm tra định dạng thực tế
        img_type = imghdr.what(filepath)
        print("Detected image type:", img_type)
        if img_type not in ['jpeg', 'jpg']:
            return jsonify({"error": "File is not a valid JPEG image (detected as " + str(img_type) + "). Please upload a valid .jpg file or install AVIF support if using AVIF format."}), 400

        img = cv2.imread(filepath)
        print("Image loaded with cv2:", "Yes" if img is not None else "No")  # Debug
        if img is None:
            try:
                pil_img = Image.open(filepath)
                pil_img.verify()  # Kiểm tra tính toàn vẹn
                print("Image verified with PIL:", "Yes")
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)  # Chuyển sang định dạng OpenCV
            except Exception as e:
                print("PIL verification error:", str(e))
                return jsonify({"error": "Image file corrupted or unsupported format: " + str(e)}), 400
        model = YOLO('yolov9c.pt')
        print("Current working directory:", os.getcwd())  # Debug thư mục hiện tại
        print("Using save_dir:", RUNS_DETECT_FOLDER)  # Debug save_dir
        detections = model(img, save=True, save_dir=RUNS_DETECT_FOLDER, project=RUNS_DETECT_FOLDER)  # Ép buộc project và save_dir
        print("Detection completed, results:", detections)  # Debug
        print("Results saved to:", detections[0].save_dir)  # Debug nơi lưu thực tế
        folder_path = RUNS_DETECT_FOLDER
        subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]
        if not subfolders:
            return jsonify({"error": "No detection results found"}), 500
        latest_subfolder = max(subfolders, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))
        print("Latest subfolder:", latest_subfolder)  # Debug
        predict_dir = os.path.join(folder_path, latest_subfolder)
        image_files = [f for f in os.listdir(predict_dir) if f.endswith(('.jpg', '.jpeg'))]
        if not image_files:
            return jsonify({"error": "No image files found in " + predict_dir}), 404
        latest_image = max(image_files, key=lambda x: os.path.getctime(os.path.join(predict_dir, x)))
        image_path = os.path.join(predict_dir, latest_image)
        print("Generated image path:", image_path)  # Debug
        if not os.path.exists(image_path):
            return jsonify({"error": "Detection result file not found at " + image_path}), 404
        rel_path = os.path.relpath(image_path, basepath)
        print("Relative path:", rel_path)  # Debug
        full_url = f"http://localhost:5000/{rel_path}"
        print("Full URL:", full_url)  # Debug
        return jsonify({'result_url': full_url})

    elif file_extension == 'mp4':
        video_path = filepath
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return jsonify({"error": "Failed to open video file"}), 400
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        output_path = os.path.join(basepath, 'output.mp4')
        if os.path.exists(output_path):
            os.remove(output_path)
        out = cv2.VideoWriter(output_path, fourcc, 30.0, (frame_width, frame_height))
        model = YOLO('yolov9c.pt')

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            # Chỉ detect, không lưu ảnh riêng lẻ
            results = model(frame)
            res_plotted = results[0].plot()
            out.write(res_plotted)
        cap.release()
        out.release()
        feed_url = f"http://localhost:5000/video_feed?t={int(time.time())}"
        print("Video saved to:", output_path)  # Debug
        return jsonify({'result_url': feed_url})

    return jsonify({'error': 'Unsupported file format'}), 400

@app.route('/<path:filename>')
def display(filename):
    folder_path = RUNS_DETECT_FOLDER
    subfolders = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]
    if not subfolders:
        return jsonify({'error': 'No detection results found'}), 404
    latest_subfolder = max(subfolders, key=lambda x: os.path.getctime(os.path.join(folder_path, x)))
    directory = os.path.join(folder_path, latest_subfolder)
    print("printing directory:", directory)
    files = os.listdir(directory)
    if not files:
        return jsonify({'error': 'No files found in directory'}), 404
    latest_file = max(files, key=lambda x: os.path.getctime(os.path.join(directory, x)))
    return send_from_directory(directory, latest_file, environ=request.environ)

def get_frame():
    mp4_files = os.path.join(basepath, 'output.mp4')
    video = cv2.VideoCapture(mp4_files)
    while True:
        success, image = video.read()
        if not success:
            break
        ret, jpeg = cv2.imencode('.jpg', image)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
        time.sleep(0.1)

@app.route("/video_feed")
def video_feed():
    return Response(get_frame(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask app exposing yolov9 models")
    parser.add_argument("--port", default=5000, type=int, help="port number")
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port)
