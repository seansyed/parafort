import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface DigitalMailboxPlan {
  id: number;
  name: string;
  displayName: string;
  monthlyPrice: string;
  businessAddresses: number;
  mailItemsPerMonth: number;
  costPerExtraItem: string;
  shippingCost: string;
  secureShredding: boolean;
  checkDepositFee: string;
  checksIncluded: number;
  additionalCheckFee: string;
  isActive: boolean;
  isMostPopular: boolean;
}

interface DigitalMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: number, planName: string) => void;
}

export function DigitalMailboxModal({ isOpen, onClose, onSelectPlan }: DigitalMailboxModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const { data: plans = [], isLoading } = useQuery<DigitalMailboxPlan[]>({
    queryKey: ['/api/mailbox-plans'],
    enabled: isOpen,
  });

  const handleSelectPlan = () => {
    if (selectedPlan) {
      const plan = plans.find(p => p.id === selectedPlan);
      if (plan) {
        onSelectPlan(selectedPlan, plan.name);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Select Digital Mailbox Subscription Plan
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-6">
            Choose a subscription plan that includes digital mailbox services for enhanced privacy and professional address management.
          </p>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading plans...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.filter(plan => plan.isActive && parseFloat(plan.monthlyPrice) > 0).map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-green-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`plan-${plan.id}`}
                          name="digitalMailboxPlan"
                          checked={selectedPlan === plan.id}
                          onChange={() => setSelectedPlan(plan.id)}
                          className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor={`plan-${plan.id}`} className="ml-3 text-lg font-semibold text-gray-900">
                          {plan.displayName}
                        </label>
                        {plan.isMostPopular && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                            Most Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-green-500">
                          ${parseFloat(plan.monthlyPrice).toFixed(0)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/month</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700 mb-2">Features included:</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {plan.businessAddresses} Business Address{plan.businessAddresses > 1 ? 'es' : ''}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {plan.mailItemsPerMonth} Mail Items per Month
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          ${plan.shippingCost} Shipping Cost
                        </div>
                        {plan.secureShredding && (
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Secure Shredding
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {plan.checksIncluded} Checks Included
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          ${plan.checkDepositFee} Check Deposit Fee
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSelectPlan}
              disabled={!selectedPlan}
              className="px-6 bg-green-500 hover:bg-green-500/90 text-white"
            >
              Add Selected Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}