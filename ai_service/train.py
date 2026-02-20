"""Train a simple LSTM on synthetic or provided CSV data and export model to ./models/lstm_model

This script will:
- Look for `data.csv` in the same folder (columns: pm25, optional others). If missing, it will synthesize sample series.
- Train a small LSTM to predict next-step PM2.5 from a sliding window and export a Keras model to `models/lstm_model`.
"""
import os
import numpy as np
import pandas as pd
from tensorflow import keras
from tensorflow.keras import layers

ROOT = os.path.dirname(__file__)
DATA_PATH = os.path.join(ROOT, 'data.csv')
MODEL_DIR = os.path.join(ROOT, 'models', 'lstm_model')
os.makedirs(MODEL_DIR, exist_ok=True)

def load_series():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        if 'pm25' in df.columns:
            return df['pm25'].astype(float).values
        else:
            # try first numeric column
            for c in df.columns:
                if np.issubdtype(df[c].dtype, np.number):
                    return df[c].astype(float).values
    # synthesize
    t = np.linspace(0, 200, 2000)
    series = 20 + 15 * np.sin(0.03 * t) + 5 * np.random.randn(t.size)
    series = np.clip(series, 0, None)
    return series

def make_dataset(series, window=24):
    X, y = [], []
    for i in range(len(series) - window):
        X.append(series[i:i+window])
        y.append(series[i+window])
    X = np.array(X)
    y = np.array(y)
    X = X.reshape((X.shape[0], X.shape[1], 1))
    return X, y

def build_model(window=24):
    model = keras.Sequential([
        layers.Input(shape=(window, 1)),
        layers.LSTM(64, return_sequences=False),
        layers.Dense(32, activation='relu'),
        layers.Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def train():
    series = load_series()
    mean = series.mean()
    std = series.std() if series.std() > 0 else 1.0
    norm = (series - mean) / std

    window = 24
    X, y = make_dataset(norm, window=window)

    model = build_model(window=window)
    model.summary()
    model.fit(X, y, epochs=10, batch_size=32, validation_split=0.1)

    # Save model and normalization params
    model.save(MODEL_DIR)
    np.save(os.path.join(MODEL_DIR, 'norm_mean.npy'), np.array([mean]))
    np.save(os.path.join(MODEL_DIR, 'norm_std.npy'), np.array([std]))
    print('Model exported to', MODEL_DIR)

if __name__ == '__main__':
    train()
