import pickle
import os
import mediapipe as mp
import numpy as np
import cv2

model_dict = pickle.load(open('./model.p', 'rb'))
model = model_dict['model']

print("Model loaded successfully!")
if hasattr(model, 'n_estimators'):
    print(f"Using Random Forest with {model.n_estimators} trees")
print("This model was trained on combined data from multiple users")

# Initialize camera
cap = cv2.VideoCapture(0) # Change this if camera isn't found

success, frame = cap.read()
if success:
    H, W, _ = frame.shape
else:
    print("Failed to get frame dimensions")
    exit()

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Modify hands initialization to include image dimensions
hands = mp_hands.Hands(
    static_image_mode=True,
    min_detection_confidence=0.3,
    model_complexity=0,  # Use simpler model
    min_tracking_confidence=0.5)

# Add these lines to configure MediaPipe
mp.solutions.drawing_utils.DrawingSpec(thickness=1, circle_radius=1)

while True:

    data_aux = []
    x_ = []
    y_ = []

    ret, frame = cap.read()

    H, W, _ = frame.shape

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = hands.process(frame_rgb)
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame,
                hand_landmarks,
                mp_hands.HAND_CONNECTIONS,
                mp_drawing_styles.get_default_hand_landmarks_style(),
                mp_drawing_styles.get_default_hand_connections_style())

            # Reset data arrays for each hand
            data_aux = []
            x_ = []
            y_ = []

            # Collect coordinates
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                x_.append(x)
                y_.append(y)

            # Create normalized feature vector
            for i in range(len(hand_landmarks.landmark)):
                x = hand_landmarks.landmark[i].x
                y = hand_landmarks.landmark[i].y
                data_aux.append(x - min(x_))
                data_aux.append(y - min(y_))

            # Make prediction only if we have the correct number of features
            if len(data_aux) == 42:  # MediaPipe hands has 21 landmarks * 2 (x,y)
                prediction = model.predict([np.asarray(data_aux)])
                predicted_character = prediction[0]

                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10
                x2 = int(max(x_) * W) - 10
                y2 = int(max(y_) * H) - 10

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                cv2.putText(frame, predicted_character, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3,
                            cv2.LINE_AA)

    cv2.imshow('frame', frame)
    cv2.waitKey(1)


cap.release()
cv2.destroyAllWindows()
