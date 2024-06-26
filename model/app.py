import base64
import logging
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import os
import tensorflow as tf
import tensorflow_hub as hub
import cv2
import shutil
import numpy as np
from mark_detector import MarkDetector
from pose_estimator import PoseEstimator

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

# Clear the TensorFlow Hub cache
cache_dir = "C:/Users/HP/AppData/Local/Temp/tfhub_modules"
shutil.rmtree(cache_dir, ignore_errors=True)

# Load the model
try:
    multiple_people_detector = hub.load("https://tfhub.dev/tensorflow/efficientdet/d0/1")
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise e

@app.route('/')
def home():
    return "Welcome to the Pose and People Detection API!"

def readb64(uri):
   encoded_data = uri.split(',')[1]
   nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
   img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
   img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
   return img

@app.route('/predict_pose', methods=['GET', 'POST'])
def predict_pose():
    try:
        data = request.get_json(force=True)
        image = r'{}'.format(data['img'])
        image = readb64(image)
        plt.imshow(image)
        height, width = image.shape[0], image.shape[1]
        pose_estimator = PoseEstimator(img_size=(height, width))
        mark_detector = MarkDetector()

        facebox = mark_detector.extract_cnn_facebox(image)
        frame = image
        if facebox is not None:
            x1, y1, x2, y2 = facebox
            face_img = frame[y1: y2, x1: x2]
            marks = mark_detector.detect_marks(face_img)
            marks *= (x2 - x1)
            marks[:, 0] += x1
            marks[:, 1] += y1
            pose = pose_estimator.solve_pose_by_68_points(marks)
            img, pose = pose_estimator.draw_annotation_box(frame, pose[0], pose[1], color=(0, 255, 0))
            img = img.tolist()
            return jsonify({'img': 'face found', 'pose': pose})
        else:
            return jsonify({'message': 'face not found', 'img': 'img'})
    except Exception as e:
        logging.error(f"Error in /predict_pose: {e}")
        return jsonify({'error': str(e)})

@app.route('/predict_people', methods=['GET', 'POST'])
def predict():
    try:
        data = request.get_json(force=True)
        image = readb64(data['img'])
        im_width, im_height = image.shape[0], image.shape[1]
        image = image.reshape((1, image.shape[0], image.shape[1], 3))
        data = multiple_people_detector(image)

        boxes = data['detection_boxes'].numpy()[0]
        classes = data['detection_classes'].numpy()[0]
        scores = data['detection_scores'].numpy()[0]

        threshold = 0.5
        people = 0
        for i in range(int(data['num_detections'][0])):
            if classes[i] == 1 and scores[i] > threshold:
                people += 1
                ymin, xmin, ymax, xmax = boxes[i]
                (left, right, top, bottom) = (xmin * im_width, xmax * im_width,
                                              ymin * im_height, ymax * im_height)
        return jsonify({'people': int(people), 'image': 'image'})
    except Exception as e:
        logging.error(f"Error in /predict_people: {e}")
        return jsonify({'error': str(e)})

@app.route('/save_img', methods=['GET', 'POST'])
def save():
    try:
        data = request.get_json(force=True)
        image = r'{}'.format(data['img'])
        user = data['user']
        image = readb64(image)
        base_dir = os.getcwd()
        path = os.path.join(base_dir, "images", f"{user[:-10]}.jpg")
        print(path)
        plt.imsave(path, image)
        return jsonify({'path': path})
    except Exception as e:
        logging.error(f"Error in /save_img: {e}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
