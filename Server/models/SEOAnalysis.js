const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technical', 'On-Page', 'Performance', 'Accessibility', 'Content', 'Best Practices'],
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Critical', 'Warning', 'Good'], 
    required: true 
  },
  recommendation: { type: String, required: true }
});

const seoAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    categoryScores: {
      technical: { type: Number, default: 0 },
      onPage: { type: Number, default: 0 },
      performance: { type: Number, default: 0 },
      accessibility: { type: Number, default: 0 },
      content: { type: Number, default: 0 },
      bestPractices: { type: Number, default: 0 }
    },
    seoData: {
      title: { type: String, default: '' },
      titleLength: { type: Number, default: 0 },
      metaDescription: { type: String, default: '' },
      descriptionLength: { type: Number, default: 0 },
      canonicalUrl: { type: String, default: '' },
      robotsMeta: { type: String, default: '' },
      hasRobotsTxt: { type: Boolean, default: false },
      hasSitemap: { type: Boolean, default: false },
      isHttps: { type: Boolean, default: false },
      viewport: { type: Boolean, default: false },
      htmlLang: { type: String, default: '' },
      headings: {
        h1Count: { type: Number, default: 0 },
        h2Count: { type: Number, default: 0 },
        h3Count: { type: Number, default: 0 },
        h1List: [{ type: String }]
      },
      images: {
        total: { type: Number, default: 0 },
        missingAlt: { type: Number, default: 0 },
        altCoverage: { type: Number, default: 100 }
      },
      links: {
        internal: { type: Number, default: 0 },
        external: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
      },
      performanceMetrics: {
        responseTimeMs: { type: Number, default: 0 },
        htmlSizeBytes: { type: Number, default: 0 },
        resourceCounts: {
          images: { type: Number, default: 0 },
          scripts: { type: Number, default: 0 },
          styles: { type: Number, default: 0 }
        }
      },
      structuredDataFound: { type: Boolean, default: false }
    },
    issues: [issueSchema],
    recommendations: [
      {
        title: String,
        description: String,
        category: String,
        impact: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
      }
    ],
    aiInsights: {
      summary: String,
      suggestedTitle: String,
      suggestedMetaDescription: String,
      actionableSteps: [String],
      contentTips: [String]
    },
    keywords: [
      {
        keyword: String,
        frequency: Number,
        density: String
      }
    ],
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying user's analyses sorted by date
seoAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SEOAnalysis', seoAnalysisSchema);
