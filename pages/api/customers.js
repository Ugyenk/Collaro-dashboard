import { generateCustomers } from '../../lib/mockData';

let customers = [];
try {
  customers = generateCustomers(100);
  console.log(`Successfully generated ${customers.length} mock customers`);
} catch (error) {
  console.error('Failed to generate mock data:', error);

  customers = [
    {
      id: 'fallback-1',
      name: 'Sample Customer',
      email: 'sample@example.com',
      status: 'active',
      revenue: 0,
      createdAt: new Date().toISOString(),
      orderCount: 0,
      lastOrderDate: null
    }
  ];
}

const cache = new Map();

export default function handler(req, res) {
  try {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc', search = '' } = req.query;

    const pageNum = Math.max(1, parseInt(page)) || 1;
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 100) || 10;
    const validSortFields = ['name', 'email', 'status', 'revenue', 'orderCount', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'desc' : 'asc';
    const searchTerm = typeof search === 'string' ? search.trim().toLowerCase() : '';

    const cacheKey = `${searchTerm}-${sortField}-${sortOrder}`;

    if (cache.has(cacheKey)) {
      const { filteredCustomers, timestamp } = cache.get(cacheKey);
      
      if (Date.now() - timestamp < 300000) {
        return paginateAndRespond(filteredCustomers, pageNum, limitNum, res);
      }
    }

    let filteredCustomers = customers;
    if (searchTerm) {
      filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) || 
        customer.email.toLowerCase().includes(searchTerm)
      );
    }

    filteredCustomers.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    cache.set(cacheKey, {
      filteredCustomers,
      timestamp: Date.now()
    });

    paginateAndRespond(filteredCustomers, pageNum, limitNum, res);

  } catch (error) {
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      request: {
        query: req.query,
        method: req.method
      }
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function paginateAndRespond(data, page, limit, res) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);
  
  const result = paginatedData.map(({ orders, ...customer }) => customer);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({
    data: result,
    total: data.length,
    page,
    limit,
    hasMore: endIndex < data.length
  });
}

export const config = {
  api: {
    responseLimit: '10mb',
    bodyParser: {
      sizeLimit: '10mb'
    }
  },
};

