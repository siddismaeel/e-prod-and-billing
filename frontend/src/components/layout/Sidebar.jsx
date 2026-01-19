import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Collapse
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DomainIcon from '@mui/icons-material/Domain';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import LinkIcon from '@mui/icons-material/Link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FactoryIcon from '@mui/icons-material/Factory';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  // { text: 'Sales Orders', icon: <ShoppingCartIcon />, path: '/sales-orders' },
  // { text: 'Purchase Orders', icon: <ReceiptIcon />, path: '/purchase-orders' },
  // { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  // { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

// Menu-to-Right mapping configuration
// Maps menu keys to actual right names as they appear in the API response
const MENU_RIGHT_MAPPING = {
  DASHBOARD: 'Dashboard',
  ORGANIZATION: 'Organization',
  COMPANY: 'Company',
  ROLE: 'Role',
  BRANCH: 'Branch',
  DEPARTMENT: 'Department',
  USER: 'Users',
  CUSTOMER: 'Customer',
  RAW_MATERIAL: 'Raw Material',
  READY_ITEM: 'Ready Item',
  SALES_ORDER: 'Sales Order',
  PURCHASE_ORDER: 'Purchase Order',
  PRODUCTION: 'Production',
  MATERIAL_CONSUMPTION: 'Material Consumption',
  PRODUCTION_RECIPE: 'Production Recipe',
  PROPOSITION: 'Proposition',
  STOCK: 'Stock',
  PAYMENT: 'Payment',
  CASHFLOW: 'Cashflow',
  CUSTOMER_ACCOUNT: 'Customer Account',
};

