import { Card, CardContent, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import Grid from '@mui/material/Grid'
import { LocationOn, Phone, Map, AccessTime, Info, Pool, FitnessCenter, Restaurant, Casino } from '@mui/icons-material'

export default function HotelInfo() {
  const hotelInfo = {
    name: 'Caesars Southern Indiana',
    address: '11999 Casino Center Drive, Elizabeth, IN 47117',
    phone: '(812) 969-5000',
    checkIn: '4:00 PM',
    checkOut: '11:00 AM',
    mapLink: 'https://maps.google.com/?q=Caesars+Southern+Indiana'
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
          Hotel Information
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {hotelInfo.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {hotelInfo.address}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ fontSize: 18 }} />
                Check-in/Check-out
              </Typography>
              <Box sx={{ pl: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Check-in: {hotelInfo.checkIn}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check-out: {hotelInfo.checkOut}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  component="a"
                  href={`tel:${hotelInfo.phone}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <Phone sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {hotelInfo.phone}
                  </Typography>
                </Box>
                <Box
                  component="a"
                  href={hotelInfo.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <Map sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    Get Directions
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info sx={{ fontSize: 18 }} />
              Important Notes
            </Typography>
            <List dense sx={{ pl: 2 }}>
              <ListItem sx={{ py: 0.25, px: 0 }}>
                <ListItemText
                  primary="Valid photo ID and credit card required at check-in"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.25, px: 0 }}>
                <ListItemText
                  primary="Parking is complimentary for hotel guests"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.25, px: 0 }}>
                <ListItemText
                  primary="Casino floor is 21+ only"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.25, px: 0 }}>
                <ListItemText
                  primary="Room service available 24/7"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'text.secondary' } }}
                />
              </ListItem>
              <ListItem sx={{ py: 0.25, px: 0 }}>
                <ListItemText
                  primary="Free WiFi throughout the property"
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'text.secondary' } }}
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Amenities
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Pool sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2">Pool & Spa</Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenter sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2">Fitness Center</Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Restaurant sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2">Multiple Restaurants</Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Casino sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="body2">Casino</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}