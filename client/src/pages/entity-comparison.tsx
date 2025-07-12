import { useState } from 'react';
import { Link } from 'wouter';

interface EntityType {
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  taxation: string;
  liability: string;
  ownership: string;
  formalities: string;
  cost: string;
}

const entityTypes: EntityType[] = [
  {
    name: "Limited Liability Company",
    shortName: "LLC",
    description: "A flexible business structure that combines the liability protection of a corporation with the tax benefits and operational flexibility of a partnership.",
    color: "emerald",
    icon: "🛡️",
    pros: [
      "Limited liability protection for owners",
      "Pass-through taxation (no double taxation)",
      "Flexible management structure",
      "Fewer corporate formalities required",
      "Can elect different tax treatments",
      "Credibility with customers and vendors"
    ],
    cons: [
      "Self-employment tax on all profits",
      "Limited life in some states",
      "Varying state regulations",
      "Less established legal precedent",
      "Difficulty raising capital from investors"
    ],
    bestFor: [
      "Small to medium-sized businesses",
      "Professional service providers",
      "Real estate investors",
      "Businesses with multiple owners",
      "Companies seeking operational flexibility"
    ],
    taxation: "Pass-through (members pay personal income tax)",
    liability: "Limited liability for all members",
    ownership: "Flexible ownership structure with membership interests",
    formalities: "Minimal - operating agreement recommended",
    cost: "$50-$500 state filing fee + registered agent"
  },
  {
    name: "S Corporation",
    shortName: "S-Corp",
    description: "A corporation that elects to pass corporate income, losses, deductions, and credits through to shareholders for federal tax purposes.",
    color: "blue",
    icon: "📊",
    pros: [
      "Pass-through taxation",
      "Limited liability protection",
      "Potential payroll tax savings",
      "Easy transfer of ownership",
      "Established legal structure",
      "Perpetual existence"
    ],
    cons: [
      "Strict ownership restrictions (100 shareholders max)",
      "Only one class of stock allowed",
      "Must be U.S. citizens or residents",
      "Required corporate formalities",
      "Limited deduction for business losses"
    ],
    bestFor: [
      "Small businesses with few owners",
      "Service-based businesses",
      "Companies planning to distribute profits",
      "Businesses seeking payroll tax savings",
      "Companies with U.S. citizen owners only"
    ],
    taxation: "Pass-through taxation with potential payroll tax savings",
    liability: "Limited liability for shareholders",
    ownership: "Up to 100 shareholders, one class of stock",
    formalities: "Corporate meetings, resolutions, record keeping",
    cost: "$100-$800 state filing + IRS election filing"
  },
  {
    name: "C Corporation",
    shortName: "C-Corp",
    description: "A legal entity separate from its owners, offering the strongest liability protection and ability to raise capital through stock sales.",
    color: "purple",
    icon: "🏢",
    pros: [
      "Strongest liability protection",
      "Unlimited growth potential",
      "Easy to transfer ownership",
      "Can raise capital through stock sales",
      "Attractive to investors and employees",
      "Perpetual existence",
      "Tax-deductible employee benefits"
    ],
    cons: [
      "Double taxation on profits",
      "Complex tax filings and compliance",
      "Extensive corporate formalities",
      "Higher administrative costs",
      "More regulatory oversight"
    ],
    bestFor: [
      "High-growth companies",
      "Businesses seeking investment",
      "Companies planning to go public",
      "International businesses",
      "Companies with significant profits to retain"
    ],
    taxation: "Corporate tax rate (21%) + personal tax on dividends",
    liability: "Limited liability for shareholders",
    ownership: "Unlimited shareholders, multiple stock classes allowed",
    formalities: "Board meetings, shareholder meetings, extensive records",
    cost: "$100-$800 state filing + ongoing compliance costs"
  },
  {
    name: "Professional Corporation",
    shortName: "PC/PLLC",
    description: "A specialized corporate structure for licensed professionals such as doctors, lawyers, accountants, and other professionals.",
    color: "indigo",
    icon: "⚖️",
    pros: [
      "Limited liability for business debts",
      "Professional credibility",
      "Tax-deductible benefits",
      "Perpetual existence",
      "Clear professional boundaries"
    ],
    cons: [
      "No protection from professional malpractice",
      "Must be owned by licensed professionals",
      "More regulatory requirements",
      "Limited to specific professions",
      "Potential double taxation"
    ],
    bestFor: [
      "Licensed professionals (doctors, lawyers, CPAs)",
      "Medical practices",
      "Law firms",
      "Accounting firms",
      "Engineering firms"
    ],
    taxation: "Similar to C-Corp or can elect S-Corp taxation",
    liability: "Limited for business debts, not professional liability",
    ownership: "Only licensed professionals in the same field",
    formalities: "Corporate formalities + professional licensing requirements",
    cost: "$100-$1,000 state filing + professional licensing fees"
  },
  {
    name: "Nonprofit Corporation",
    shortName: "Nonprofit",
    description: "A corporation organized for charitable, educational, religious, or other purposes that benefit the public rather than private shareholders.",
    color: "rose",
    icon: "❤️",
    pros: [
      "Tax-exempt status (501c3)",
      "Eligible for grants and donations",
      "Limited liability protection",
      "Tax-deductible donations for donors",
      "Public trust and credibility",
      "Perpetual existence"
    ],
    cons: [
      "No personal profit distribution",
      "Extensive regulatory compliance",
      "Public scrutiny and reporting",
      "Limited political activities",
      "Complex dissolution process"
    ],
    bestFor: [
      "Charitable organizations",
      "Educational institutions",
      "Religious organizations",
      "Community service groups",
      "Research organizations"
    ],
    taxation: "Tax-exempt on income related to exempt purpose",
    liability: "Limited liability for directors and officers",
    ownership: "No owners - governed by board of directors",
    formalities: "Board meetings, annual reports, IRS filings",
    cost: "$50-$500 state filing + $600 IRS application fee"
  }
];

