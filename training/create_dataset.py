import os  # Import operating system module for directory and file operations
import pickle  # Import pickle module for serializing and saving Python objects
import mediapipe as mp  # Import MediaPipe for hand landmark detection
import cv2  # Import OpenCV for image processing
import matplotlib.pyplot as plt  # Import Matplotlib for potential plotting (though not used in this script)

# Initialize MediaPipe hands solutions
mp_hands = mp.solutions.hands  # Access MediaPipe hands module
mp_drawing = mp.solutions.drawing_utils  # Utility for drawing hand landmarks
mp_drawing_styles = mp.solutions.drawing_styles  # Styles for drawing landmarks

# Create a Hands object for static image processing
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

DATA_DIR = './data'  # Set the directory containing user hand gesture images

# Initialize lists to store processed data
data = []  # Will store hand landmark coordinates
labels = []  # Will store corresponding letter labels
users = []  # Will store corresponding user names

# Iterate through each user directory in the data folder
for user_dir in os.listdir(DATA_DIR):
    user_path = os.path.join(DATA_DIR, user_dir)  # Create full path to user directory
    if os.path.isdir(user_path):  # Check if path is a directory
        print(f"Processing user: {user_dir}")  # Print current user being processed
        
        # Iterate through each letter directory for the current user
        for letter_dir in os.listdir(user_path):
            letter_path = os.path.join(user_path, letter_dir)  # Create full path to letter directory
            if os.path.isdir(letter_path):  # Check if path is a directory
                print(f"Processing letter: {letter_dir}")  # Print current letter being processed
                
                # Iterate through each image in the letter directory
                for img_path in os.listdir(letter_path):
                    data_aux = []  # Temporary list to store normalized coordinates
                    x_ = []  # Temporary list to store x coordinates
                    y_ = []  # Temporary list to store y coordinates

                    img = cv2.imread(os.path.join(letter_path, img_path))  # Read image
                    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert image to RGB

                    # Process the image to detect hand landmarks
                    results = hands.process(img_rgb)
                    if results.multi_hand_landmarks:  # Check if hand landmarks are detected
                        for hand_landmarks in results.multi_hand_landmarks:
                            data_aux = []  # Reset temporary data list
                            x_ = []  # Reset x coordinates
                            y_ = []  # Reset y coordinates

                            # Check if complete hand landmark set is detected
                            if len(hand_landmarks.landmark) == 21:
                                # Collect x and y coordinates
                                for i in range(21):
                                    x = hand_landmarks.landmark[i].x
                                    y = hand_landmarks.landmark[i].y
                                    x_.append(x)
                                    y_.append(y)

                                # Normalize coordinates relative to minimum x and y
                                for i in range(21):
                                    x = hand_landmarks.landmark[i].x
                                    y = hand_landmarks.landmark[i].y
                                    data_aux.append(x - min(x_))
                                    data_aux.append(y - min(y_))

                                # Ensure we have 42 coordinates (21 * 2)
                                if len(data_aux) == 42:
                                    data.append(data_aux)  # Add normalized coordinates
                                    labels.append(letter_dir)  # Add corresponding letter
                                    users.append(user_dir)  # Add corresponding user

# Print summary statistics
print(f"Total samples collected: {len(data)}")
print(f"Unique users: {len(set(users))}")
print(f"Unique labels: {len(set(labels))}")

# Save processed data to a pickle file
f = open('data.pickle', 'wb')  # Open file in write-binary mode
pickle.dump({'data': data, 'labels': labels, 'users': users}, f)  # Save data dictionary
f.close()  # Close the file