import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Products from './pages/Products';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Order from './pages/Order';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Careers from './pages/Careers';
import JobDetails from './pages/JobDetails';
import JobApplication from './pages/JobApplication';
import BlogDetails from './pages/BlogDetails';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminMessages from './pages/admin/AdminMessages';
import AdminTasks from './pages/admin/AdminTasks';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="Business" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetails />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:category" element={<Products />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetails />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="order" element={<Order />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="contact" element={<Contact />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/job/:id" element={<JobDetails />} />
        <Route path="careers/apply/:id" element={<JobApplication />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<ProtectedRoute role="client"><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin — standalone UI, separate from the public marketing site */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute role="admin" redirectTo="/admin/login"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
