import os
import pickle

import mediapipe as mp
import cv2
import matplotlib.pyplot as plt


mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

DATA_DIR = './data'

data = []
labels = []
users = []

for user_dir in os.listdir(DATA_DIR):
    user_path = os.path.join(DATA_DIR, user_dir)
    if os.path.isdir(user_path):
        print(f"Processing user: {user_dir}")
        
        for letter_dir in os.listdir(user_path):
            letter_path = os.path.join(user_path, letter_dir)
            if os.path.isdir(letter_path):
                print(f"Processing letter: {letter_dir}")
                
                for img_path in os.listdir(letter_path):
                    data_aux = []
                    x_ = []
                    y_ = []

                    img = cv2.imread(os.path.join(letter_path, img_path))
                    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

                    results = hands.process(img_rgb)
                    if results.multi_hand_landmarks:
                        for hand_landmarks in results.multi_hand_landmarks:
                            data_aux = []
                            x_ = []
                            y_ = []

                            if len(hand_landmarks.landmark) == 21:
                                for i in range(21):
                                    x = hand_landmarks.landmark[i].x
                                    y = hand_landmarks.landmark[i].y
                                    x_.append(x)
                                    y_.append(y)

                                for i in range(21):
                                    x = hand_landmarks.landmark[i].x
                                    y = hand_landmarks.landmark[i].y
                                    data_aux.append(x - min(x_))
                                    data_aux.append(y - min(y_))

                                if len(data_aux) == 42:
                                    data.append(data_aux)
                                    labels.append(letter_dir)
                                    users.append(user_dir)

print(f"Total samples collected: {len(data)}")
print(f"Unique users: {len(set(users))}")
print(f"Unique labels: {len(set(labels))}")

f = open('data.pickle', 'wb')
pickle.dump({'data': data, 'labels': labels, 'users': users}, f)
f.close()
