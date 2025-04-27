/**
 * Metrics module for tracking and displaying performance metrics
 */

// Metrics data storage
let metricsData = {
  asr_latency: [],
  llm_network_latency: [],
  llm_first_token: [],
  tts_network_latency: [],
  tts_first_frame_latency: [],
  tts_discontinuity: [],
  interruption: []
};

/**
 * Records a metric value
 * @param {string} metric - The metric name
 * @param {number} value - The metric value
 * @param {string} roundId - The conversation round ID
 */
function recordMetric(metric, value, roundId) {
  if (metricsData.hasOwnProperty(metric)) {
    metricsData[metric].push({
      value,
      roundId
    });
    console.log(`Recorded metric: ${metric} = ${value}ms for round ${roundId}`);
  }
}

/**
 * Resets all metrics data
 */
function resetMetrics() {
  metricsData = {
    asr_latency: [],
    llm_network_latency: [],
    llm_first_token: [],
    tts_network_latency: [],
    tts_first_frame_latency: [],
    tts_discontinuity: [],
    interruption: []
  };
}

/**
 * Calculates and displays latency statistics
 */
function displayLatencyStatistics() {
  try {
    // Calculate statistics for each metric
    const statistics = {};
    const metricLabels = {
      asr_latency: 'asr',
      // llm_network_latency: 'llm_net',
      llm_first_token: 'llm',
      // tts_network_latency: 'tts_net',
      tts_first_frame_latency: 'tts ',
      // tts_discontinuity: 'tts_dic',
      // interruption: 'interrupt'
    };
    
    Object.keys(metricsData).forEach(metric => {
      const values = metricsData[metric].map(item => item.value);
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / values.length); // Round to integer
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        statistics[metric] = {
          count: values.length,
          avg,
          min,
          max
        };
      }
    });
    
    let table = "metrics(ms):\n";
    table += "🕹️  | avg | min | max | *\n";
    
    Object.keys(statistics).forEach(metric => {
      const stat = statistics[metric];
      const label = metricLabels[metric];
      if (!label) return; 
      table += `${label} | ${stat.avg} | ${stat.min} | ${stat.max} | ${stat.count}\n`;
    });
    
    // If no metrics were recorded
    if (Object.keys(statistics).length === 0) {
      table = "No latency metrics recorded";
    }
    
    // Add the summary to the chat
    addSystemMessage(table);
  } catch (error) {
    console.error('Error calculating metrics statistics:', error);
  }
} 