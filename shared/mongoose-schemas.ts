import mongoose, { Schema, Document, Types } from 'mongoose';

// Business Schema
export interface IBusiness extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  legalName: string;
  stateOfIncorporation: string;
  entityType: 'LLC' | 'S-Corp' | 'C-Corp' | 'Sole Proprietorship';
  formationDate: Date;
  industry: string;
  hasEmployees: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  legalName: {
    type: String,
    required: true,
    trim: true
  },
  stateOfIncorporation: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 2,
    maxlength: 2
  },
  entityType: {
    type: String,
    required: true,
    enum: ['LLC', 'S-Corp', 'C-Corp', 'Sole Proprietorship']
  },
  formationDate: {
    type: Date,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  hasEmployees: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ComplianceEvent Schema
export interface IComplianceEvent extends Document {
  _id: Types.ObjectId;
  businessId: Types.ObjectId;
  title: string;
  description: string;
  category: 'Annual/Biennial' | 'Tax-Related' | 'Industry-Specific' | 'Registered Agent Notice';
  eventType: string;
  dueDate: Date;
  status: 'Upcoming' | 'Completed' | 'Overdue';
  frequency: 'One-Time' | 'Annual' | 'Quarterly' | 'Monthly';
  filingLink?: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedCost?: number;
  lastReminderSent?: Date;
  remindersSent: number;
  createdAt: Date;
  updatedAt: Date;
}

const complianceEventSchema = new Schema<IComplianceEvent>({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Annual/Biennial', 'Tax-Related', 'Industry-Specific', 'Registered Agent Notice']
  },
  eventType: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Overdue'],
    default: 'Upcoming'
  },
  frequency: {
    type: String,
    enum: ['One-Time', 'Annual', 'Quarterly', 'Monthly'],
    default: 'Annual'
  },
  filingLink: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Filing link must be a valid URL'
    }
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  estimatedCost: {
    type: Number,
    min: 0
  },
  lastReminderSent: {
    type: Date
  },
  remindersSent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
businessSchema.index({ userId: 1, stateOfIncorporation: 1 });
businessSchema.index({ formationDate: 1 });

complianceEventSchema.index({ businessId: 1, dueDate: 1 });
complianceEventSchema.index({ status: 1, dueDate: 1 });
complianceEventSchema.index({ dueDate: 1, status: 1 });

// Export models
export const Business = mongoose.model<IBusiness>('Business', businessSchema);
export const ComplianceEvent = mongoose.model<IComplianceEvent>('ComplianceEvent', complianceEventSchema);

// State-specific compliance templates
export interface ComplianceTemplate {
  state: string;
  entityType: string;
  events: Array<{
    title: string;
    description: string;
    category: string;
    eventType: string;
    frequency: string;
    priority: string;
    estimatedCost?: number;
    filingLink?: string;
    daysFromFormation?: number;
    monthDue?: number;
    dayDue?: number;
  }>;
}

export const complianceTemplates: ComplianceTemplate[] = [
  {
    state: 'DE',
    entityType: 'LLC',
    events: [
      {
        title: 'Delaware Annual Report Filing',
        description: 'Required annual report filing with Delaware Division of Corporations',
        category: 'Annual/Biennial',
        eventType: 'Annual Report',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 300,
        filingLink: 'https://corp.delaware.gov/paytaxes/',
        monthDue: 6,
        dayDue: 1
      },
      {
        title: 'Delaware Franchise Tax',
        description: 'Annual franchise tax payment due to Delaware',
        category: 'Tax-Related',
        eventType: 'Franchise Tax',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 300,
        filingLink: 'https://corp.delaware.gov/paytaxes/',
        monthDue: 6,
        dayDue: 1
      }
    ]
  },
  {
    state: 'WY',
    entityType: 'LLC',
    events: [
      {
        title: 'Wyoming Annual Report Filing',
        description: 'Required annual report filing with Wyoming Secretary of State',
        category: 'Annual/Biennial',
        eventType: 'Annual Report',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 50,
        filingLink: 'https://wyobiz.wyo.gov/',
        monthDue: 12,
        dayDue: 31
      }
    ]
  },
  {
    state: 'CA',
    entityType: 'LLC',
    events: [
      {
        title: 'California Statement of Information',
        description: 'Biennial Statement of Information filing with California Secretary of State',
        category: 'Annual/Biennial',
        eventType: 'Statement of Information',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 20,
        monthDue: 12,
        dayDue: 31
      },
      {
        title: 'California LLC Tax',
        description: 'Annual LLC tax payment to California Franchise Tax Board',
        category: 'Tax-Related',
        eventType: 'LLC Tax',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 800,
        monthDue: 4,
        dayDue: 15
      }
    ]
  },
  {
    state: 'TX',
    entityType: 'LLC',
    events: [
      {
        title: 'Texas Public Information Report',
        description: 'Required public information report filing with Texas Secretary of State',
        category: 'Annual/Biennial',
        eventType: 'Public Information Report',
        frequency: 'Annual',
        priority: 'Medium',
        estimatedCost: 0,
        monthDue: 5,
        dayDue: 15
      }
    ]
  },
  {
    state: 'FL',
    entityType: 'LLC',
    events: [
      {
        title: 'Florida Annual Report',
        description: 'Annual report filing with Florida Division of Corporations',
        category: 'Annual/Biennial',
        eventType: 'Annual Report',
        frequency: 'Annual',
        priority: 'High',
        estimatedCost: 138.75,
        filingLink: 'https://dos.myflorida.com/sunbiz/',
        monthDue: 5,
        dayDue: 1
      }
    ]
  }
];