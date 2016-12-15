export function average (data) {
  let average = []
  for (let i = 0; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j <= i; j++) {
      sum += data[j]['close']
    }
    average.push({value: sum / (i + 1), time: data[i].time})
  }
  return average
}
