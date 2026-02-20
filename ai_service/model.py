"""Model loader and inference wrapper.
Attempts to load a TensorFlow LSTM model from ./models/lstm_model. If TensorFlow is not installed
or the model is missing, falls back to the naive predictor in predict_utils.py.
"""
from typing import List
import os
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'lstm_model')

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except Exception:
    tf = None
    TF_AVAILABLE = False

from predict_utils import naive_predict

class ModelWrapper:
    def __init__(self):
        self.model = None
        if TF_AVAILABLE:
            try:
                if os.path.exists(MODEL_PATH):
                    self.model = tf.keras.models.load_model(MODEL_PATH)
                else:
                    self.model = None
            except Exception as e:
                print('Failed to load TF model:', e)
                self.model = None

    def predict(self, history: List[float], steps: int = 6) -> List[float]:
        if self.model is None:
            return naive_predict(np.array(history), steps=steps)

        # normalize using mean/std of input
        arr = np.array(history, dtype=float)
        mean = arr.mean() if arr.size else 0.0
        std = arr.std() if arr.size else 1.0
        norm = (arr - mean) / (std if std else 1.0)

        # ensure window length
        window = min(24, norm.size)
        x = norm[-window:]
        x = x.reshape((1, x.shape[0], 1)).astype('float32')

        preds = []
        xi = x
        for i in range(steps):
            out = self.model.predict(xi)
            v = float(out.flatten()[0])
            preds.append(v * std + mean)
            # shift window
            row = xi.flatten().tolist()[-(window-1):] if window > 1 else []
            row.append(v)
            xi = np.array(row).reshape((1, len(row), 1)).astype('float32')

        return [float(max(0.0, p)) for p in preds]


_MODEL = ModelWrapper()

def predict(history: List[float], steps: int = 6):
    return _MODEL.predict(history, steps=steps)


if __name__ == '__main__':
    # quick smoke test
    print('TF available:', TF_AVAILABLE)
    print(predict([10, 12, 14, 13, 15, 20, 25], steps=6))
