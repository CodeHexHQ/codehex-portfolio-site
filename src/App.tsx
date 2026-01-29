import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/theme-provider";
import { MainLayout } from "./layouts/main-layout";
import { Home } from "./pages/home";
import { Services } from "./pages/services";
import { Contact } from "./pages/contact";
import { CaseStudies } from "./pages/case-studies";
import { About } from "./pages/about";
import { Testimonials } from "./pages/testimonials";
import { Blog } from "./pages/blog";
import { AdminLogin } from "./pages/admin/login";
import { LeadsPage } from "./pages/admin/leads";
import { FeedbackPage } from "./pages/admin/feedback";
import { BlogListPage } from "./pages/admin/blog/index";
import { BlogEditorPage } from "./pages/admin/blog/editor";
import { BlogPost } from "./pages/blog-post";
import { ServicesPage } from "./pages/admin/services";
import { FeaturedWorkPage } from "./pages/admin/featured-work";
import { TeamPage } from "./pages/admin/team";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="about" element={<About />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/leads" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/leads" element={<LeadsPage />} />
          <Route path="/admin/services" element={<ServicesPage />} />
          <Route path="/admin/featured-work" element={<FeaturedWorkPage />} />
          <Route path="/admin/team" element={<TeamPage />} />
          <Route path="/admin/feedback" element={<FeedbackPage />} />
          <Route path="/admin/blog" element={<BlogListPage />} />
          <Route path="/admin/blog/new" element={<BlogEditorPage />} />
          <Route path="/admin/blog/edit/:id" element={<BlogEditorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
