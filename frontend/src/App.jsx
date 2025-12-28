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
            </Routes>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
