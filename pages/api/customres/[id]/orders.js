import { generateCustomers } from '../../../lib/mockData';

// Generate once and reuse
const customers = generateCustomers();

export default function handler(req, res) {
  const { id } = req.query;

  console.log('Looking for customer:', id);
  console.log('Available IDs:', customers.slice(0, 3).map(c => c.id));

}

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ 
      success: false,
      message: 'Customer ID is required'
    });
  }

  try {
    const customer = customers.find(c => c.id === id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
        suggestion: `Valid IDs start with: ${customers[0]?.id?.substring(0, 8)}...`
      });
    }

    return res.status(200).json({
      success: true,
      data: customer.orders || []
    });

  } catch (error) {
    console.error('API Error:', {
      error: error.message,
      customerId: id,
      availableIds: customers.slice(0, 3).map(c => c.id) // Sample IDs for debugging
    });
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}