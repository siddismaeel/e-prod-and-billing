import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import { theme } from './theme/theme';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import CreateOrganization from './pages/organization/CreateOrganization';
import ListOrganization from './pages/organization/ListOrganization';
import CreateCompany from './pages/company/CreateCompany';
import ListCompany from './pages/company/ListCompany';
import CreateRole from './pages/role/CreateRole';
import ListRole from './pages/role/ListRole';
import CreateRight from './pages/right/CreateRight';
import ListRight from './pages/right/ListRight';
import RoleRightMapping from './pages/role/RoleRightMapping';
import CreateBranch from './pages/branch/CreateBranch';
import ListBranch from './pages/branch/ListBranch';
import CreateDepartment from './pages/department/CreateDepartment';
import ListDepartment from './pages/department/ListDepartment';
import CreateUser from './pages/user/CreateUser';
import ListUser from './pages/user/ListUser';
import LoginPage from './pages/auth/LoginPage';
// Customer
import CreateCustomer from './pages/customer/CreateCustomer';
import ListCustomer from './pages/customer/ListCustomer';
// Raw Material
import CreateRawMaterial from './pages/raw-material/CreateRawMaterial';
import ListRawMaterial from './pages/raw-material/ListRawMaterial';
// Ready Item
import CreateReadyItem from './pages/ready-item/CreateReadyItem';
import ListReadyItem from './pages/ready-item/ListReadyItem';
// Sales Order
import CreateSalesOrder from './pages/sales-order/CreateSalesOrder';
import ListSalesOrder from './pages/sales-order/ListSalesOrder';
// Purchase Order
import CreatePurchaseOrder from './pages/purchase-order/CreatePurchaseOrder';
import ListPurchaseOrder from './pages/purchase-order/ListPurchaseOrder';
// Production
import CreateProduction from './pages/production/CreateProduction';
import ListProduction from './pages/production/ListProduction';
// Material Consumption
import CreateMaterialConsumption from './pages/material-consumption/CreateMaterialConsumption';
import ListMaterialConsumption from './pages/material-consumption/ListMaterialConsumption';
// Production Recipe
import CreateProductionRecipe from './pages/production-recipe/CreateProductionRecipe';
import ListProductionRecipe from './pages/production-recipe/ListProductionRecipe';
// Proposition
import CreateProposition from './pages/proposition/CreateProposition';
import ListProposition from './pages/proposition/ListProposition';
// Stock
import RawMaterialStock from './pages/stock/RawMaterialStock';
import ReadyItemStock from './pages/stock/ReadyItemStock';
// Payment
import CreatePayment from './pages/payment/CreatePayment';
import ListPayment from './pages/payment/ListPayment';
// Cashflow
import ListCashflow from './pages/cashflow/ListCashflow';
import CreateCashflowEntry from './pages/cashflow/CreateCashflowEntry';
// Customer Account
import ViewCustomerAccount from './pages/customer-account/ViewCustomerAccount';
import CustomerAccountStatement from './pages/customer-account/CustomerAccountStatement';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                }
              />
              <Route
                path="/organizations/create"
                element={
                  <AppLayout>
                    <CreateOrganization />
                  </AppLayout>
                }
              />
              <Route
                path="/organizations/list"
                element={
                  <AppLayout>
                    <ListOrganization />
                  </AppLayout>
                }
              />
              <Route
                path="/companies/create"
                element={
                  <AppLayout>
                    <CreateCompany />
                  </AppLayout>
                }
              />
              <Route
                path="/companies/list"
                element={
                  <AppLayout>
                    <ListCompany />
                  </AppLayout>
                }
              />
              <Route
                path="/roles/create"
                element={
                  <AppLayout>
                    <CreateRole />
                  </AppLayout>
                }
              />
              <Route
                path="/roles/list"
                element={
                  <AppLayout>
                    <ListRole />
                  </AppLayout>
                }
              />
              <Route
                path="/rights/create"
                element={
                  <AppLayout>
                    <CreateRight />
                  </AppLayout>
                }
              />
              <Route
                path="/rights/list"
                element={
                  <AppLayout>
                    <ListRight />
                  </AppLayout>
                }
              />
              <Route
                path="/role-right-mapping"
                element={
                  <AppLayout>
                    <RoleRightMapping />
                  </AppLayout>
                }
              />
              <Route
                path="/branches/create"
                element={
                  <AppLayout>
                    <CreateBranch />
                  </AppLayout>
                }
              />
              <Route
                path="/branches/list"
                element={
                  <AppLayout>
                    <ListBranch />
                  </AppLayout>
                }
              />
              <Route
                path="/departments/create"
                element={
                  <AppLayout>
                    <CreateDepartment />
                  </AppLayout>
                }
              />
              <Route
                path="/departments/list"
                element={
                  <AppLayout>
                    <ListDepartment />
                  </AppLayout>
                }
              />
              <Route
                path="/users/create"
                element={
                  <AppLayout>
                    <CreateUser />
                  </AppLayout>
                }
              />
              <Route
                path="/users/list"
                element={
                  <AppLayout>
                    <ListUser />
                  </AppLayout>
                }
              />
              {/* Customer Routes */}
              <Route
                path="/customers/create"
                element={
                  <AppLayout>
                    <CreateCustomer />
                  </AppLayout>
                }
              />
              <Route
                path="/customers/list"
                element={
                  <AppLayout>
                    <ListCustomer />
                  </AppLayout>
                }
              />
              {/* Raw Material Routes */}
              <Route
                path="/raw-materials/create"
                element={
                  <AppLayout>
                    <CreateRawMaterial />
                  </AppLayout>
                }
              />
              <Route
                path="/raw-materials/list"
                element={
                  <AppLayout>
                    <ListRawMaterial />
                  </AppLayout>
                }
              />
              {/* Ready Item Routes */}
              <Route
                path="/ready-items/create"
                element={
                  <AppLayout>
                    <CreateReadyItem />
                  </AppLayout>
                }
              />
              <Route
                path="/ready-items/list"
                element={
                  <AppLayout>
                    <ListReadyItem />
                  </AppLayout>
                }
              />
              {/* Sales Order Routes */}
              <Route
                path="/sales-orders/create"
                element={
                  <AppLayout>
                    <CreateSalesOrder />
                  </AppLayout>
                }
              />
              <Route
                path="/sales-orders/list"
                element={
                  <AppLayout>
                    <ListSalesOrder />
                  </AppLayout>
                }
              />
              {/* Purchase Order Routes */}
              <Route
                path="/purchase-orders/create"
                element={
                  <AppLayout>
                    <CreatePurchaseOrder />
                  </AppLayout>
                }
              />
              <Route
                path="/purchase-orders/list"
                element={
                  <AppLayout>
                    <ListPurchaseOrder />
                  </AppLayout>
                }
              />
              {/* Production Routes */}
              <Route
                path="/productions/create"
                element={
                  <AppLayout>
                    <CreateProduction />
                  </AppLayout>
                }
              />
              <Route
                path="/productions/list"
                element={
                  <AppLayout>
                    <ListProduction />
                  </AppLayout>
                }
              />
              {/* Material Consumption Routes */}
              <Route
                path="/material-consumptions/create"
                element={
                  <AppLayout>
                    <CreateMaterialConsumption />
                  </AppLayout>
                }
              />
              <Route
                path="/material-consumptions/list"
                element={
                  <AppLayout>
                    <ListMaterialConsumption />
                  </AppLayout>
                }
              />
              {/* Production Recipe Routes */}
              <Route
                path="/production-recipes/create"
                element={
                  <AppLayout>
                    <CreateProductionRecipe />
                  </AppLayout>
                }
              />
              <Route
                path="/production-recipes/list"
                element={
                  <AppLayout>
                    <ListProductionRecipe />
                  </AppLayout>
                }
              />
              {/* Proposition Routes */}
              <Route
                path="/propositions/create"
                element={
                  <AppLayout>
                    <CreateProposition />
                  </AppLayout>
                }
              />
              <Route
                path="/propositions/list"
                element={
                  <AppLayout>
                    <ListProposition />
                  </AppLayout>
                }
              />
              {/* Stock Routes */}
              <Route
                path="/stock/raw-material"
                element={
                  <AppLayout>
                    <RawMaterialStock />
                  </AppLayout>
                }
              />
              <Route
                path="/stock/ready-item"
                element={
                  <AppLayout>
                    <ReadyItemStock />
                  </AppLayout>
                }
              />
              {/* Payment Routes */}
              <Route
                path="/payments/create"
                element={
                  <AppLayout>
                    <CreatePayment />
                  </AppLayout>
                }
              />
              <Route
                path="/payments/list"
                element={
                  <AppLayout>
                    <ListPayment />
                  </AppLayout>
                }
              />
              {/* Cashflow Routes */}
              <Route
                path="/cashflow/list"
                element={
                  <AppLayout>
                    <ListCashflow />
                  </AppLayout>
                }
              />
              <Route
                path="/cashflow/create"
                element={
                  <AppLayout>
                    <CreateCashflowEntry />
                  </AppLayout>
                }
              />
              {/* Customer Account Routes */}
              <Route
                path="/customer-accounts/view"
                element={
                  <AppLayout>
                    <ViewCustomerAccount />
                  </AppLayout>
                }
              />
              <Route
                path="/customer-accounts/statement"
                element={
                  <AppLayout>
                    <CustomerAccountStatement />
                  </AppLayout>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
