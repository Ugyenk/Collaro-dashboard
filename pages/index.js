import Head from 'next/head';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  useTheme,
  styled 
} from '@mui/material';
import CustomerTable from '../components/CustomerTable';
import ErrorBoundary from '../components/ErrorBoundary';

const StyledHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
}));

export default function Home() {
  const theme = useTheme();

  return (
    <div>
      <Head>
        <title>Collaro Customer Dashboard</title>
        <meta name="description" content="Collaro Bespoke Tailoring Customer Management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <StyledContainer maxWidth="xl">
          <StyledHeader elevation={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <div>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  Collaro Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Bespoke Tailoring Customer Management
                </Typography>
              </div>
              <Box 
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  {new Date().getDate()}
                </Typography>
              </Box>
            </Box>
          </StyledHeader>

          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: theme.shape.borderRadius * 2,
              boxShadow: theme.shadows[2],
              minHeight: '60vh'
            }}
          >
            <ErrorBoundary>
              <CustomerTable />
            </ErrorBoundary>
          </Paper>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Collaro Tailoring • v1.0.0
            </Typography>
          </Box>
        </StyledContainer>
      </main>
    </div>
  );
}