// Default menus for System_Admin (always visible)
const SYSTEM_ADMIN_DEFAULT_MENUS = [
  'DASHBOARD',
  'ORGANIZATION',
  'COMPANY',
  'ROLE',
  'BRANCH',
  'DEPARTMENT',
  'USER',
];

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [organizationOpen, setOrganizationOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [rawMaterialOpen, setRawMaterialOpen] = useState(false);
  const [readyItemOpen, setReadyItemOpen] = useState(false);
  const [salesOrderOpen, setSalesOrderOpen] = useState(false);
  const [purchaseOrderOpen, setPurchaseOrderOpen] = useState(false);
  const [productionOpen, setProductionOpen] = useState(false);
  const [materialConsumptionOpen, setMaterialConsumptionOpen] = useState(false);
  const [productionRecipeOpen, setProductionRecipeOpen] = useState(false);
  const [propositionOpen, setPropositionOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cashflowOpen, setCashflowOpen] = useState(false);
  const [customerAccountOpen, setCustomerAccountOpen] = useState(false);

  // State for user role and rights
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [userRights, setUserRights] = useState([]);

  // Load currentUser from localStorage and extract roles/rights
  useEffect(() => {
    try {
      const currentUserStr = localStorage.getItem('currentUser');
      if (!currentUserStr) {
        console.warn('No currentUser found in localStorage');
        return;
      }

      const currentUser = JSON.parse(currentUserStr);
      
      // Check if user has System_Admin role
      const checkIsSystemAdmin = (user) => {
        if (!user || !user.roles || !Array.isArray(user.roles)) {
          return false;
        }
        return user.roles.some(role => 
          role.name && role.name.toLowerCase().includes('system_admin')
        );
      };

      const adminStatus = checkIsSystemAdmin(currentUser);
      setIsSystemAdmin(adminStatus);

      // Extract rights from roles
      const extractRights = (user) => {
        if (!user || !user.roles || !Array.isArray(user.roles)) {
          return [];
        }

        const rightsSet = new Set();
        user.roles.forEach(role => {
          // Check for rights array directly in role (new structure)
          if (role.rights && Array.isArray(role.rights)) {
            role.rights.forEach(right => {
              if (right && right.name) {
                rightsSet.add(right.name.trim());
              }
            });
          }
          // Fallback: Check for roleRights structure (old structure)
          else if (role.roleRights && Array.isArray(role.roleRights)) {
            role.roleRights.forEach(roleRight => {
              if (roleRight.right && roleRight.right.name) {
                rightsSet.add(roleRight.right.name.trim());
              }
            });
          }
        });

        return Array.from(rightsSet);
      };

      const rights = extractRights(currentUser);
      setUserRights(rights);
      console.log('Extracted user rights:', rights);
      console.log('Is System Admin:', adminStatus);
    } catch (err) {
      console.error('Error parsing currentUser from localStorage:', err);
    }
  }, []);

  // Helper function to check if user has a specific right
  const hasRight = (rightName) => {
    if (!rightName) return false;
    // Normalize both the right name and user rights for comparison (case-insensitive, trim whitespace)
    const normalizedRightName = rightName.trim();
    return userRights.some(right => right.trim().toLowerCase() === normalizedRightName.toLowerCase());
  };

  // Helper function to determine if a menu should be visible
  const shouldShowMenu = (menuKey) => {
    // System_Admin sees all menus
    if (isSystemAdmin) {
      return true;
    }

    // For other roles, check if they have the corresponding right
    const rightName = MENU_RIGHT_MAPPING[menuKey];
    if (!rightName) {
      console.warn(`No mapping found for menu key: ${menuKey}`);
      return false; // Unknown menu key
    }

    const hasAccess = hasRight(rightName);
    if (!hasAccess) {
      console.log(`Menu ${menuKey} (right: ${rightName}) not accessible. User rights:`, userRights);
    }
    return hasAccess;
  };

  const handleDrawerToggle = () => {
    onMobileClose();
  };

  const handleOrganizationClick = () => {
    setOrganizationOpen(!organizationOpen);
  };

  const handleCompanyClick = () => {
    setCompanyOpen(!companyOpen);
  };

  const handleRoleClick = () => {
    setRoleOpen(!roleOpen);
  };

  const handleBranchClick = () => {
    setBranchOpen(!branchOpen);
  };

  const handleDepartmentClick = () => {
    setDepartmentOpen(!departmentOpen);
  };

  const handleUsersClick = () => {
    setUsersOpen(!usersOpen);
  };

  const handleRawMaterialClick = () => {
    setRawMaterialOpen(!rawMaterialOpen);
  };

  const handleReadyItemClick = () => {
    setReadyItemOpen(!readyItemOpen);
  };

  const handleSalesOrderClick = () => {
    setSalesOrderOpen(!salesOrderOpen);
  };

  const handlePurchaseOrderClick = () => {
    setPurchaseOrderOpen(!purchaseOrderOpen);
  };

  const handleProductionClick = () => {
    setProductionOpen(!productionOpen);
  };

  const handleMaterialConsumptionClick = () => {
    setMaterialConsumptionOpen(!materialConsumptionOpen);
  };

  const handleProductionRecipeClick = () => {
    setProductionRecipeOpen(!productionRecipeOpen);
  };

  const handlePropositionClick = () => {
    setPropositionOpen(!propositionOpen);
  };

  const handleStockClick = () => {
    setStockOpen(!stockOpen);
  };

  const handlePaymentClick = () => {
    setPaymentOpen(!paymentOpen);
  };

  const handleCashflowClick = () => {
    setCashflowOpen(!cashflowOpen);
  };

  const handleCustomerAccountClick = () => {
    setCustomerAccountOpen(!customerAccountOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onMobileClose();
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Organization Menu */}
        {shouldShowMenu('ORGANIZATION') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleOrganizationClick}>
                <ListItemIcon>
                  <CorporateFareIcon />
                </ListItemIcon>
                <ListItemText primary="Organization" />
                {organizationOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={organizationOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/organizations/create'}
                  onClick={() => handleNavigation('/organizations/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Organization" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/organizations/list'}
                  onClick={() => handleNavigation('/organizations/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Organization" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Company Menu */}
        {shouldShowMenu('COMPANY') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCompanyClick}>
                <ListItemIcon>
                  <DomainIcon />
                </ListItemIcon>
                <ListItemText primary="Company" />
                {companyOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={companyOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/companies/create'}
                  onClick={() => handleNavigation('/companies/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Company" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/companies/list'}
                  onClick={() => handleNavigation('/companies/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Company" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Role Menu */}
        {shouldShowMenu('ROLE') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRoleClick}>
                <ListItemIcon>
                  <BadgeIcon />
                </ListItemIcon>
                <ListItemText primary="Role" />
                {roleOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={roleOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/roles/create'}
                  onClick={() => handleNavigation('/roles/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Role" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/roles/list'}
                  onClick={() => handleNavigation('/roles/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Role" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/rights/create'}
                  onClick={() => handleNavigation('/rights/create')}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Right" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/rights/list'}
                  onClick={() => handleNavigation('/rights/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Right" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/role-right-mapping'}
                  onClick={() => handleNavigation('/role-right-mapping')}
                >
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Role Right Mapping" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Branch Menu */}
        {shouldShowMenu('BRANCH') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleBranchClick}>
                <ListItemIcon>
                  <AccountTreeIcon />
                </ListItemIcon>
                <ListItemText primary="Branch" />
                {branchOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={branchOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/branches/create'}
                  onClick={() => handleNavigation('/branches/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Branch" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/branches/list'}
                  onClick={() => handleNavigation('/branches/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Branch" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Department Menu */}
        {shouldShowMenu('DEPARTMENT') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleDepartmentClick}>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Department" />
                {departmentOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={departmentOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/departments/create'}
                  onClick={() => handleNavigation('/departments/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Department" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/departments/list'}
                  onClick={() => handleNavigation('/departments/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Department" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Users Menu */}
        {shouldShowMenu('USER') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleUsersClick}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
                {usersOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/users/create'}
                  onClick={() => handleNavigation('/users/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create User" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/users/list'}
                  onClick={() => handleNavigation('/users/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Users" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Customer Menu */}
        {shouldShowMenu('CUSTOMER') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCustomerOpen(!customerOpen)}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Customer" />
                {customerOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={customerOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/customers/create'}
                  onClick={() => handleNavigation('/customers/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Customer" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/customers/list'}
                  onClick={() => handleNavigation('/customers/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Customer" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Raw Material Menu */}
        {shouldShowMenu('RAW_MATERIAL') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRawMaterialClick}>
                <ListItemIcon>
                  <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary="Raw Material" />
                {rawMaterialOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={rawMaterialOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/raw-materials/create'}
                  onClick={() => handleNavigation('/raw-materials/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Raw Material" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/raw-materials/list'}
                  onClick={() => handleNavigation('/raw-materials/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Raw Material" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Ready Item Menu */}
        {shouldShowMenu('READY_ITEM') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleReadyItemClick}>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Ready Item" />
                {readyItemOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={readyItemOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/ready-items/create'}
                  onClick={() => handleNavigation('/ready-items/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Ready Item" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/ready-items/list'}
                  onClick={() => handleNavigation('/ready-items/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Ready Item" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Sales Order Menu */}
        {shouldShowMenu('SALES_ORDER') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleSalesOrderClick}>
                <ListItemIcon>
                  <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary="Sales Order" />
                {salesOrderOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={salesOrderOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/sales-orders/create'}
                  onClick={() => handleNavigation('/sales-orders/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Sales Order" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/sales-orders/list'}
                  onClick={() => handleNavigation('/sales-orders/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Sales Order" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Purchase Order Menu */}
        {shouldShowMenu('PURCHASE_ORDER') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handlePurchaseOrderClick}>
                <ListItemIcon>
                  <ShoppingBagIcon />
                </ListItemIcon>
                <ListItemText primary="Purchase Order" />
                {purchaseOrderOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={purchaseOrderOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/purchase-orders/create'}
                  onClick={() => handleNavigation('/purchase-orders/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Purchase Order" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/purchase-orders/list'}
                  onClick={() => handleNavigation('/purchase-orders/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Purchase Order" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Production Menu */}
        {shouldShowMenu('PRODUCTION') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProductionClick}>
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary="Production" />
                {productionOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={productionOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/productions/create'}
                  onClick={() => handleNavigation('/productions/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Production" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/productions/list'}
                  onClick={() => handleNavigation('/productions/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Production" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Material Consumption Menu */}
        {shouldShowMenu('MATERIAL_CONSUMPTION') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleMaterialConsumptionClick}>
                <ListItemIcon>
                  <ScienceIcon />
                </ListItemIcon>
                <ListItemText primary="Material Consumption" />
                {materialConsumptionOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={materialConsumptionOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/material-consumptions/create'}
                  onClick={() => handleNavigation('/material-consumptions/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Material Consumption" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/material-consumptions/list'}
                  onClick={() => handleNavigation('/material-consumptions/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Material Consumption" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Production Recipe Menu */}
        {shouldShowMenu('PRODUCTION_RECIPE') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProductionRecipeClick}>
                <ListItemIcon>
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Production Recipe" />
                {productionRecipeOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={productionRecipeOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/production-recipes/create'}
                  onClick={() => handleNavigation('/production-recipes/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Production Recipe" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/production-recipes/list'}
                  onClick={() => handleNavigation('/production-recipes/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Production Recipe" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Proposition Menu */}
        {shouldShowMenu('PROPOSITION') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handlePropositionClick}>
                <ListItemIcon>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Proposition" />
                {propositionOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={propositionOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/propositions/create'}
                  onClick={() => handleNavigation('/propositions/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Proposition" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/propositions/list'}
                  onClick={() => handleNavigation('/propositions/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Proposition" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Stock Menu */}
        {shouldShowMenu('STOCK') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleStockClick}>
                <ListItemIcon>
                  <Inventory2Icon />
                </ListItemIcon>
                <ListItemText primary="Stock" />
                {stockOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={stockOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/stock/raw-material'}
                  onClick={() => handleNavigation('/stock/raw-material')}
                >
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Raw Material Stock" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/stock/ready-item'}
                  onClick={() => handleNavigation('/stock/ready-item')}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Ready Item Stock" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Payment Menu */}
        {shouldShowMenu('PAYMENT') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handlePaymentClick}>
                <ListItemIcon>
                  <PaymentIcon />
                </ListItemIcon>
                <ListItemText primary="Payment" />
                {paymentOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={paymentOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/payments/create'}
                  onClick={() => handleNavigation('/payments/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Payment" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/payments/list'}
                  onClick={() => handleNavigation('/payments/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Payment" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Cashflow Menu */}
        {shouldShowMenu('CASHFLOW') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCashflowClick}>
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText primary="Cashflow" />
                {cashflowOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={cashflowOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/cashflow/list'}
                  onClick={() => handleNavigation('/cashflow/list')}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="List Cashflow" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/cashflow/create'}
                  onClick={() => handleNavigation('/cashflow/create')}
                >
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Create Cashflow Entry" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Customer Account Menu */}
        {shouldShowMenu('CUSTOMER_ACCOUNT') && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleCustomerAccountClick}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Customer Account" />
                {customerAccountOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={customerAccountOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/customer-accounts/view'}
                  onClick={() => handleNavigation('/customer-accounts/view')}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Customer Account" />
                </ListItemButton>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={location.pathname === '/customer-accounts/statement'}
                  onClick={() => handleNavigation('/customer-accounts/statement')}
                >
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customer Account Statement" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export { drawerWidth };


