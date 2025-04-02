from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Tüm domainlerden gelen isteklere izin verir

def process_image(image, width, height, rotation, flip_horizontal, flip_vertical, crop_x, crop_y, crop_width, crop_height):
    # Resmi Pillow ile aç
    img = Image.open(image)

    # Boyutlandırma
    if width and height:
        try:
            img = img.resize((int(width), int(height)))
        except Exception as e:
            print("Resize error:", e)

    # Kullanıcının belirttiği döndürme açısını uygula
    try:
        rotation_value = float(rotation) if rotation.strip() != "" else 0.0
        if rotation_value:
            img = img.rotate(-rotation_value, expand=True)
    except Exception as e:
        print("Rotation error:", e)

    # Yan yatırma (flip) işlemi:
    flip_h = str(flip_horizontal).lower() == 'true'
    flip_v = str(flip_vertical).lower() == 'true'

    if flip_h and not flip_v:
        img = img.rotate(-90, expand=True)
    elif flip_v and not flip_h:
        img = img.rotate(90, expand=True)
    elif flip_h and flip_v:
        img = img.rotate(180, expand=True)

    # Kırpma işlemi (debug çıktıları ile)
    # crop_x ve crop_y için varsayılan olarak "0" değeri kullanılır.
    if crop_width != '' and crop_height != '':
        try:
            print("Original image size:", img.size)
            crop_box = (
                int(crop_x),
                int(crop_y),
                int(crop_x) + int(crop_width),
                int(crop_y) + int(crop_height)
            )
            print("Crop box:", crop_box)
            img = img.crop(crop_box)
            print("Cropped image size:", img.size)
        except Exception as e:
            print("Crop error:", e)

    return img

@app.route('/process-image', methods=['POST'])
def process_image_route():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "Resim dosyası bulunamadı"}), 400

        image_file = request.files['image']

        width = request.form.get('width')
        height = request.form.get('height')
        rotation = request.form.get('rotation', "0")
        flip_horizontal = request.form.get('flipHorizontal', 'false')
        flip_vertical = request.form.get('flipVertical', 'false')
        # cropX ve cropY boşsa varsayılan olarak "0" kullanılıyor.
        crop_x = request.form.get('cropX') or '0'
        crop_y = request.form.get('cropY') or '0'
        crop_width = request.form.get('cropWidth')
        crop_height = request.form.get('cropHeight')

        print("Form data received:", request.form)

        processed_img = process_image(
            image_file,
            width, height,
            rotation,
            flip_horizontal, flip_vertical,
            crop_x, crop_y,
            crop_width, crop_height
        )

        img_io = io.BytesIO()
        processed_img.save(img_io, 'PNG')
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')
    
    except Exception as e:
        print("Processing error:", e)
        return jsonify({"error": "İşleme sırasında hata oluştu", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
