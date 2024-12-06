import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import numpy as np


print("Loading data from pickle file...")
data_dict = pickle.load(open('./data.pickle', 'rb'))

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
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.1, shuffle=True, stratify=labels)
print(f"Training samples: {len(x_train)}")
print(f"Testing samples: {len(x_test)}")

print("\nInitializing Random Forest Classifier...")
model = RandomForestClassifier()

print("Training model...")
model.fit(x_train, y_train)

print("\nMaking predictions on test set...")
y_predict = model.predict(x_test)

score = accuracy_score(y_predict, y_test)
print('\nResults:')
print(f'{score * 100:.2f}% of samples were classified correctly!')

# Print detailed classification report
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_predict))

print("\nSaving model to 'model.p'...")
f = open('model.p', 'wb')
pickle.dump({'model': model}, f)
f.close()
print("Model saved successfully!")

# Optional: Print per-user accuracy
print("\nPer-user accuracy:")
users_test = users[np.array(range(len(data)))[len(x_train):]]  # Get users for test set
for user in np.unique(users):
    user_mask = users_test == user
    if np.any(user_mask):
        user_score = accuracy_score(y_test[user_mask], y_predict[user_mask])
        print(f"{user}: {user_score * 100:.2f}%")
