from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ProductViewSet, CustomerViewSet, OrderViewSet,
    AuditTrailViewSet, SystemUpdateViewSet, DashboardView, ReportsView, MeView,
    PendingApprovalsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'audit-trail', AuditTrailViewSet)
router.register(r'system-updates', SystemUpdateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('pending-approvals/', PendingApprovalsView.as_view(), name='pending_approvals'),
    path('reports/', ReportsView.as_view(), name='reports'),
    path('me/', MeView.as_view(), name='me'),
]
