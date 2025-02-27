import os   # Import the operating system module for file and directory operations
import cv2  # Import OpenCV library for computer vision and image processing

number_of_letters = 26  # Set the total number of letters to collect data for (A-Z)
dataset_size = 100      # Number of images to collect for each letter
camera_index = 0        # Index of the camera to use (0 is typically the default camera)

# Create a dictionary mapping numbers 0-25 to uppercase letters A-Z
LETTER_DICT = {i: chr(65 + i) for i in range(26)}  # Uses ASCII value to convert numbers to letters

# Set the username for data collection
USER_NAME = "user"  # User-specific identifier for the dataset

# Define directories for storing image datasets
DATA_DIR = './data'  # Base directory for all user datasets
USER_DIR = os.path.join(DATA_DIR, USER_NAME)  # Create a directory specific to the user

# Create directories if they don't exist
if not os.path.exists(DATA_DIR):  # Check if main data directory exists
    os.makedirs(DATA_DIR)         # Create main data directory if it doesn't exist
if not os.path.exists(USER_DIR):  # Check if user-specific directory exists
    os.makedirs(USER_DIR)         # Create user-specific directory if it doesn't exist

# Open the camera for capturing images
cap = cv2.VideoCapture(camera_index)  # Initialize video capture from the specified camera
if not cap.isOpened():                # Check if camera is successfully opened
    raise RuntimeError(f"Failed to open camera with index {camera_index}. Please check if the camera is connected and accessible.")
print(f"Using camera index: {camera_index}")     # Print the camera index being used
print(f"Collecting data for user: {USER_NAME}")  # Print the username for data collection

# Iterate through all letters (A-Z)
for j in range(number_of_letters):
    letter = LETTER_DICT[j]                      # Get the current letter from the dictionary
    letter_dir = os.path.join(USER_DIR, letter)  # Create a directory for the specific letter
    if not os.path.exists(letter_dir):           # Check if letter directory exists
        os.makedirs(letter_dir)                  # Create letter directory if it doesn't exist
    
    # Count existing image files for the current letter
    existing_files = len([f for f in os.listdir(letter_dir) if f.endswith('.jpg')])
    
    # Skip letter if it already has the required number of images
    if existing_files >= dataset_size:
        print(f'Skipping letter {letter} - already has {existing_files} images')
        continue
        
    # Print progress information for the current letter
    print(f'Collecting data for user {USER_NAME}, letter {letter} ({j + 1}/{number_of_letters})')
    print(f'Need to collect {dataset_size - existing_files} more images')

    # Wait for user to press 'Q' to start capturing images for the current letter
    done = False
    while True:
        ret, frame = cap.read()  # Capture a frame from the camera
        # Display instructions on the frame
        cv2.putText(frame, f'User: {USER_NAME} - Letter {letter} - Press "Q" to start!', 
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3,
                    cv2.LINE_AA)
        cv2.imshow('frame', frame)       # Show the frame
        if cv2.waitKey(25) == ord('q'):  # Wait for 'Q' key press
            break

    # Capture images for the current letter
    counter = existing_files       # Start counting from existing files
    while counter < dataset_size:
        ret, frame = cap.read()    # Capture a frame from the camera
        # Display progress on the frame
        cv2.putText(frame, f'Capturing {counter}/{dataset_size}', 
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 3,
                    cv2.LINE_AA)
        cv2.imshow('frame', frame) # Show the frame
        cv2.waitKey(25)            # Small delay between frames
        # Create a unique filename for the image
        filename = f'{USER_NAME}_{letter}_{counter}.jpg'
        # Save the frame as an image
        cv2.imwrite(os.path.join(letter_dir, filename), frame)
        counter += 1  # Increment the counter

# Release the camera and close all windows
cap.release()  # Release the camera
cv2.destroyAllWindows()  # Close all OpenCV windows