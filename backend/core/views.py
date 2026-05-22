from django.utils import timezone
from django.db.models import Sum, Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Product, Customer, Order, AuditTrail, SystemUpdate
from .serializers import (
    CustomTokenObtainPairSerializer, UserSerializer, ProductSerializer,
    CustomerSerializer, OrderSerializer, AuditTrailSerializer,
    SystemUpdateSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:

            username = request.data.get('username')
            try:
                user = User.objects.get(username=username)
                AuditTrail.objects.create(action='Login', user=user)
            except User.DoesNotExist:
                pass
        return response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset().exclude(is_superuser=True)
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                first_name__icontains=search
            ) | qs.filter(last_name__icontains=search) | qs.filter(username__icontains=search)
        return qs

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        AuditTrail.objects.create(action=f'Deleted user {instance.username}', user=request.user)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        status = 'Approved' if self.request.user.role == 'IT Administrator' else 'Pending'
        user = serializer.save(approval_status=status)
        AuditTrail.objects.create(
            action=f'Created user {user.username} as {status}',
            user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        user = self.get_object()
        user.approval_status = 'Approved'
        user.save()
        AuditTrail.objects.create(action=f'Approved user {user.username}', user=request.user)
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        user = self.get_object()
        user.approval_status = 'Rejected'
        user.is_active = False
        user.save()
        AuditTrail.objects.create(action=f'Rejected user {user.username}', user=request.user)
        return Response({'status': 'rejected'})


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('code')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(code__icontains=search)
        return qs

    def perform_create(self, serializer):
        status = 'Approved' if self.request.user.role == 'IT Administrator' else 'Pending'
        product = serializer.save(approval_status=status)
        AuditTrail.objects.create(
            action=f'Created product {product.name} ({product.code}) as {status}',
            user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        product = self.get_object()
        product.approval_status = 'Approved'
        product.save()
        AuditTrail.objects.create(action=f'Approved product {product.name}', user=request.user)
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        product = self.get_object()
        product.approval_status = 'Rejected'
        product.status = 'Inactive'
        product.save()
        AuditTrail.objects.create(action=f'Rejected product {product.name}', user=request.user)
        return Response({'status': 'rejected'})

    def perform_update(self, serializer):
        old_instance = self.get_object()
        old_price = old_instance.base_price

        new_instance = serializer.save()

        if old_instance.base_price != new_instance.base_price:
            SystemUpdate.objects.create(
                update_log=f'[ORDERS] Price for {new_instance.name} has been updated from ₱{old_price} to ₱{new_instance.base_price}'
            )
        AuditTrail.objects.create(
            action=f'Updated product {new_instance.name}',
            user=self.request.user
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        AuditTrail.objects.create(
            action=f'Deleted product {instance.name} ({instance.code})',
            user=request.user
        )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('hauler_name')
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(hauler_name__icontains=search) | qs.filter(plate_number__icontains=search)
        return qs

    def perform_create(self, serializer):
        status = 'Approved' if self.request.user.role == 'IT Administrator' else 'Pending'
        customer = serializer.save(approval_status=status)
        AuditTrail.objects.create(
            action=f'Created customer {customer.hauler_name} ({customer.plate_number}) as {status}',
            user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        customer = self.get_object()
        customer.approval_status = 'Approved'
        customer.save()
        AuditTrail.objects.create(action=f'Approved customer {customer.hauler_name}', user=request.user)
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        customer = self.get_object()
        customer.approval_status = 'Rejected'
        customer.save()
        AuditTrail.objects.create(action=f'Rejected customer {customer.hauler_name}', user=request.user)
        return Response({'status': 'rejected'})

    def perform_update(self, serializer):
        customer = serializer.save()
        AuditTrail.objects.create(
            action=f'Updated customer {customer.hauler_name} ({customer.plate_number})',
            user=self.request.user
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        AuditTrail.objects.create(
            action=f'Deleted customer {instance.hauler_name} ({instance.plate_number})',
            user=request.user
        )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(created_at__date=date)
        return qs

    def perform_create(self, serializer):
        status = 'Approved' if self.request.user.role == 'IT Administrator' else 'Pending'
        order = serializer.save(processed_by=self.request.user, approval_status=status)
        AuditTrail.objects.create(
            action=f'Processed order #{order.invoice_number} as {status}',
            user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        order = self.get_object()
        order.approval_status = 'Approved'
        order.save()
        AuditTrail.objects.create(action=f'Approved order #{order.invoice_number}', user=request.user)
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)
        order = self.get_object()
        order.approval_status = 'Rejected'
        order.status = 'Cancelled'
        order.save()
        AuditTrail.objects.create(action=f'Rejected order #{order.invoice_number}', user=request.user)
        return Response({'status': 'rejected'})

    def perform_update(self, serializer):
        order = serializer.save()
        AuditTrail.objects.create(
            action=f'Updated order #{order.invoice_number}',
            user=self.request.user
        )

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        order = self.get_object()
        order.status = 'Paid'
        order.save()
        AuditTrail.objects.create(
            action=f'Marked order #{order.invoice_number} as Paid',
            user=request.user
        )
        return Response({'status': 'Order marked as paid'})


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        sales_today = Order.objects.filter(created_at__date=today).count()
        pending_orders = Order.objects.filter(status='Pending').count()
        active_products = Product.objects.filter(status='Active').count()
        active_users = User.objects.filter(is_active=True, is_superuser=False).count()

        # Revenue trend by month for current year
        from django.db.models.functions import TruncMonth
        revenue_by_month = (
            Order.objects.filter(
                created_at__year=today.year,
                status='Paid'
            )
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('product__base_price'))
            .order_by('month')
        )

        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        trend = [{'month': m, 'revenue': 0} for m in months]

        for entry in revenue_by_month:
            if entry['month']:
                idx = entry['month'].month - 1
                trend[idx]['revenue'] = float(entry['total'] or 0)

        pending_approvals = (
            Product.objects.filter(approval_status='Pending').count() +
            Customer.objects.filter(approval_status='Pending').count() +
            Order.objects.filter(approval_status='Pending').count() +
            User.objects.filter(approval_status='Pending').count()
        )

        return Response({
            'sales_today': sales_today,
            'pending_orders': pending_orders,
            'active_products': active_products,
            'active_users': active_users,
            'revenue_trend': trend,
            'pending_approvals': pending_approvals,
        })


class PendingApprovalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'IT Administrator':
            return Response({'error': 'Unauthorized'}, status=403)

        approvals = []

        for p in Product.objects.filter(approval_status='Pending'):
            created_at = timezone.make_aware(timezone.datetime.combine(p.created_at, timezone.datetime.min.time()))
            approvals.append({
                'id': f"product_{p.id}",
                'type': 'Product',
                'name': p.name,
                'message': f"New product request: {p.name} ({p.code})",
                'created_at': created_at,
            })

        for c in Customer.objects.filter(approval_status='Pending'):
            approvals.append({
                'id': f"customer_{c.id}",
                'type': 'Customer',
                'name': c.hauler_name,
                'message': f"New customer request: {c.hauler_name}",
                'created_at': c.created_at,
            })

        for o in Order.objects.filter(approval_status='Pending'):
            emp_name = o.processed_by.get_full_name() if o.processed_by else "Employee"
            approvals.append({
                'id': f"order_{o.invoice_number}",
                'type': 'Order',
                'name': f"Order #{o.invoice_number}",
                'message': f"{emp_name} requested a new order",
                'created_at': o.created_at,
            })

        for u in User.objects.filter(approval_status='Pending'):
            approvals.append({
                'id': f"user_{u.id}",
                'type': 'User',
                'name': u.username,
                'message': f"New user request: {u.username}",
                'created_at': u.date_joined,
            })

        # Sort by most recent
        approvals.sort(key=lambda x: x['created_at'], reverse=True)
        return Response(approvals)


class ReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(status='Paid')
        total_revenue = sum(o.total_price for o in orders)
        total_transactions = orders.count()
        total_volume = sum(o.total_cubic for o in orders)
        total_weight = sum(float(o.amount) for o in Order.objects.all())

        return Response({
            'total_revenue': total_revenue,
            'total_transactions': total_transactions,
            'total_volume': total_volume,
            'total_weight': total_weight,
        })

    def post(self, request):
        """Called by the frontend when the user clicks Export Report."""
        AuditTrail.objects.create(
            action='Exported report',
            user=request.user
        )
        return Response({'detail': 'Export logged.'}, status=status.HTTP_200_OK)


class AuditTrailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditTrail.objects.all()
    serializer_class = AuditTrailSerializer
    permission_classes = [IsAuthenticated]


class SystemUpdateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SystemUpdate.objects.all()
    serializer_class = SystemUpdateSerializer
    permission_classes = [IsAuthenticated]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
