from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.post("/decode")
def decode_qr():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file"}), 400

    file = request.files["file"]
    img_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"success": False, "message": "Ảnh NULL"}), 400

    detector = cv2.QRCodeDetector()
    data, pts, _ = detector.detectAndDecode(img)

    if not data:
        return jsonify({"success": False, "message": "Không đọc được QR"}), 400

    return jsonify({"success": True, "qr": data.strip()}), 200


if __name__ == "__main__":
    print("🔥 Flask decode QR chạy tại http://127.0.0.1:5000/decode")
    app.run(host="0.0.0.0", port=5000)
