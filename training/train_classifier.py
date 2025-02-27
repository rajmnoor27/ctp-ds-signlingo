import pickle  # Import pickle to load and save serialized objects
from sklearn.ensemble import RandomForestClassifier  # Import Random Forest classifier
from sklearn.model_selection import train_test_split  # Import function to split data
from sklearn.metrics import accuracy_score, classification_report  # Import metrics for model evaluation
import numpy as np  # Import NumPy for numerical operations

print("Loading data from pickle file...")  # Print status message
data_dict = pickle.load(open('./data.pickle', 'rb'))  # Load data from pickle file

# Convert data, labels, and users to NumPy arrays
data = np.asarray(data_dict['data'])
labels = np.asarray(data_dict['labels'])
users = np.asarray(data_dict['users'])

# Print dataset statistics
print("\nDataset Statistics:")
print(f"Total samples: {len(data)}")
print(f"Users in dataset: {', '.join(np.unique(users))}")
print(f"Number of users: {len(np.unique(users))}")
print(f"Letters in dataset: {', '.join(np.unique(labels))}")
print(f"Samples per letter:")
for letter in np.unique(labels):
    count = len([l for l in labels if l == letter])
    print(f"  {letter}: {count} samples")

print("\nSplitting data into training and testing sets...")
# Split data into training and testing sets
# test_size=0.1 means 10% of data used for testing
# shuffle=True randomizes the data
# stratify=labels ensures proportional representation of each letter in train/test sets
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.1, shuffle=True, stratify=labels)
print(f"Training samples: {len(x_train)}")
print(f"Testing samples: {len(x_test)}")

print("\nInitializing Random Forest Classifier...")
# Create a Random Forest Classifier with default parameters
model = RandomForestClassifier()

print("Training model...")
# Train the model on the training data
model.fit(x_train, y_train)

print("\nMaking predictions on test set...")
# Use the trained model to make predictions on the test data
y_predict = model.predict(x_test)

# Calculate overall accuracy
score = accuracy_score(y_predict, y_test)
print('\nResults:')
print(f'{score * 100:.2f}% of samples were classified correctly!')

# Print detailed classification metrics
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_predict))

print("\nSaving model to 'model.p'...")
# Save the trained model to a pickle file
f = open('model.p', 'wb')
pickle.dump({'model': model}, f)
f.close()
print("Model saved successfully!")

# Optional: Calculate accuracy for each user
print("\nPer-user accuracy:")
# Get users corresponding to the test set
users_test = users[np.array(range(len(data)))[len(x_train):]]
for user in np.unique(users):
    # Create a mask for the current user's samples in the test set
    user_mask = users_test == user
    if np.any(user_mask):
        # Calculate accuracy for the current user
        user_score = accuracy_score(y_test[user_mask], y_predict[user_mask])
        print(f"{user}: {user_score * 100:.2f}%")