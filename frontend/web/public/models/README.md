Place a TF.js-converted model here to enable in-browser predictions.

To convert a Keras model to TensorFlow.js format:

```bash
pip install tensorflowjs
tensorflowjs_converter --input_format=keras_saved_model /path/to/keras_model /path/to/frontend/web/public/models
```

After placing `model.json` and shard files under `public/models/`, the frontend will load it automatically.
