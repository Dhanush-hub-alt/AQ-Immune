import * as tf from '@tensorflow/tfjs';
export async function loadClientModel(path = '/models/tfjs/model.json') {
    try {
        const model = await tf.loadLayersModel(path);
        return model;
    }
    catch (err) {
        console.warn('Failed to load client TF.js model', err);
        return null;
    }
}
export async function predictWithClientModel(model, history, steps = 6) {
    if (!model)
        return [];
    const mean = history.reduce((a, b) => a + b, 0) / Math.max(1, history.length);
    const std = Math.sqrt(history.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / Math.max(1, history.length)) || 1;
    const norm = history.map(x => (x - mean) / std);
    const window = Math.min(24, norm.length);
    let input = tf.tensor(norm.slice(-window)).reshape([1, window, 1]);
    const preds = [];
    for (let i = 0; i < steps; i++) {
        // @ts-ignore
        const out = model.predict(input);
        const v = (await out.data())[0];
        preds.push(v * std + mean);
        const arr = await input.array();
        const row = arr[0].map(r => r[0]);
        row.push(v);
        row.shift();
        input = tf.tensor(row).reshape([1, row.length, 1]);
    }
    return preds;
}
export default { loadClientModel, predictWithClientModel };
