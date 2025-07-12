import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStateAddressConfig } from '../stateAddressRequirements';
import { getStateOfficerConfig } from '../stateOfficerRequirements';
import { isExemptFromAnnualFiling, getExemptionMessage } from '../stateAnnualFilingExemptions';

// Data model interface
interface AnnualReportFormData {
  state: string;
  entityType: 'LLC' | 'Corporation' | 'Professional Corporation' | 'Non-Profit Corporation';
  businessName: string;
  fileNumber: string;
  principalAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  mailingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  registeredAgent: {
    type: 'existing' | 'parafort';
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  membersOrOfficers: {
    name: string;
    title?: string;
    address?: string;
  }[];
  naicsCode?: string;
  businessPurpose?: string;
  stateOfFormation?: string;
  signerName: string;
  signerTitle: string;
  filingFee?: number;
}

// Standardized field configurations - all states use the same fields based on entity type
const getStandardFieldConfig = (state: string, entityType: 'LLC' | 'Corporation') => {
  // State filing fees (only thing that varies by state)
  const stateFilingFees: { [key: string]: { LLC: number; Corporation: number } } = {
    'Alabama': { LLC: 50, Corporation: 50 },
    'Alaska': { LLC: 100, Corporation: 100 },
    'Arizona': { LLC: 0, Corporation: 0 },
    'Arkansas': { LLC: 150, Corporation: 50 },
    'California': { LLC: 20, Corporation: 20 },
    'Colorado': { LLC: 10, Corporation: 10 },
    'Connecticut': { LLC: 80, Corporation: 80 },
    'Delaware': { LLC: 300, Corporation: 50 },
    'Florida': { LLC: 150, Corporation: 150 },
    'Georgia': { LLC: 50, Corporation: 50 },
    'Hawaii': { LLC: 25, Corporation: 25 },
    'Idaho': { LLC: 30, Corporation: 30 },
    'Illinois': { LLC: 75, Corporation: 75 },
    'Indiana': { LLC: 50, Corporation: 30 },
    'Iowa': { LLC: 45, Corporation: 40 },
    'Kansas': { LLC: 55, Corporation: 40 },
    'Kentucky': { LLC: 15, Corporation: 15 },
    'Louisiana': { LLC: 35, Corporation: 25 },
    'Maine': { LLC: 85, Corporation: 85 },
    'Maryland': { LLC: 100, Corporation: 100 },
    'Massachusetts': { LLC: 500, Corporation: 125 },
    'Michigan': { LLC: 25, Corporation: 25 },
    'Minnesota': { LLC: 25, Corporation: 25 },
    'Mississippi': { LLC: 0, Corporation: 25 },
    'Missouri': { LLC: 45, Corporation: 45 },
    'Montana': { LLC: 10, Corporation: 10 },
    'Nebraska': { LLC: 25, Corporation: 25 },
    'Nevada': { LLC: 150, Corporation: 150 },
    'New Hampshire': { LLC: 100, Corporation: 100 },
    'New Jersey': { LLC: 50, Corporation: 50 },
    'New Mexico': { LLC: 50, Corporation: 25 },
    'New York': { LLC: 9, Corporation: 9 },
    'North Carolina': { LLC: 200, Corporation: 30 },
    'North Dakota': { LLC: 50, Corporation: 25 },
    'Ohio': { LLC: 50, Corporation: 50 },
    'Oklahoma': { LLC: 25, Corporation: 25 },
    'Oregon': { LLC: 100, Corporation: 100 },
    'Pennsylvania': { LLC: 70, Corporation: 70 },
    'Rhode Island': { LLC: 50, Corporation: 50 },
    'South Carolina': { LLC: 0, Corporation: 25 },
    'South Dakota': { LLC: 50, Corporation: 25 },
    'Tennessee': { LLC: 300, Corporation: 20 },
    'Texas': { LLC: 0, Corporation: 0 },
    'Utah': { LLC: 20, Corporation: 20 },
    'Vermont': { LLC: 35, Corporation: 35 },
    'Virginia': { LLC: 50, Corporation: 50 },
    'Washington': { LLC: 60, Corporation: 60 },
    'West Virginia': { LLC: 25, Corporation: 25 },
    'Wisconsin': { LLC: 25, Corporation: 25 },
    'Wyoming': { LLC: 60, Corporation: 60 }
  };

  const filingFee = stateFilingFees[state]?.[entityType] ?? 0;

  // Standardized fields - all states use same structure based on entity type
  if (entityType === 'LLC') {
    return {
      requiredFields: ['businessName', 'fileNumber', 'principalAddress', 'registeredAgent', 'managers', 'signerName'],
      filingFee,
      additionalFields: ['managers', 'businessPurpose'],
      description: state === 'Arizona' ? `${state} LLCs have no annual filing requirement.` : `${state} LLC Annual Report requires detailed business information.`
    };
  } else {
    return {
      requiredFields: ['businessName', 'fileNumber', 'principalAddress', 'registeredAgent', 'officers', 'signerName'],
      filingFee,
      additionalFields: ['officers', 'businessPurpose'],
      description: state === 'Arizona' ? `${state} Corporations have no annual filing requirement.` : `${state} Corporation Annual Report requires officer and business information.`
    };
  }
};

// US States list
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

interface AnnualReportFormProps {
  onSubmit: (data: AnnualReportFormData) => void;
  loading?: boolean;
}

const AnnualReportForm: React.FC<AnnualReportFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<AnnualReportFormData>({
    state: '',
    entityType: 'LLC',
    businessName: '',
    fileNumber: '',
    principalAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    registeredAgent: {
      type: 'existing',
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    membersOrOfficers: [{ name: '', title: '', address: '' }],
    signerName: '',
    signerTitle: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    address: false,
    people: false,
    signature: false
  });

  // Check if state/entity combination is exempt from annual filing
  const isExempt = formData.state && formData.entityType ? 
    isExemptFromAnnualFiling(formData.state, formData.entityType) : false;
  
  const exemptionMessage = formData.state && formData.entityType ? 
    getExemptionMessage(formData.state, formData.entityType) : '';

  // Get current state configuration using standardized fields
  const currentConfig = formData.state && formData.entityType && !isExempt ? 
    getStandardFieldConfig(formData.state, formData.entityType) : null;
  
  // Get state-specific officer/manager requirements
  const currentOfficerConfig = formData.state && formData.entityType ? 
    getStateOfficerConfig(formData.state, formData.entityType) : null;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent as keyof typeof prev], [field]: value }
    }));
  };

  const addOfficerOrMember = () => {
    setFormData(prev => ({
      ...prev,
      membersOrOfficers: [...prev.membersOrOfficers, { name: '', title: '', address: '' }]
    }));
  };

  const removeOfficerOrMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      membersOrOfficers: prev.membersOrOfficers.filter((_, i) => i !== index)
    }));
  };

  const updateOfficerOrMember = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      membersOrOfficers: prev.membersOrOfficers.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.fileNumber) newErrors.fileNumber = 'File number is required';
    if (!formData.signerName) newErrors.signerName = 'Signer name is required';
    if (!formData.signerTitle) newErrors.signerTitle = 'Signer title is required';

    // State-specific validations
    if (currentConfig) {
      if (currentConfig.requiredFields.includes('principalAddress')) {
        if (!formData.principalAddress.street) newErrors.principalStreet = 'Principal address is required';
        if (!formData.principalAddress.city) newErrors.principalCity = 'Principal city is required';
        if (!formData.principalAddress.zipCode) newErrors.principalZip = 'Principal ZIP code is required';
      }

      if (currentConfig.requiredFields.includes('registeredAgent')) {
        if (formData.registeredAgent.type === 'existing') {
          if (!formData.registeredAgent.name) newErrors.agentName = 'Registered agent name is required';
          if (!formData.registeredAgent.address.street) newErrors.agentStreet = 'Registered agent address is required';
          if (!formData.registeredAgent.address.city) newErrors.agentCity = 'Registered agent city is required';
          if (!formData.registeredAgent.address.state) newErrors.agentState = 'Registered agent state is required';
          if (!formData.registeredAgent.address.zipCode) newErrors.agentZip = 'Registered agent ZIP code is required';
        }
        // For ParaFort agent, validation is automatic since fields are pre-filled
      }

      if (currentConfig.additionalFields.includes('officers') || currentConfig.additionalFields.includes('managers')) {
        if (formData.membersOrOfficers.length === 0 || !formData.membersOrOfficers[0].name) {
          newErrors.officers = `At least one ${formData.entityType === 'LLC' ? 'manager' : 'officer'} is required`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        filingFee: currentConfig?.filingFee
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Annual Report Filing Information</h2>
        <p className="text-gray-600">Complete the required information for your annual report filing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* State and Entity Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State of Filing *
            </label>
            <select
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select State</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Type *
            </label>
            <select
              value={formData.entityType}
              onChange={(e) => updateFormData('entityType', e.target.value as 'LLC' | 'Corporation' | 'Professional Corporation' | 'Non-Profit Corporation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Entity Type</option>
              <option value="LLC">Limited Liability Company (LLC)</option>
              <option value="Corporation">Corporation</option>
              <option value="Professional Corporation">Professional Corporation (PC)</option>
              <option value="Non-Profit Corporation">Non-Profit Corporation</option>
            </select>
            {errors.entityType && <p className="text-red-500 text-sm mt-1">{errors.entityType}</p>}
          </div>
        </div>

        {/* Exemption Message for states that don't require annual filing */}
        {isExempt && exemptionMessage && (
          <div className="p-6 bg-orange-50 border-2 border-orange-500 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-orange-800 mb-2">
                  No Annual Filing Required
                </h3>
                <p className="text-orange-700 text-sm leading-relaxed">
                  {exemptionMessage}
                </p>
                <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-md">
                  <p className="text-orange-800 text-sm font-medium">
                    ✓ No form completion needed for this state/entity combination
                  </p>
                  <p className="text-orange-700 text-xs mt-1">
                    Please select a different state or entity type if you need to file an annual report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State-specific information display */}
        {currentConfig && !isExempt && (
          <div className="p-4 bg-white border-2 border-green-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  {formData.state} {formData.entityType} Annual Report
                </h3>
                <p className="text-sm text-green-700 mt-1">{currentConfig.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Filing Fee</p>
                <p className="text-lg font-bold text-green-800">
                  ${currentConfig.filingFee || 'Varies'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Business Information Section - Only show if not exempt */}
        {!isExempt && (
        <>
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('business')}
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
            <motion.div
              animate={{ rotate: expandedSections.business ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.business && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={sectionVariants}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Legal Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => updateFormData('businessName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your legal business name"
                    />
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Number / Business ID *
                    </label>
                    <input
                      type="text"
                      value={formData.fileNumber}
                      onChange={(e) => updateFormData('fileNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your state file number"
                    />
                    {errors.fileNumber && <p className="text-red-500 text-sm mt-1">{errors.fileNumber}</p>}
                  </div>

                  {currentConfig?.additionalFields.includes('businessPurpose') && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Purpose
                      </label>
                      <textarea
                        value={formData.businessPurpose || ''}
                        onChange={(e) => updateFormData('businessPurpose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Describe your business purpose"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Address Information Section */}
        {currentConfig?.requiredFields.includes('principalAddress') && (
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('address')}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
            >
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
              <motion.div
                animate={{ rotate: expandedSections.address ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.address && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={sectionVariants}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <div className="mt-4 space-y-6">
                    {/* State-Specific Address Requirements */}
                    {formData.state && (() => {
                      const stateConfig = getStateAddressConfig(formData.state);
                      return (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">
                            {formData.state} Address Requirements
                          </h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {stateConfig.principalAddress.notes?.map((note, index) => (
                              <li key={index} className="flex items-start">
                                <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {note}
                              </li>
                            ))}
                          </ul>
                          {stateConfig.mailingAddress.required && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-sm font-medium text-blue-900">Mailing Address:</p>
                              <p className="text-sm text-blue-800">
                                Mailing address is required for {formData.state}
                                {stateConfig.mailingAddress.allowPOBox && " (P.O. Boxes acceptable)"}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <h4 className="text-md font-medium text-gray-800">Principal Business Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                          {formData.state && (() => {
                            const stateConfig = getStateAddressConfig(formData.state);
                            const streetReq = stateConfig.principalAddress.requirements.find(r => r.field === 'street');
                            return streetReq?.helpText ? (
                              <span className="text-xs text-gray-500 ml-2">({streetReq.helpText})</span>
                            ) : null;
                          })()}
                        </label>
                        <input
                          type="text"
                          value={formData.principalAddress.street}
                          onChange={(e) => updateNestedField('principalAddress', 'street', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder={formData.state === 'California' ? 'Street address (no P.O. Boxes)' : 'Street address'}
                        />
                        {errors.principalStreet && <p className="text-red-500 text-sm mt-1">{errors.principalStreet}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={formData.principalAddress.city}
                          onChange={(e) => updateNestedField('principalAddress', 'city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {errors.principalCity && <p className="text-red-500 text-sm mt-1">{errors.principalCity}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                          {formData.state && (() => {
                            const stateConfig = getStateAddressConfig(formData.state);
                            const stateReq = stateConfig.principalAddress.requirements.find(r => r.field === 'state');
                            return stateReq?.helpText ? (
                              <span className="text-xs text-gray-500 ml-2">({stateReq.helpText})</span>
                            ) : null;
                          })()}
                        </label>
                        <select
                          value={formData.principalAddress.state}
                          onChange={(e) => updateNestedField('principalAddress', 'state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select State</option>
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          value={formData.principalAddress.zipCode}
                          onChange={(e) => updateNestedField('principalAddress', 'zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="12345 or 12345-6789"
                          pattern="^[0-9]{5}(-[0-9]{4})?$"
                        />
                        {errors.principalZip && <p className="text-red-500 text-sm mt-1">{errors.principalZip}</p>}
                      </div>
                    </div>

                    {/* Mailing Address Section - Show if required by state or user wants different address */}
                    {formData.state && (() => {
                      const stateConfig = getStateAddressConfig(formData.state);
                      const mailingRequired = stateConfig.mailingAddress.required;
                      
                      return (
                        <div className="space-y-4">
                          {mailingRequired && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-yellow-800">
                                Mailing Address Required for {formData.state}
                              </p>
                              <p className="text-xs text-yellow-700 mt-1">
                                {stateConfig.mailingAddress.allowPOBox 
                                  ? "P.O. Boxes are acceptable for mailing address" 
                                  : "Street address required for mailing address"}
                              </p>
                            </div>
                          )}
                          
                          {(mailingRequired || formData.mailingAddress) && (
                            <div>
                              <h4 className="text-md font-medium text-gray-800 mb-4">
                                Mailing Address {mailingRequired ? '*' : '(Optional)'}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address {mailingRequired ? '*' : ''}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.mailingAddress?.street || ''}
                                    onChange={(e) => updateNestedField('mailingAddress', 'street', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder={stateConfig.mailingAddress.allowPOBox ? 'Street address or P.O. Box' : 'Street address'}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City {mailingRequired ? '*' : ''}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.mailingAddress?.city || ''}
                                    onChange={(e) => updateNestedField('mailingAddress', 'city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State {mailingRequired ? '*' : ''}
                                  </label>
                                  <select
                                    value={formData.mailingAddress?.state || ''}
                                    onChange={(e) => updateNestedField('mailingAddress', 'state', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  >
                                    <option value="">Select State</option>
                                    {US_STATES.map(state => (
                                      <option key={state} value={state}>{state}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP Code {mailingRequired ? '*' : ''}
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.mailingAddress?.zipCode || ''}
                                    onChange={(e) => updateNestedField('mailingAddress', 'zipCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="12345 or 12345-6789"
                                    pattern="^[0-9]{5}(-[0-9]{4})?$"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {!mailingRequired && !formData.mailingAddress && (
                            <button
                              type="button"
                              onClick={() => updateNestedField('mailingAddress', 'street', '')}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Add Different Mailing Address
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Registered Agent Section */}
        {currentConfig?.requiredFields.includes('registeredAgent') && (
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('agent')}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
            >
              <h3 className="text-lg font-medium text-gray-900">Registered Agent Information</h3>
              <motion.div
                animate={{ rotate: expandedSections.agent ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.agent && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={sectionVariants}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  <div className="mt-4 space-y-6">
                    {/* Registered Agent Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Registered Agent Service *
                      </label>
                      <div className="space-y-3">
                        <div 
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            formData.registeredAgent.type === 'existing' 
                              ? 'border-green-500 bg-white' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => updateNestedField('registeredAgent', 'type', 'existing')}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="agentType"
                              value="existing"
                              checked={formData.registeredAgent.type === 'existing'}
                              onChange={() => updateNestedField('registeredAgent', 'type', 'existing')}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Use Existing Registered Agent</div>
                              <div className="text-sm text-gray-500">I already have a registered agent for my business</div>
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            formData.registeredAgent.type === 'parafort' 
                              ? 'border-green-500' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            updateNestedField('registeredAgent', 'type', 'parafort');
                            updateNestedField('registeredAgent', 'name', 'ParaFort Inc');
                            updateNestedField('registeredAgent', 'address', {
                              street: '9175 Elk Grove Florin Road, Ste 5',
                              city: 'Elk Grove',
                              state: 'CA',
                              zipCode: '95624'
                            });
                          }}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="agentType"
                              value="parafort"
                              checked={formData.registeredAgent.type === 'parafort'}
                              onChange={() => {
                                updateNestedField('registeredAgent', 'type', 'parafort');
                                updateNestedField('registeredAgent', 'name', 'ParaFort Inc');
                                updateNestedField('registeredAgent', 'address', {
                                  street: '9175 Elk Grove Florin Road, Ste 5',
                                  city: 'Elk Grove',
                                  state: 'CA',
                                  zipCode: '95624'
                                });
                              }}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-900">ParaFort Registered Agent Service</div>
                                <div className="flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-green-500 text-green-800">
                                    FREE 1st Year
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    Special Offer
                                  </span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Professional registered agent service - FREE for your first year
                              </div>
                              <div className="text-xs text-gray-400 mt-2">
                                ✓ Mail forwarding and scanning<br/>
                                ✓ Compliance document handling<br/>
                                ✓ Professional business address<br/>
                                ✓ After Year 1: $75/year subscription (can cancel anytime)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Manual Agent Information (only shown for existing agent) */}
                    {formData.registeredAgent.type === 'existing' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-md font-medium text-gray-800">Registered Agent Details</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registered Agent Name *
                          </label>
                          <input
                            type="text"
                            value={formData.registeredAgent.name}
                            onChange={(e) => updateNestedField('registeredAgent', 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {errors.agentName && <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registered Agent Address *
                          </label>
                          <input
                            type="text"
                            value={formData.registeredAgent.address.street}
                            onChange={(e) => updateNestedField('registeredAgent', 'address', { 
                              ...formData.registeredAgent.address, 
                              street: e.target.value 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Street address"
                          />
                          {errors.agentStreet && <p className="text-red-500 text-sm mt-1">{errors.agentStreet}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              value={formData.registeredAgent.address.city}
                              onChange={(e) => updateNestedField('registeredAgent', 'address', { 
                                ...formData.registeredAgent.address, 
                                city: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                            <select
                              value={formData.registeredAgent.address.state}
                              onChange={(e) => updateNestedField('registeredAgent', 'address', { 
                                ...formData.registeredAgent.address, 
                                state: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="">Select State</option>
                              {US_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              value={formData.registeredAgent.address.zipCode}
                              onChange={(e) => updateNestedField('registeredAgent', 'address', { 
                                ...formData.registeredAgent.address, 
                                zipCode: e.target.value 
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ParaFort Agent Information (shown for ParaFort selection) */}
                    {formData.registeredAgent.type === 'parafort' && (
                      <div className="p-4 bg-white border-2 border-green-500 rounded-lg">
                        <h4 className="text-md font-medium text-gray-800 mb-2">ParaFort Registered Agent Service</h4>
                        <div className="text-sm text-gray-700">
                          <div className="mb-2"><strong>Agent Name:</strong> ParaFort Inc</div>
                          <div className="mb-2"><strong>Service Address:</strong> 9175 Elk Grove Florin Road, Ste 5, Elk Grove, CA 95624</div>
                          <div className="mb-3">
                            <strong>Service Benefits:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Professional mail handling and forwarding</li>
                              <li>Digital document scanning and notification</li>
                              <li>Compliance document management</li>
                              <li>Business privacy protection</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                            <div className="text-sm font-medium text-gray-800">Special Pricing:</div>
                            <div className="text-sm text-gray-700">
                              • <strong>First Year:</strong> FREE (included with your annual report filing)<br/>
                              • <strong>After Year 1:</strong> $75/year subscription (can cancel anytime)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Members/Officers Section */}
        {(currentConfig?.additionalFields.includes('officers') || currentConfig?.additionalFields.includes('managers')) && (
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleSection('people')}
              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {formData.entityType === 'LLC' ? 'Manager/Member' : 'Officer'} Information
              </h3>
              <motion.div
                animate={{ rotate: expandedSections.people ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.people && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={sectionVariants}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  {/* State-specific Officer/Manager Requirements */}
                  {currentOfficerConfig && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-900 mb-2">
                            {formData.state} {formData.entityType} Requirements
                          </h4>
                          <div className="space-y-2">
                            {currentOfficerConfig.requirements.map((req, index) => (
                              <div key={index} className="text-sm text-blue-800">
                                <span className="font-medium">{req.title}:</span>{' '}
                                {req.required ? (
                                  <span className="text-red-600 font-medium">Required</span>
                                ) : (
                                  <span className="text-gray-600">Optional</span>
                                )}
                                {req.description && (
                                  <span className="text-blue-700"> - {req.description}</span>
                                )}
                                {req.minRequired && (
                                  <span className="text-blue-700"> (Min: {req.minRequired})</span>
                                )}
                              </div>
                            ))}
                          </div>
                          {currentOfficerConfig.notes && currentOfficerConfig.notes.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-blue-200">
                              <p className="text-xs font-medium text-blue-900 mb-1">Important Notes:</p>
                              <ul className="text-xs text-blue-800 space-y-1">
                                {currentOfficerConfig.notes.map((note, index) => (
                                  <li key={index}>• {note}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-4">
                    {formData.membersOrOfficers.map((person, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-800">
                            {formData.entityType === 'LLC' ? 'Manager/Member' : 'Officer'} {index + 1}
                          </h4>
                          {formData.membersOrOfficers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOfficerOrMember(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <input
                              type="text"
                              value={person.name}
                              onChange={(e) => updateOfficerOrMember(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                              type="text"
                              value={person.title || ''}
                              onChange={(e) => updateOfficerOrMember(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder={formData.entityType === 'LLC' ? 'Manager' : 'CEO, Secretary, etc.'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {errors.officers && <p className="text-red-500 text-sm mt-1">{errors.officers}</p>}
                    <button
                      type="button"
                      onClick={addOfficerOrMember}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors duration-200"
                    >
                      + Add Another {formData.entityType === 'LLC' ? 'Manager/Member' : 'Officer'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Signature Section */}
        <div className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection('signature')}
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
          >
            <h3 className="text-lg font-medium text-gray-900">Signature Information</h3>
            <motion.div
              animate={{ rotate: expandedSections.signature ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.signature && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={sectionVariants}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.signerName}
                      onChange={(e) => updateFormData('signerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Name of person signing the report"
                    />
                    {errors.signerName && <p className="text-red-500 text-sm mt-1">{errors.signerName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signer Title *
                    </label>
                    <input
                      type="text"
                      value={formData.signerTitle}
                      onChange={(e) => updateFormData('signerTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="President, Manager, etc."
                    />
                    {errors.signerTitle && <p className="text-red-500 text-sm mt-1">{errors.signerTitle}</p>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button - Only show if not exempt */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading || !formData.state || !formData.entityType}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
        </>
        )}
      </form>
    </div>
  );
};

export default AnnualReportForm;