from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

from PIL import Image
import numpy as np
from numpy.linalg import norm
import tensorflow as tf
import cv2
import os
import glob
import pickle
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from scipy.spatial.distance import euclidean
import requests
from io import BytesIO
import secrets
import shutil
import uuid

# Initialize Flask app
app = Flask(__name__,static_folder='static')
CORS(app) 
app.secret_key =secrets.token_hex(16)

# Load model and features
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tf.keras.Sequential([model, GlobalMaxPooling2D()])
feat_list = np.array(pickle.load(open('features.pkl', 'rb')))
fname = pickle.load(open('filenames.pkl', 'rb'))

def preprocess_image(img_path):
    """ Preprocess the image by resizing, denoising, and normalizing """
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))
    denoised = cv2.medianBlur(img, 5)
    normalized_image = cv2.normalize(denoised, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    return normalized_image

def extract_feat(img_array, model):
    """ Extract feature vector from an image array """
    exp_img_array = np.expand_dims(img_array, axis=0)
    pre_img = preprocess_input(exp_img_array)
    result = model.predict(pre_img).flatten()
    norm_result = result / norm(result)
    return norm_result

def download_image(url, save_path):
    print("Downloading from URL:", url)
    response = requests.get(url)
    if response.status_code == 200:
        image_data = response.content
        # Open the image with PIL, convert to RGB if necessary, and save
        with Image.open(BytesIO(image_data)) as img:
            img.save(save_path)

# Define endpoint for outfit generation
@app.route('/generate', methods=['POST'])
def generate_outfit():
    data = request.get_json()  # Get JSON data from the request
    top_files = data['top']  # Extract top image URLs
    bottom_files = data['bottom']  # Extract bottom image URLs

    uqid=str(uuid.uuid4())
    # Define folders for temporary storage
    top_folder = f'temp_top_{uqid}'
    bottom_folder = f'temp_bottom_{uqid}'
    comb_folder = f'temp_comb_{uqid}'
    output_folder = os.path.join('static', f'temp_outfit_{uqid}')

    os.makedirs(top_folder, exist_ok=True)
    os.makedirs(bottom_folder, exist_ok=True)
    os.makedirs(comb_folder, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)

    # Save and process top images
    for i, file in enumerate(top_files):
        file_path = os.path.join(top_folder, f'top_{i}.png')
        download_image(file, file_path)
        
        processed_img = preprocess_image(file_path)
        cv2.imwrite(file_path, processed_img)

    # Save and process bottom images
    for i, file in enumerate(bottom_files):
        file_path = os.path.join(bottom_folder, f'bottom_{i}.png')
        download_image(file, file_path)
        
        processed_img = preprocess_image(file_path)
        cv2.imwrite(file_path, processed_img)

    # Generate combinations
    path1 = os.path.join(top_folder, '*.png')
    path2 = os.path.join(bottom_folder, '*.png')

    k = 1
    for im in glob.glob(path1):
        img1 = cv2.imread(im)
        for im1 in glob.glob(path2):
            img2 = cv2.imread(im1)
            combined_img = cv2.vconcat([img1, img2])
            combined_img_path = os.path.join(comb_folder, f'comb_{k}.png')
            cv2.imwrite(combined_img_path, combined_img)
            k += 1

    # Calculate distances and store best matches
    path_dist = {}
    for combo_file in glob.glob(os.path.join(comb_folder, '*.png')):
        processed_combo_img = preprocess_image(combo_file)
        file_features = extract_feat(processed_combo_img, model)
        
        min_distance = float('inf')
        for m in feat_list:
            distance = euclidean(file_features, m)
            if distance < min_distance:
                min_distance = distance
        path_dist[combo_file] = min_distance

    # Sort and save top 3 outfits
    sort_path_dist = dict(sorted(path_dist.items(), key=lambda x: x[1]))
    result_images = []

    le=len(sort_path_dist)

    for i, k in enumerate(sort_path_dist.keys()):
        if i >le-2:
            break
        output_path = os.path.join(output_folder, f'outfit_{i}.png')
        imgpath = cv2.imread(k)
        cv2.imwrite(output_path, imgpath)
        result_images.append(f'temp_outfit_{uqid}/outfit_{i}.png')  # Adjust to make relative to `static`

    shutil.rmtree(top_folder, ignore_errors=True)
    shutil.rmtree(bottom_folder, ignore_errors=True)
    shutil.rmtree(comb_folder, ignore_errors=True)

    # Return the paths of the result images
    return jsonify({"result_images": result_images})

if __name__ == '__main__':
    app.run(debug=True)
