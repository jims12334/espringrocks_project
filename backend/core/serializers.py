from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Product, Customer, Order, AuditTrail, SystemUpdate


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'full_name': self.user.get_full_name(),
            'role': self.user.role,
            'email': self.user.email,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'middle_name', 'last_name', 'full_name',
                  'username', 'email', 'contact_number', 'role', 'is_active',
                  'date_joined', 'password']

    def get_full_name(self, obj):
        return obj.get_full_name()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    lxw = serializers.ReadOnlyField()

    class Meta:
        model = Customer
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    customer_detail = CustomerSerializer(source='customer', read_only=True)
    product_detail = ProductSerializer(source='product', read_only=True)
    processed_by_name = serializers.SerializerMethodField()
    total_price = serializers.ReadOnlyField()
    initial_price = serializers.ReadOnlyField()
    initial_price_with_vat = serializers.ReadOnlyField()
    total_cubic = serializers.ReadOnlyField()
    lxw = serializers.ReadOnlyField()
    tax_row = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_processed_by_name(self, obj):
        if obj.processed_by:
            return obj.processed_by.get_full_name()
        return None


class AuditTrailSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = AuditTrail
        fields = ['id', 'action', 'username', 'timestamp']

    def get_username(self, obj):
        return obj.user.username if obj.user else 'Unknown'


class SystemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemUpdate
        fields = '__all__'


class DashboardSerializer(serializers.Serializer):
    sales_today = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    active_products = serializers.IntegerField()
    active_users = serializers.IntegerField()
    revenue_trend = serializers.ListField()
