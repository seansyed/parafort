import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ServiceOrder {
  id: number;
  orderId: string;
  userId: string;
  serviceId: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  businessName?: string;
  baseAmount: number;
  expeditedFee?: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  serviceNames: string;
}

export default function ServiceOrdersNew() {

  
  const { data: orders = [], isLoading, error } = useQuery<ServiceOrder[]>({
    queryKey: ['/api/service-orders'],
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const viewDocuments = () => {
    window.location.href = '/client-documents';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>
            Service Orders
          </h1>
          <div style={{ 
            padding: '3rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #e5e7eb', 
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading your service orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>
            Service Orders
          </h1>
          <div style={{ 
            padding: '3rem', 
            backgroundColor: '#fef2f2', 
            borderRadius: '8px', 
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            <p style={{ color: '#dc2626', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Error loading service orders
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '6rem', padding: '2rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .order-card {
            transition: all 0.2s ease;
          }
          .order-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .download-btn {
            transition: all 0.2s ease;
          }
          .download-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          }
          .download-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
        `}
      </style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Service Orders
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            View your service orders and download completed documents
          </p>
        </div>

        {orders.length === 0 ? (
          <div style={{ 
            padding: '4rem 2rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '2rem'
            }}>
              📄
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
              No Service Orders Yet
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              You haven't placed any service orders yet. Browse our services to get started.
            </p>
            <button
              onClick={() => window.location.href = '/services'}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      color: '#111827',
                      marginBottom: '0.25rem'
                    }}>
                      {order.serviceNames || 'Service Order'}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      Order #{order.orderId}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: order.orderStatus === 'completed' ? '#d1fae5' : 
                                     order.orderStatus === 'processing' ? '#dbeafe' : '#fef3c7',
                      color: order.orderStatus === 'completed' ? '#065f46' : 
                             order.orderStatus === 'processing' ? '#1e40af' : '#92400e',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {order.orderStatus}
                    </span>
                    <span style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                  }}>
                    {/* Customer Info */}
                    <div>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        👤 Customer Information
                      </h4>
                      <div style={{ space: '0.5rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Name: </span>
                          <span style={{ color: '#111827', fontWeight: '500' }}>{order.customerName}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Email: </span>
                          <span style={{ color: '#111827', fontWeight: '500' }}>{order.customerEmail}</span>
                        </div>
                        {order.businessName && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Business: </span>
                            <span style={{ color: '#111827', fontWeight: '500' }}>{order.businessName}</span>
                          </div>
                        )}
                        {order.customerPhone && (
                          <div>
                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Phone: </span>
                            <span style={{ color: '#111827', fontWeight: '500' }}>{order.customerPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        📋 Order Details
                      </h4>
                      <div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Service: </span>
                          <span style={{ color: '#111827', fontWeight: '500' }}>{order.serviceNames}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Order Date: </span>
                          <span style={{ color: '#111827', fontWeight: '500' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Base Amount: </span>
                          <span style={{ color: '#111827', fontWeight: '500' }}>${Number(order.baseAmount || 0).toFixed(2)}</span>
                        </div>
                        {order.expeditedFee && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Expedited Fee: </span>
                            <span style={{ color: '#111827', fontWeight: '500' }}>${Number(order.expeditedFee || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid #e5e7eb'
                        }}>
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Total: </span>
                          <span style={{ 
                            color: '#10b981', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            ${Number(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        {order.orderStatus === 'completed' 
                          ? 'Documents are ready for download'
                          : order.orderStatus === 'processing'
                          ? 'Your order is being processed'
                          : 'Order is pending - documents will be available once completed'
                        }
                      </p>
                    </div>
                    <button
                      onClick={viewDocuments}
                      disabled={order.orderStatus !== 'completed'}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: order.orderStatus === 'completed' ? '#10b981' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: order.orderStatus === 'completed' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      📄 {order.orderStatus === 'completed' ? 'View Documents' : 
                           order.orderStatus === 'processing' ? 'Processing' : 'Pending'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}