import numpy as np

def naive_predict(history: np.ndarray, steps: int = 6):
    """
    Fallback predictor: uses simple exponential smoothing + trend extrapolation.
    Designed as a safe demo when no TF model is available.
    """
    if len(history) == 0:
        return [0.0]*steps

    alpha = 0.3
    level = history[0]
    trend = 0.0
    # Holt's linear method (simple)
    for i in range(1, len(history)):
        prev_level = level
        level = alpha * history[i] + (1 - alpha) * (level + trend)
        trend = 0.1 * (level - prev_level) + 0.9 * trend

    preds = []
    for h in range(1, steps+1):
        preds.append(level + trend * h)

    # ensure non-negative
    preds = [float(max(0.0, p)) for p in preds]
    return preds
