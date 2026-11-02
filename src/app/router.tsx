import {
    createBrowserRouter,
    Outlet,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Ministries from "../pages/Ministries/Ministries";
import ProjectHeal from "../pages/ProjectHeal/ProjectHeal";
import ProjectMove from "../pages/ProjectMove/ProjectMove";
import Blog from "../pages/Blog/Blog";
import BlogPost from "../pages/Blog/BlogPost";
import Chapters from "../pages/Chapters/Chapters";
import ChapterDetail from "../pages/ChapterDetail/ChapterDetail";
import Events from "../pages/Events/Events";
import EventDetail from "../pages/EventDetail/EventDetail";
import Media from "../pages/Media/Media";
import InviteUs from "../pages/InviteUs/InviteUs";
import Volunteer from "../pages/Volunteer/Volunteer";
import NotFound from "../pages/NotFound";

import AdminLogin from "../pages/Admin/AdminLogin";
import AdminShell from "../pages/Admin/AdminShell";
import AdminHome from "../pages/Admin/AdminHome";
import RequireRole from "../pages/Admin/components/RequireRole";
import CommentsQueue from "../pages/Admin/queues/CommentsQueue";
import MediaQueue from "../pages/Admin/queues/MediaQueue";
import PrayerQueue from "../pages/Admin/queues/PrayerQueue";
import ChapterJoinQueue from "../pages/Admin/queues/ChapterJoinQueue";
import VolunteerQueue from "../pages/Admin/queues/VolunteerQueue";
import InvitationsQueue from "../pages/Admin/queues/InvitationsQueue";
import BlogList from "../pages/Admin/content/blog/BlogList";
import BlogForm from "../pages/Admin/content/blog/BlogForm";
import EventsList from "../pages/Admin/content/events/EventsList";
import EventForm from "../pages/Admin/content/events/EventForm";
import ChaptersList from "../pages/Admin/content/chapters/ChaptersList";
import ChapterForm from "../pages/Admin/content/chapters/ChapterForm";
import VideosList from "../pages/Admin/content/videos/VideosList";
import VideoForm from "../pages/Admin/content/videos/VideoForm";

function RootLayout() {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/ministries",
                element: <Ministries />,
            },
            {
                path: "/project-heal",
                element: <ProjectHeal />,
            },
            {
                path: "/project-move",
                element: <ProjectMove />,
            },
            {
                path: "/blog",
                element: <Blog />,
            },
            {
                path: "/blog/:slug",
                element: <BlogPost />,
            },
            {
                path: "/chapters",
                element: <Chapters />,
            },
            {
                path: "/chapters/:slug",
                element: <ChapterDetail />,
            },
            {
                path: "/events",
                element: <Events />,
            },
            {
                path: "/events/:slug",
                element: <EventDetail />,
            },
            {
                path: "/media",
                element: <Media />,
            },
            {
                path: "/invite-us",
                element: <InviteUs />,
            },
            {
                path: "/volunteer",
                element: <Volunteer />,
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ],
    },
    // Admin lives outside RootLayout deliberately — no persistent R3F canvas,
    // no Lenis smooth scroll, no page-transition choreography. It's a
    // conventional productivity UI, not part of the public experience.
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/admin",
        element: <AdminShell />,
        children: [
            {
                index: true,
                element: <AdminHome />,
            },
            {
                path: "comments",
                element: <CommentsQueue />,
            },
            {
                path: "media",
                element: <MediaQueue />,
            },
            {
                path: "prayer-requests",
                element: (
                    <RequireRole role="admin">
                        <PrayerQueue />
                    </RequireRole>
                ),
            },
            {
                path: "chapter-join-requests",
                element: (
                    <RequireRole role="admin">
                        <ChapterJoinQueue />
                    </RequireRole>
                ),
            },
            {
                path: "volunteer-applications",
                element: (
                    <RequireRole role="admin">
                        <VolunteerQueue />
                    </RequireRole>
                ),
            },
            {
                path: "invitations",
                element: (
                    <RequireRole role="admin">
                        <InvitationsQueue />
                    </RequireRole>
                ),
            },
            // Blog posts and events fall under migration 001's "staff manage"
            // RLS policy (editor/administrator/super_admin); no extra guard
            // needed beyond AdminShell's own staff-level RequireRole.
            {
                path: "blog",
                element: <BlogList />,
            },
            {
                path: "blog/:id",
                element: <BlogForm />,
            },
            {
                path: "events",
                element: <EventsList />,
            },
            {
                path: "events/:id",
                element: <EventForm />,
            },
            // Chapters fall under the "admin manage" RLS policy — administrators
            // and super_admins only, editors excluded — so these routes get the
            // same admin-only guard as the admin-tier moderation queues above.
            {
                path: "chapters",
                element: (
                    <RequireRole role="admin">
                        <ChaptersList />
                    </RequireRole>
                ),
            },
            {
                path: "chapters/:id",
                element: (
                    <RequireRole role="admin">
                        <ChapterForm />
                    </RequireRole>
                ),
            },
            // Homepage videos are ordinary homepage content, not a
            // moderation/admin-tier resource — staff-level access, same as
            // blog posts and events.
            {
                path: "videos",
                element: <VideosList />,
            },
            {
                path: "videos/:id",
                element: <VideoForm />,
            },
        ],
    },
]);