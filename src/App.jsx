import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import GuestOnlyRoute from "./components/routing/GuestOnlyRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyBlogsPage from "./pages/MyBlogsPage.jsx";
import NewBlogPage from "./pages/NewBlogPage.jsx";
import EditBlogPage from "./pages/EditBlogPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useAuth } from "./hooks/useAuth.js";

function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <main className="session-loading" aria-live="polite">
        <span className="session-loading__spinner" aria-hidden="true" />
        <p>Restoring your session...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout user={user} onSignOut={signOut} />}>
        {/* Public routes */}
        <Route index element={<HomePage user={user} />} />
        <Route
          path="blogs/:blogId"
          element={<BlogDetailPage userId={user?.id} />}
        />

        {/* Logged-out only: logged-in users are redirected away */}
        <Route element={<GuestOnlyRoute user={user} />}>
          <Route path="login" element={<LoginPage onSignIn={signIn} />} />
          <Route path="register" element={<RegisterPage onSignUp={signUp} />} />
        </Route>

        {/* Logged-in only: logged-out users are sent to /login */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="my-blogs" element={<MyBlogsPage userId={user?.id} />} />
          <Route path="blogs/new" element={<NewBlogPage user={user} />} />
          <Route
            path="blogs/:blogId/edit"
            element={<EditBlogPage userId={user?.id} />}
          />
        </Route>

        {/* Always keep the 404 route last */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
