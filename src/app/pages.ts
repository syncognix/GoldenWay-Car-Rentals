import { lazy } from 'react'
import Home from '../pages/HomePage'

// Home ships in the main bundle (it's the LCP-critical landing page);
// every other page is code-split.
export const FleetPage = lazy(() => import('../pages/FleetPage'))
export const VehiclePage = lazy(() => import('../pages/VehiclePage'))
export const BookPage = lazy(() => import('../pages/BookPage'))
export const HowItWorksPage = lazy(() => import('../pages/HowItWorksPage'))
export const AboutPage = lazy(() => import('../pages/AboutPage'))
export const WhyPage = lazy(() => import('../pages/WhyPage'))
export const LocationsPage = lazy(() => import('../pages/LocationsPage'))
export const GalleryPage = lazy(() => import('../pages/GalleryPage'))
export const ReviewsPage = lazy(() => import('../pages/ReviewsPage'))
export const FaqPage = lazy(() => import('../pages/FaqPage'))
export const ContactPage = lazy(() => import('../pages/ContactPage'))
export const PoliciesPage = lazy(() => import('../pages/PoliciesPage'))
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const HomePage = Home
