import * as tf from '@tensorflow/tfjs';
export async function loadLSTMModel(url) {
    const model = await tf.loadLayersModel(url);
    return model;
}
// series: number[] (historical values)
export async function predictNextSteps(model, series, steps = 6) {
    // Normalization (simple)
    const mean = series.reduce((a, b) => a + b, 0) / series.length;
    const std = Math.sqrt(series.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / series.length) || 1;
    const norm = series.map(x => (x - mean) / std);
    const input = tf.tensor(norm.slice(-24)).reshape([1, Math.min(24, norm.length), 1]);
    let preds = [];
    let lastInput = input;
    for (let i = 0; i < steps; i++) {
        // predict next
        // @ts-ignore
        const out = model.predict(lastInput);
        const v = (await out.data())[0];
        preds.push(v * std + mean);
        // shift input window
        const arr = await lastInput.array();
        const row = arr[0].map(r => r[0]);
        row.push(v);
        row.shift();
        lastInput = tf.tensor(row).reshape([1, row.length, 1]);
    }
    return preds;
}
