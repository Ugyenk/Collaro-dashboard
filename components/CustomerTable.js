import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
  Paper,
  CircularProgress,
  TextField,
  Box,
  Alert,
  Button
} from '@mui/material';
import CustomerRow from './CustomerRow';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/customers?page=${page + 1}&limit=${rowsPerPage}&sortBy=${orderBy}&order=${order}&search=${encodeURIComponent(search)}`
      );
      
      if (!response) {
        throw new Error('No response from server');
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data.data)) {
        throw new Error('Invalid data structure received');
      }
      
      setCustomers(data.data);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to load data');
      setCustomers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  
  const retryFetch = () => {
    fetchCustomers();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500); // Add debounce to search
    
    return () => clearTimeout(timer);
  }, [page, rowsPerPage, order, orderBy, search]);
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  return (
    <Paper elevation={3}>
      <Box p={2}>
        <TextField
          label="Search Customers"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          placeholder="Search by name or email..."
        />
      </Box>
      
      {error && (
        <Box p={2}>
          <Alert 
            severity="error"
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={retryFetch}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      )}
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50}>Expand</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'orderCount'}
                  direction={orderBy === 'orderCount' ? order : 'asc'}
                  onClick={() => handleRequestSort('orderCount')}
                >
                  Order Count
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'revenue'}
                  direction={orderBy === 'revenue' ? order : 'asc'}
                  onClick={() => handleRequestSort('revenue')}
                >
                  Total Revenue
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {error ? 'Error loading data' : 'No customers found'}
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomerTable;