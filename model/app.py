import base64
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import os
import tensorflow as tf
import tensorflow_hub as hub
import cv2
import numpy as np
from mark_detector import MarkDetector  # Ensure these modules are available
from pose_estimator import PoseEstimator

app = Flask(__name__)

multiple_people_detector = hub.load("https://tfhub.dev/tensorflow/efficientdet/d0/1")


def readb64(uri):
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return img


@app.route('/predict_pose', methods=['GET', 'POST'])
def predict_pose():
    data = request.get_json(force=True)
    image = r'{}'.format(data['img'])
    print(type(image), image)
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
        img = list(img)
        return jsonify({'img': 'face found', 'pose': pose})
    else:
        return jsonify({'message': 'face not found', 'img': 'img'})


@app.route('/predict_people', methods=['GET', 'POST'])
def predict():
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


@app.route('/save_img', methods=['GET', 'POST'])
def save():
    data = request.get_json(force=True)
    image = r'{}'.format(data['img'])
    user = data['user']
    image = readb64(image)
    base_dir = os.getcwd()
    path = r"{}\images\{}.jpg".format(base_dir, user[0:-10])
    print(path)
    plt.imsave(image, path)
    return jsonify({'path': path})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
