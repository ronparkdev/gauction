import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, CssBaseline, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'

import Controller from 'service/components/Controller'
import Map from 'service/components/Map'
import pipeHOC from 'service/utils/hoc/pipeHOC'
import { styling, StylingProps } from 'service/utils/hoc/styling'

interface OwnProps extends StylingProps {}

const drawerWidth = 240

const App = ({ cx }: OwnProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = <Controller />

  const container = window !== undefined ? () => window.document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mr: { sm: `${drawerWidth}px` },
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Stack sx={{ height: '100vh' }}>
          <Toolbar />
          <Map />
        </Stack>
      </Box>
      <Box component="aside" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  )
  // return (
  //   <div className={cx('app')}>
  //     <div className={cx('map')}>
  //       <Map />
  //     </div>
  //     <Drawer
  //       variant="temporary"
  //       ModalProps={{
  //         keepMounted: true,
  //       }}>
  //       <Controller />
  //     </Drawer>
  //   </div>
  // )
}

export default pipeHOC(App, styling(require('./App.module.scss')))