const comparisonCategories = [
  { key: 'taxation', label: 'Taxation', icon: '💰' },
  { key: 'liability', label: 'Liability Protection', icon: '🛡️' },
  { key: 'ownership', label: 'Ownership Structure', icon: '👥' },
  { key: 'formalities', label: 'Corporate Formalities', icon: '📋' },
  { key: 'cost', label: 'Formation Cost', icon: '💵' }
];

export default function EntityComparison() {
  const [selectedEntities, setSelectedEntities] = useState<string[]>(['LLC', 'S-Corp']);
  const [viewMode, setViewMode] = useState<'overview' | 'comparison'>('overview');

  const toggleEntitySelection = (shortName: string) => {
    setSelectedEntities(prev => 
      prev.includes(shortName) 
        ? prev.filter(e => e !== shortName)
        : [...prev, shortName]
    );
  };

  const selectedEntityData = entityTypes.filter(entity => 
    selectedEntities.includes(entity.shortName)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="text-green-200 font-medium">Business Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Entity Comparison Tool
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Compare different business entity types side-by-side to make an informed decision for your business structure
            </p>
            
            {/* View Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-green-700 rounded-lg p-1 flex">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    viewMode === 'overview' 
                      ? 'bg-white text-green-800' 
                      : 'text-green-100 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setViewMode('comparison')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    viewMode === 'comparison' 
                      ? 'bg-white text-green-800' 
                      : 'text-green-100 hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {viewMode === 'overview' ? (
          <>
            {/* Entity Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Select Entity Types to Compare
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {entityTypes.map((entity) => (
                  <button
                    key={entity.shortName}
                    onClick={() => toggleEntitySelection(entity.shortName)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedEntities.includes(entity.shortName)
                        ? `border-${entity.color}-500 bg-${entity.color}-50`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{entity.icon}</div>
                    <div className="font-semibold text-gray-900">{entity.shortName}</div>
                    <div className="text-sm text-gray-600">{entity.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entity Cards Overview */}
            <div className="grid gap-8 lg:grid-cols-2">
              {entityTypes.map((entity) => (
                <div
                  key={entity.shortName}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-${entity.color}-500`}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{entity.icon}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{entity.shortName}</h3>
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 mb-3">{entity.name}</h4>
                        <p className="text-gray-600 leading-relaxed">{entity.description}</p>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Advantages
                        </h5>
                        <ul className="space-y-2">
                          {entity.pros.slice(0, 4).map((pro, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                          Considerations
                        </h5>
                        <ul className="space-y-2">
                          {entity.cons.slice(0, 4).map((con, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Best For */}
                    <div className="border-t pt-6">
                      <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                        </svg>
                        Best For
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {entity.bestFor.slice(0, 3).map((use, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 bg-${entity.color}-100 text-${entity.color}-700 rounded-full text-sm font-medium`}
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Side-by-Side Comparison
              </h2>
              <p className="text-gray-600">
                Comparing {selectedEntityData.map(e => e.shortName).join(', ')}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                      Feature
                    </th>
                    {selectedEntityData.map((entity) => (
                      <th key={entity.shortName} className="px-6 py-4 text-center text-sm font-semibold text-gray-900 min-w-64">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">{entity.icon}</span>
                          <span>{entity.shortName}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonCategories.map((category) => (
                    <tr key={category.key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </div>
                      </td>
                      {selectedEntityData.map((entity) => (
                        <td key={entity.shortName} className="px-6 py-4 text-sm text-gray-600 text-center">
                          {entity[category.key as keyof EntityType] as string}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Pros Section */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>✅</span>
                        Key Advantages
                      </div>
                    </td>
                    {selectedEntityData.map((entity) => (
                      <td key={entity.shortName} className="px-6 py-4 text-sm text-gray-600">
                        <ul className="space-y-1 text-left">
                          {entity.pros.slice(0, 3).map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Cons Section */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        Key Considerations
                      </div>
                    </td>
                    {selectedEntityData.map((entity) => (
                      <td key={entity.shortName} className="px-6 py-4 text-sm text-gray-600">
                        <ul className="space-y-1 text-left">
                          {entity.cons.slice(0, 3).map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Form Your Business?</h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Now that you've compared different entity types, let our experts help you form your business with the right structure for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/business-formation-service">
              <button
                style={{
                  backgroundColor: 'white',
                  color: '#059669',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(-2px)';
                  target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }}
              >
                Start Business Formation
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}