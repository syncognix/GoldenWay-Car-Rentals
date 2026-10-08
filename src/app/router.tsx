import { createBrowserRouter } from 'react-router'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import {
  HomePage,
  FleetPage,
  VehiclePage,
  BookPage,
  HowItWorksPage,
  AboutPage,
  WhyPage,
  LocationsPage,
  GalleryPage,
  ReviewsPage,
  FaqPage,
  ContactPage,
  PoliciesPage,
  NotFoundPage,
} from './pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'fleet', element: <FleetPage /> },
      { path: 'fleet/:slug', element: <VehiclePage /> },
      { path: 'book', element: <BookPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'why-goldenway', element: <WhyPage /> },
      { path: 'locations', element: <LocationsPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'policies', element: <PoliciesPage /> },
      { path: '404', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
