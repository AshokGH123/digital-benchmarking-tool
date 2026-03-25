const generateRecommendations = (processData, benchmarkData) => {
  const recommendations = [];

  // Time Analysis
  if (processData.time > benchmarkData.time) {
    const timeDiff = ((processData.time - benchmarkData.time) / benchmarkData.time * 100).toFixed(1);
    recommendations.push({
      category: 'Time Optimization',
      severity: timeDiff > 50 ? 'high' : timeDiff > 25 ? 'medium' : 'low',
      issue: `Process time is ${timeDiff}% higher than benchmark (${processData.time}hrs vs ${benchmarkData.time}hrs)`,
      suggestions: [
        'Automate manual approval stages',
        'Implement parallel processing for independent tasks',
        'Reduce handoff points between teams',
        'Use workflow automation tools',
        'Eliminate redundant review steps',
      ],
      impact: `Potential time savings: ${(processData.time - benchmarkData.time).toFixed(1)} hours`,
    });
  }

  // Cost Analysis
  if (processData.cost > benchmarkData.cost) {
    const costDiff = ((processData.cost - benchmarkData.cost) / benchmarkData.cost * 100).toFixed(1);
    recommendations.push({
      category: 'Cost Reduction',
      severity: costDiff > 40 ? 'high' : costDiff > 20 ? 'medium' : 'low',
      issue: `Process cost is ${costDiff}% higher than benchmark ($${processData.cost} vs $${benchmarkData.cost})`,
      suggestions: [
        'Optimize resource allocation',
        'Negotiate better vendor rates',
        'Reduce overtime by improving scheduling',
        'Consolidate similar tasks',
        'Implement cost tracking per stage',
      ],
      impact: `Potential cost savings: $${(processData.cost - benchmarkData.cost).toFixed(2)}`,
    });
  }

  // Resource Analysis
  if (processData.resources > benchmarkData.resources) {
    const resourceDiff = ((processData.resources - benchmarkData.resources) / benchmarkData.resources * 100).toFixed(1);
    recommendations.push({
      category: 'Resource Optimization',
      severity: resourceDiff > 30 ? 'high' : resourceDiff > 15 ? 'medium' : 'low',
      issue: `Using ${resourceDiff}% more resources than benchmark (${processData.resources} vs ${benchmarkData.resources})`,
      suggestions: [
        'Cross-train team members for flexibility',
        'Reallocate resources from low-priority tasks',
        'Implement resource pooling',
        'Use part-time or contract resources for peak periods',
        'Automate resource-intensive tasks',
      ],
      impact: `Potential resource reduction: ${(processData.resources - benchmarkData.resources).toFixed(0)} units`,
    });
  }

  // Quality/Error Rate Analysis
  if (processData.errorRate > benchmarkData.errorRate) {
    const errorDiff = ((processData.errorRate - benchmarkData.errorRate) / benchmarkData.errorRate * 100).toFixed(1);
    recommendations.push({
      category: 'Quality Improvement',
      severity: errorDiff > 50 ? 'high' : errorDiff > 25 ? 'medium' : 'low',
      issue: `Error rate is ${errorDiff}% higher than benchmark (${processData.errorRate}% vs ${benchmarkData.errorRate}%)`,
      suggestions: [
        'Implement automated validation checks',
        'Add quality gates at critical stages',
        'Provide additional training to team',
        'Use checklists and templates',
        'Implement peer review process',
      ],
      impact: `Potential error reduction: ${(processData.errorRate - benchmarkData.errorRate).toFixed(1)}%`,
    });
  }

  // Efficiency Score
  const efficiencyScore = calculateEfficiencyScore(processData, benchmarkData);
  if (efficiencyScore < 70) {
    recommendations.push({
      category: 'Overall Efficiency',
      severity: efficiencyScore < 50 ? 'high' : 'medium',
      issue: `Overall process efficiency is ${efficiencyScore}% (Target: 80%+)`,
      suggestions: [
        'Conduct end-to-end process mapping',
        'Identify and eliminate bottlenecks',
        'Implement continuous improvement program',
        'Use process mining tools for insights',
        'Establish KPI monitoring dashboard',
      ],
      impact: `Efficiency improvement potential: ${(80 - efficiencyScore).toFixed(0)}%`,
    });
  }

  // Positive feedback for good performance
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'Performance',
      severity: 'success',
      issue: 'Process is performing at or above benchmark levels',
      suggestions: [
        'Document best practices for replication',
        'Share learnings with other teams',
        'Continue monitoring for consistency',
        'Look for incremental improvements',
      ],
      impact: 'Maintain current performance standards',
    });
  }

  return {
    recommendations,
    overallScore: efficiencyScore,
    priorityActions: recommendations
      .filter(r => r.severity === 'high')
      .map(r => r.suggestions[0]),
  };
};

const calculateEfficiencyScore = (processData, benchmarkData) => {
  const timeScore = Math.max(0, 100 - ((processData.time - benchmarkData.time) / benchmarkData.time * 100));
  const costScore = Math.max(0, 100 - ((processData.cost - benchmarkData.cost) / benchmarkData.cost * 100));
  const resourceScore = Math.max(0, 100 - ((processData.resources - benchmarkData.resources) / benchmarkData.resources * 100));
  const errorScore = Math.max(0, 100 - ((processData.errorRate - benchmarkData.errorRate) / benchmarkData.errorRate * 100));
  
  return Math.round((timeScore + costScore + resourceScore + errorScore) / 4);
};

export { generateRecommendations, calculateEfficiencyScore };
