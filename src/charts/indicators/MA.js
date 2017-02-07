export function average (data) {
  let average = []
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i]['close']
    average.push({value: sum / (i + 1), time: data[i].time})
  }
  return average
}

export function movingAverage (values, K) {
  let averages = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    let start = i - K + 1
    if (start < 0) {
      start = 0
    }
    sum += start > 0 ? values[i] - values[start - 1] : values[i]
    let avg = sum / (i - start + 1)
    avg = Math.round(avg * 10000) / 10000
    averages.push(avg)
  }
  return averages
}
