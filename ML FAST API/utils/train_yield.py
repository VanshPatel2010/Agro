import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os

# --- Configuration ---
PKL_FILE_PATH = 'ML FAST API/Pickle/Yield_final.pkl'

# Define which columns are categorical and which are numerical
# IMPORTANT: Update these lists to match your GUJARAT.csv file!
TARGET_COLUMN = 'Production' # The column you want to predict

# Features (the inputs to the model)
categorical_features = ['State_Name', 'District_Name', 'Season', 'Crop']
numerical_features = ['Crop_Year', 'Area', 'N', 'P', 'K', 'PH', 'TEM']

# --- Main Training Function ---
CSV_FILE_PATH = 'ML FAST API/Data/GUJARAT.csv'
#
# REPLACE your train_and_save_model function with this one:
#
def train_and_save_model():
    print(f"Loading data from {CSV_FILE_PATH}...")
    try:
        df = pd.read_csv(CSV_FILE_PATH)
    except FileNotFoundError:
        print(f"Error: Could not find the file at {CSV_FILE_PATH}")
        print("Please make sure your CSV file is in the 'Data' folder.")
        return
    except Exception as e:
        print(f"An error occurred loading the CSV: {e}")
        return

    # Check if all required columns exist
    all_features = categorical_features + numerical_features
    required_cols = all_features + [TARGET_COLUMN]
    missing_cols = [col for col in required_cols if col not in df.columns]

    if missing_cols:
        print(f"\nError: Your CSV file is missing the following required columns:")
        for col in missing_cols:
            print(f"- {col}")
        print("Please update the 'categorical_features', 'numerical_features', or 'TARGET_COLUMN' variables in this script.")
        return

    print("Data loaded successfully.")

    # --- THIS IS THE NEW LINE ---
    # Drop any rows where the target 'Production' value is missing
    initial_rows = len(df)
    df = df.dropna(subset=[TARGET_COLUMN])
    final_rows = len(df)
    if initial_rows > final_rows:
        print(f"Dropped {initial_rows - final_rows} rows with missing 'Production' values.")
    # --- END OF NEW CODE ---


    # 1. Define X (features) and y (target)
    X = df[all_features]
    y = df[TARGET_COLUMN]

    # 2. Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Data split: {len(X_train)} training samples, {len(X_test)} test samples.")

    # 3. Create preprocessing pipelines
    # Pipeline for numerical data
    numeric_transformer = Pipeline(steps=[
        ('scaler', StandardScaler())
    ])

    # Pipeline for categorical data
    categorical_transformer = Pipeline(steps=[
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # 4. Combine pipelines using ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numerical_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    # 5. Create the final model pipeline
    # This chains the preprocessor and the regression model
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
    ])

    # 6. Train the model
    print("Training the model... (This may take a few minutes)")
    model_pipeline.fit(X_train, y_train)
    print("Model training complete.")

    # 7. Evaluate the model (optional, but good practice)
    print("\nModel Evaluation:")
    y_pred = model_pipeline.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    print(f"  R-squared (R2) on test data: {r2:.4f}")
    
    # 8. Save the model to a .pkl file
    # Ensure the 'Pickle' directory exists
    os.makedirs(os.path.dirname(PKL_FILE_PATH), exist_ok=True)
    
    with open(PKL_FILE_PATH, 'wb') as f:
        pickle.dump(model_pipeline, f)
        
    print(f"\nSuccess! New model saved to {PKL_FILE_PATH}")
    print("You can now restart your FastAPI server.")

# --- Run the script ---
if __name__ == "__main__":
    train_and_save_model()