import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FooterConfig } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface FooterSection {
  title: string;
  links: Array<{
    text: string;
    url: string;
  }>;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

interface LegalLink {
  text: string;
  url: string;
}

export default function FooterManager() {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: footerConfig, isLoading } = useQuery<FooterConfig>({
    queryKey: ['/api/footer/config'],
  });

  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    phone: '',
    email: '',
    address: '',
    socialLinks: {} as SocialLinks,
    sections: [] as FooterSection[],
    copyrightText: '',
    legalLinks: [] as LegalLink[],
    showSocialMedia: true,
    showNewsletter: true,
    newsletterTitle: '',
    newsletterDescription: '',
    backgroundColor: '#1f2937',
    textColor: '#d1d5db',
    linkColor: '#10b981'
  });

  // Update form data when footer config loads
  useState(() => {
    if (footerConfig) {
      setFormData({
        companyName: footerConfig.companyName || '',
        companyDescription: footerConfig.companyDescription || '',
        phone: footerConfig.phone || '',
        email: footerConfig.email || '',
        address: footerConfig.address || '',
        socialLinks: (footerConfig.socialLinks as SocialLinks) || {},
        sections: (footerConfig.sections as FooterSection[]) || [],
        copyrightText: footerConfig.copyrightText || '',
        legalLinks: (footerConfig.legalLinks as LegalLink[]) || [],
        showSocialMedia: footerConfig.showSocialMedia ?? true,
        showNewsletter: footerConfig.showNewsletter ?? true,
        newsletterTitle: footerConfig.newsletterTitle || '',
        newsletterDescription: footerConfig.newsletterDescription || '',
        backgroundColor: footerConfig.backgroundColor || '#1f2937',
        textColor: footerConfig.textColor || '#d1d5db',
        linkColor: footerConfig.linkColor || '#10b981'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/admin/footer/config', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Footer configuration updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/footer/config'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update footer configuration",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', links: [{ text: '', url: '' }] }]
    }));
  };

  const updateSection = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addLinkToSection = (sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: [...section.links, { text: '', url: '' }] }
          : section
      )
    }));
  };

  const updateSectionLink = (sectionIndex: number, linkIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              links: section.links.map((link, j) => 
                j === linkIndex ? { ...link, [field]: value } : link
              )
            }
          : section
      )
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const removeLinkFromSection = (sectionIndex: number, linkIndex: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, links: section.links.filter((_, j) => j !== linkIndex) }
          : section
      )
    }));
  };

  const addLegalLink = () => {
    setFormData(prev => ({
      ...prev,
      legalLinks: [...prev.legalLinks, { text: '', url: '' }]
    }));
  };

  const updateLegalLink = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      legalLinks: prev.legalLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeLegalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      legalLinks: prev.legalLinks.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
        <p className="text-gray-600 mt-2">Configure the global footer settings for your website</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General Info
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sections'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Footer Sections
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social & Newsletter
          </button>
          <button
            onClick={() => setActiveTab('styling')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'styling'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Styling
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Information Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ParaFort"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="(844) 444-5411"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="info@parafort.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, companyDescription: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Professional business formation and compliance management platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="123 Business Ave, Suite 100, Business City, BC 12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="© 2025 ParaFort. All rights reserved."
              />
            </div>

            {/* Legal Links */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Legal Links
                </label>
                <button
                  type="button"
                  onClick={addLegalLink}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Add Legal Link
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.legalLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={link.text}
                        onChange={(e) => updateLegalLink(index, 'text', e.target.value)}
                        placeholder="Link Text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                        placeholder="URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLegalLink(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Sections Tab */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Footer Sections</h3>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Section
              </button>
            </div>

            <div className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                      placeholder="Section Title"
                      className="text-lg font-medium bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Remove Section
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Links</span>
                      <button
                        type="button"
                        onClick={() => addLinkToSection(sectionIndex)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add Link
                      </button>
                    </div>

                    {section.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={link.text}
                            onChange={(e) => updateSectionLink(sectionIndex, linkIndex, 'text', e.target.value)}
                            placeholder="Link Text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateSectionLink(sectionIndex, linkIndex, 'url', e.target.value)}
                            placeholder="URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLinkFromSection(sectionIndex, linkIndex)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social & Newsletter Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Social Media Links */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showSocialMedia}
                    onChange={(e) => setFormData(prev => ({ ...prev, showSocialMedia: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show Social Media</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://facebook.com/parafort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://twitter.com/parafort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://linkedin.com/company/parafort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://instagram.com/parafort"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://youtube.com/@parafort"
                  />
                </div>
              </div>
            </div>

            {/* Newsletter Settings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Newsletter Subscription</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.showNewsletter}
                    onChange={(e) => setFormData(prev => ({ ...prev, showNewsletter: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show Newsletter</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Title</label>
                  <input
                    type="text"
                    value={formData.newsletterTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, newsletterTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Stay Updated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Description</label>
                  <textarea
                    value={formData.newsletterDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, newsletterDescription: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Get the latest updates on business formation and compliance."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Styling Tab */}
        {activeTab === 'styling' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Footer Styling</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.linkColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.linkColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">Preview</h4>
              <div 
                className="p-6 rounded-lg border"
                style={{ 
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor
                }}
              >
                <h5 className="font-semibold text-white mb-2">{formData.companyName || 'Company Name'}</h5>
                <p className="text-sm mb-3">{formData.companyDescription || 'Company description goes here...'}</p>
                <a 
                  href="#" 
                  style={{ color: formData.linkColor }}
                  className="text-sm hover:underline"
                >
                  Sample Link
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Footer Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}